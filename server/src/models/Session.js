const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  workoutplan: {
    type: Schema.Types.ObjectId,
    ref: "workoutplan",
    required: true,
  },
  exercises: { type: [Schema.Types.ObjectId], ref: "Exercise" },
  name: { type: String, required: true },
  date: { type: Date },
  duration: { type: String, required: true },
  feedback: { type: String },
});

module.exports = mongoose.model("Session", sessionSchema);
