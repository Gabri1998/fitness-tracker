const express = require("express");
const multer = require("multer");
const router = express.Router();
const Exercise = require("../models/Exercise");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to format exercise data with base64-encoded file data
const formatExerciseData = (exercise) => {
  const exerciseData = exercise.toObject();
  
  if (exercise.fileData) {
    exerciseData.fileContent = `data:${exercise.fileType};base64,${exercise.fileData.toString("base64")}`;
  } else {
    exerciseData.fileContent = null;
  }
  
  return exerciseData;
};


// GET all exercises with base64-encoded file data
router.get("/", async (req, res, next) => {
  try {
    const filters = { userId: req.userid };
    const exercises = await Exercise.find(filters);

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: "No exercises found" });
    }

    const formattedExercises = exercises.map(formatExerciseData);
    res.status(200).json(formattedExercises);
  } catch (error) {
    next(error);
  }
});

// GET a single exercise by ID with base64-encoded file data
router.get("/:id", async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.status(200).json(formatExerciseData(exercise));
  } catch (error) {
    next(error);
  }
});

router.post("/", upload.single("file"), async (req, res, next) => {
  const exerciseData = {
    name: req.body.name,
    level: req.body.level,
    instruction: req.body.instruction,
    userId: req.userid,
  };

  if (req.file) {
    exerciseData.fileData = req.file.buffer;
    exerciseData.fileType = req.file.mimetype;
    exerciseData.fileName = req.file.originalname;
  }

  try {
    const exercise = new Exercise(exerciseData);
    await exercise.save();
    res.status(201).json(formatExerciseData(exercise));
  } catch (error) {
    console.error("Error saving exercise:", error);
    next(error);
  }
});


// PATCH to update an exercise and replace file if uploaded
router.patch("/:id", upload.single("file"), async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Update fields
    exercise.name = req.body.name || exercise.name;
    exercise.instruction = req.body.instruction || exercise.instruction;
    exercise.level = req.body.level || exercise.level;

    // Replace the file if a new one is uploaded
    if (req.file) {
      exercise.fileData = req.file.buffer;
      exercise.fileType = req.file.mimetype;
      exercise.fileName = req.file.originalname;
    }

    await exercise.save();
    res.status(200).json({
      message: "Exercise updated successfully",
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE an exercise by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// DELETE all exercises for the authenticated user
router.delete("/", async (req, res, next) => {
  try {
    await Exercise.deleteMany({ userId: req.userid });
    res.status(200).json({ message: "All exercises deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
