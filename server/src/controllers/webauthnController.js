const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const encryption = require("../utilities/crypto-utils");
require("dotenv").config();

const ABSOLUTE_EMAIL = process.env.ABSOLUTE_EMAIL;

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Check if email matches the hardcoded email or exists in the database
    if (email === ABSOLUTE_EMAIL || await User.findOne({ email })) {
      const challenge = crypto.randomBytes(32).toString("base64");
      return res.status(200).json({
        success: true,
        message: "User authorized for fingerprint authentication.",
        challenge,
      });
    }

    return res.status(404).json({ success: false, message: "Authentication failed. Email not recognized." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});
router.post("/login/verify", async (req, res) => {
  try {
    const { email, response } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Validate the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Authentication failed. Email not recognized." });
    }

    // Verify the fingerprint response (simplified for this example)
    if (response && response.verified) {
      console.log("Fingerprint authentication successful for:", email);

      // Generate an encrypted token
      const token = encryption.encryptToken(user._id.toString());
      console.log("Generated token:", token);

      return res.status(200).json({
        success: true,
        message: "Authentication successful!",
        token, // Send the token to the frontend
      });
    } else {
      console.log("Fingerprint authentication failed for:", email);
      return res.status(400).json({ success: false, message: "Authentication failed." });
    }
  } catch (error) {
    console.error("Error during fingerprint verification:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;