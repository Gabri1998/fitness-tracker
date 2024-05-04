const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/User");
const exerciseSchema = new Schema({
  name: { type: String, required: true },
  instruction: { type: String, required: true },
  level: { type: Number },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
