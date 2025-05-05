var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
const encryption = require("../utilities/crypto-utils");
var User = require("../models/User");

// Register endpoint
router.post("/register", async (req, res, next) => {
  console.log("Register request body:", req.body);
  try {
    const { name, username, email, password, age } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      age
    });

    await user.save();
    console.log("User registered successfully:", user);
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    next(error);
  }
});

// Login endpoint
router.post("/login", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = encryption.encryptToken(user._id.toString());
      return res.status(200).json({ token });
    }

    res.status(400).json({ message: "Password is required for login." });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
});

module.exports = router;