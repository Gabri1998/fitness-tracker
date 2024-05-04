const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/User");
const Session = require("../models/Session");

var workoutPlanSchema = new Schema({
  dateCreated: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Session,
    },
  ],
});

module.exports = mongoose.model("Workoutplan", workoutPlanSchema);
