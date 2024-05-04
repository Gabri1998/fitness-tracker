const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Session = require("../models/Session");
const Exercise = require("../models/Exercise");

router.get("/", async (req, res, next) => {
  try {
    const filtername = req.query.name;
    const filters = {};
    if (filtername) {
      filters.name = filtername;
    }

    const exercises = await Exercise.find({ userId: req.userid });
    if (exercises == null) {
      res.status(404).json({ message: "Exercises not found" });
    } else {
      res.status(200).json(exercises);
    }
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const exercise = await Exercise.findById(id);
    if (exercise == null) {
      res.status(404).json({ message: "Exercise not found" });
    } else {
      res.status(200).json(exercise);
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const exerciseData = {
    ...req.body,
    userId: req.userid,
  };

  try {
    const exercise = new Exercise(exerciseData);

    await exercise.save();

    res.status(201).json(exercise);
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const exercise = await Exercise.findById(id);
    if (exercise == null) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    exercise.name = req.body.name;
    exercise.instruction = req.body.instruction;
    exercise.level = req.body.level;
    exercise.sessions = req.body.sessions;

    await exercise.save();
    res.status(200).json(exercise);
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const exercise = await Exercise.findById(id);
    if (exercise == null) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    exercise.name = req.body.name || exercise.name;
    exercise.instruction = req.body.instruction || exercise.instruction;
    exercise.level = req.body.level || exercise.level;
    exercise.sessions = req.body.sessions || exercise.sessions;

    await exercise.save();
    res.status(200).json(exercise);
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const exercise = await Exercise.findOneAndDelete({ _id: id });
    if (exercise == null) {
      res.status(404).json({ message: "Exercise not found" });
    } else {
      res.status(200).json({ message: "Exercise deleted" });
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const exercises = await Exercise.deleteMany();
    res.status(200).json({ message: "Exercises deleted", exercises });
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

module.exports = router;
