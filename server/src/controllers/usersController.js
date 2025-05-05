const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authorizationMiddleware = require("../middlewares/AuthorizationMiddleware");
const User = require("../models/User");
const Sessions = require("../models/Session");
const Exercises = require("../models/Exercise");
const WorkoutPlans = require("../models/WorkoutPlan");
const { flatMap, uniq } = require("lodash");
// GET
router.get("/", async function (req, res, next) {
  const filterusername = req.query.username;
  const filtername = req.query.name;
  const filteremail = req.query.email;
  const filter = req.query.age;

  // Constructing filters object
  const filters = {};
  if (filtername) {
    filters.name = filtername;
  }
  if (filteremail) {
    filters.email = filteremail;
  }
  if (filterusername) {
    filters.username = filterusername;
  }

  // Sending filters object to the find function
  const users = await User.find(filters).catch((err) => {
    err.status = 422;
    next(err);
  });
  res.status(200).json(users);
});

router.get("/me", async (req, res, next) => {
  try {
    const id = req.userid;

    const user = await User.findById(id);
    if (user == null) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
});
router.get("/summary", async (req, res, next) => {
  try {
    const id = req.userid;
    const userWorkout = await WorkoutPlans.find({ userId: id });
    const userSessionsIDs = flatMap(userWorkout, (uw) => uw.sessions);

    const userSessions = await Sessions.find({
      _id: { $in: userSessionsIDs },
    });
    const userExercises = await Exercises.find({
      _id: { $in: flatMap(userSessions, (us) => us.exercises) },
    });
    const workoutCount = userWorkout.length;
    const sessionCount = userSessions.length;
    const exerciseCount = flatMap(userExercises, (ue) => ue.exercises).length;
    res.status(200).json({
      workoutCount,
      sessionCount,
      exerciseCount,
    });
  } catch (error) {
    error.status = 403;
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (user == null) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
});

router.post("/", function (req, res, next) {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.status(401).json({
        err: "no password provided",
      });
    } else {
      var new_user = new User(req.body);
      new_user.password = hashedPass;
      new_user
        .save()
        .then(() => res.status(201).json(new_user))
        .catch((err) => {
          err.status = 422;
          next(err);
        });
    }
  });
});

// PUT
router.put("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.username) {
      user.username = req.body.username;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

//DELETE
router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Proceed to delete
    const user = await User.findByIdAndDelete(id);

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});


router.delete("/", async function (req, res, next) {
  try {
    await User.deleteMany({});
    // Success
    res.status(204).json({ message: "Deleted all users" });
  } catch (error) {
    console.error(error); // Failure
    next(error);
  }
});

module.exports = router;