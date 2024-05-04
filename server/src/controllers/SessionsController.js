const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Session = require("../models/Session");
// The overriding methods applying here by delete and put
router.get("/", async (req, res, next) => {
  try {
    const filters = {};
    const workoutplanfilter = req.query.workoutplanid;
    if (workoutplanfilter) {
      filters.workoutplan = workoutplanfilter;
    }
    const filtername = req.query.name;
    if (filtername) {
      filters.name = filtername;
    }

    const sessions = await Session.find(filters);
    if (sessions == null) {
      res.status(404).json({ message: "Sessions not found" });
    } else {
      res.status(200).json(sessions);
    }
  } catch (error) {
    error.status = 422;
    next(error);
  }
});
router.get("/v2", async (req, res, next) => {
  try {
    const filters = {};
    const workoutplanfilter = req.query.workoutplanid;
    if (workoutplanfilter) {
      filters.workoutplan = workoutplanfilter;
    }
    const filtername = req.query.name;
    if (filtername) {
      filters.name = filtername;
    }

    const sessions = await Session.find(filters);
    const totalCount = await Session.count(filters);
    if (sessions == null) {
      res.status(404).json({ message: "Sessions not found" });
    } else {
      res.status(200).json({ totalCount, sessions });
    }
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = await Session.findById(id);
    if (session == null) {
      res.status(404).json({ message: "Session not found" });
    } else {
      res.status(200).json(session);
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = await Session.findById(id);
    if (session == null) {
      return res.status(404).json({ message: "Session not found" });
    }
    session.name = req.body.name;
    session.duration = req.body.duration;
    session.date = req.body.date;
    session.feedback = req.body.feedback;
    session.exercises = req.body.exercises;

    await session.save();
    res.status(200).json(session);
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = await Session.findById(id);
    if (session == null) {
      return res.status(404).json({ message: "Session not found" });
    }
    session.name = req.body.name || session.name;
    session.duration = req.body.duration || session.duration;
    session.date = req.body.date || session.date;
    session.feedback = req.body.feedback || session.feedback;
    session.exercises = req.body.exercises || session.exercises;

    await session.save();
    res.status(200).json(session);
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = await Session.findOneAndDelete({ _id: id });
    if (session == null) {
      res.status(404).json({ message: "Session not found" });
    } else {
      res.status(200).json({ message: "Session deleted" });
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const sessions = await Session.deleteMany();
    res.status(200).json({ message: "Sessions deleted", sessions });
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

module.exports = router;
