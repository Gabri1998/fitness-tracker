const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define your schema here


const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  age: { type: Number },
  webAuthnCredentials: [
    {
      credentialID: { type: String, required: true }, // WebAuthn Credential ID
      publicKey: { type: String, required: true },   // WebAuthn Public Key
      counter: { type: Number, required: true }      // Signature counter for replay attacks
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
