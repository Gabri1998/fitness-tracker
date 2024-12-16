var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var bcrypt = require("bcryptjs");
const encryption = require("../utilities/crypto-utils");
var User = require("../models/User");

router.post("/register", async (req, res, next) => {
  console.log("Register request body:", req.body);
  try {
    const { username, password, webAuthnResponse } = req.body;
 
    console.log("Inside Authentication Controller - Register 1");
    // Hash the password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = new User({
      username,
      password: hashedPassword,
    });
    
  console.log("Inside Authentication Controller - Register 2");
    // Handle WebAuthn registration if response provided
    if (webAuthnResponse) {
      const verification = await verifyRegistrationResponse({
        response: webAuthnResponse,
        expectedChallenge: req.session.challenge,
        expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
        expectedRPID: process.env.RP_ID || "localhost",
      });
  
      console.log("Inside Authentication Controller - Register 3");

      if (!verification.verified) {
        return res.status(400).json({ message: "WebAuthn registration failed" });
      }

      const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

      user.webAuthnCredentials.push({
        credentialID: credentialID.toString("base64"),
        publicKey: credentialPublicKey.toString("base64"),
        counter,
      });
    }
  
    console.log("Inside Authentication Controller - Register 4");
    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password, webAuthnResponse } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle password-based login
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = encryption.encryptToken(user._id.toString());
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    // Handle WebAuthn login
    if (webAuthnResponse) {
      const credential = user.webAuthnCredentials.find(
        (cred) => cred.credentialID === webAuthnResponse.id
      );

      if (!credential) {
        return res.status(404).json({ message: "WebAuthn credential not found" });
      }

      const verification = await verifyAuthenticationResponse({
        response: webAuthnResponse,
        expectedChallenge: req.session.challenge,
        expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
        expectedRPID: process.env.RP_ID || "localhost",
        authenticator: {
          credentialPublicKey: Buffer.from(credential.publicKey, "base64"),
          counter: credential.counter,
        },
      });

      if (!verification.verified) {
        return res.status(401).json({ message: "WebAuthn authentication failed" });
      }

      // Update the counter to prevent replay attacks
      credential.counter = verification.authenticationInfo.newCounter;
      await user.save();

      const token = encryption.encryptToken(user._id.toString());
      return res.status(200).json({ token });
    }

    res.status(400).json({ message: "Invalid login request" });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
});

module.exports = router;
