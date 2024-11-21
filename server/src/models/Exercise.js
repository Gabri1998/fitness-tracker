// models/Exercise.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const exerciseSchema = new Schema({
  name: { type: String, required: true },
  instruction: { type: String, required: true },
  level: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileType: { type: String },
  fileName: { type: String },
  fileData: { type: Buffer } // This field stores the actual file data
});

module.exports = mongoose.model("Exercise", exerciseSchema);