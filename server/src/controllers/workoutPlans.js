const express = require("express");
const router = express.Router();
const WorkoutPlan = require("../models/WorkoutPlan");
const Session = require("../models/Session");

// POST endpoint to create a new WorkoutPlan
router.post("/", async (req, res) => {
  const workoutPlanData = {
    ...req.body,
    userId: req.userid,
    dateCreated: new Date(),
  };
  console.log(req.userid);
  const newWorkoutPlan = new WorkoutPlan(workoutPlanData); // instance created for the model
  try {
    await newWorkoutPlan.save(); // saving it
    res.status(201).send(newWorkoutPlan);
  } catch (error) {
    console.log(error); // print out the error
    res.status(400).send({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.find({ userId: req.userid });
    res.status(200).send(workoutPlan);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// GET route: Fetch a WorkoutPlan by its unique _id

// Hateos
router.get("/:id", async (req, res) => {
  try {
    // Attempt to retrieve the WorkoutPlan using its _id
    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    // If no matching plan is found, respond with a 404 status
    if (!workoutPlan) {
      return res.status(404).json({ message: "WorkoutPlan not found!" });
    }

    // Send the retrieved plan as a response
    res.status(200).json(workoutPlan, [
      {
        rel: "sessions",
        method: "GET",
        title: "Get Workout-plan sessions",
        href: `/workoutplans/${req.params.id}/sessions`,
      },
      {
        rel: "self",
        method: "DELETE",
        title: "Delete current Workout",
        href: `/workoutplans/${req.params.id}`,
      },
    ]);
  } catch (error) {
    // If there's any error during the process, send a 500 error message
    res.status(500).json({ message: "An error occurred!" });
  }
});

// PATCH route: Partially update specific fields of a WorkoutPlan
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["dateCreated", "duration", "type"];

  // Ensure that only the allowed fields are being updated
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    // Find the WorkoutPlan by its _id
    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    // If the plan is not found, respond with a 404 status
    if (!workoutPlan) {
      return res.status(404).json({ message: "WorkoutPlan not found!" });
    }

    // Loop through each of the updates and apply them to our plan
    updates.forEach((update) => (workoutPlan[update] = req.body[update]));

    // Save the updated WorkoutPlan to the database
    await workoutPlan.save();

    // Send the updated WorkoutPlan back to the client
    res.status(200).json(workoutPlan);
  } catch (error) {
    // Handle any errors during the update process
    res.status(400).json({ message: "An error occurred!" });
  }
});

// PUT route: Update a WorkoutPlan entirely based on provided fields
router.put("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["dateCreated", "duration", "type"];

  // Ensure all fields are valid for updating
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    // Retrieve the plan to be updated
    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    // If the plan isn't found, send a 404 response
    if (!workoutPlan) {
      return res.status(404).json({ message: "WorkoutPlan not found!" });
    }

    // Update each field of the plan
    updates.forEach((update) => (workoutPlan[update] = req.body[update]));

    // Save the updated plan to the database
    await workoutPlan.save();

    // Send the updated plan back to the client
    res.status(200).json(workoutPlan);
  } catch (error) {
    // Handle any potential errors
    res.status(400).json({ message: "An error occurred!" });
  }
});

// DELETE route: Remove a WorkoutPlan using its unique _id
router.delete("/:id", async (req, res) => {
  try {
    // Attempt to delete the WorkoutPlan
    const workoutPlan = await WorkoutPlan.findByIdAndDelete(req.params.id);

    // If no matching plan is found to delete, respond with a 404 status
    if (!workoutPlan) {
      return res.status(404).json({ message: "WorkoutPlan not found!" });
    }

    // Confirm successful deletion
    res.status(200).json({ message: "WorkoutPlan deleted successfully!" });
  } catch (error) {
    // Handle any errors during deletion
    res.status(500).json({ message: "An error occurred!" });
  }
});

// DELETE route: Remove all WorkoutPlan records
router.delete("/", async (req, res) => {
  try {
    await WorkoutPlan.deleteMany({});
    // Respond with a success message
    res.status(200).json({ message: "All workout plans have been deleted." });
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({ message: "An error occurred!" });
  }
});

// Add session to workout plan
router.post("/:workoutplanid/sessions", async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.workoutplanid);
    if (!workoutPlan) {
      return res.status(404).json({ message: "WorkoutPlan not found!" });
    }

    const session = new Session({
      ...req.body,
      workoutplan: req.params.workoutplanid,
    });
    await session.save();

    // Add the session to the workout plan's sessions array
    workoutPlan.sessions.push(session._id); // Push the session's _id
    await workoutPlan.save();

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred!" });
  }
});
//Retrieve All Sessions for a WorkoutPlan

router.get("/:workoutplanid/sessions", async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(
      req.params.workoutplanid
    ).populate("sessions");
    if (!workoutPlan) {
      return res.status(404).json({ message: "WorkoutPlan not found!" });
    }

    res.status(200).json(workoutPlan.sessions);
  } catch (error) {
    res.status(400).json({ message: "An error occurred!" });
  }
});

//Retrieve a Specific Session for a WorkoutPlan
router.get("/:workoutplanid/sessions/:sessionid", async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionid,
      workoutplan: req.params.workoutplanid,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found!" });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ message: "An error occurred!" });
  }
});

// Remove a Specific Session from a WorkoutPlan:
router.delete("/:workoutplanid/sessions/:sessionid", async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.workoutplanid);
    if (!workoutPlan) {
      return res.status(404).json({ message: "WorkoutPlan not found!" });
    }

    // Remove the session from the workout plan's sessions array
    workoutPlan.sessions.pull(req.params.sessionid); // Just pass the session_id
    await workoutPlan.save();

    // Delete the session
    await Session.findByIdAndDelete(req.params.sessionid);

    res.status(200).json({ message: "Session deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred!" });
  }
});

module.exports = router;
