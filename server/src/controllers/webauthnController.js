const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");
const encryption = require("../utilities/crypto-utils");

// Generate registration options
router.post("/register/options", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const options = generateRegistrationOptions({
      rpName: process.env.RP_NAME || "Fitness Tracker App", // Use env variables or defaults
      rpID: process.env.RP_ID || "localhost", 
      userID: user._id.toString(),
      userName: user.username,
      timeout: 60000,
      attestationType: "direct",
      excludeCredentials: user.webAuthnCredentials.map((cred) => ({
        id: Buffer.from(cred.credentialID, "base64"),
        type: "public-key",
      })),
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: false,
        userVerification: "preferred",
      },
    });

    req.session.challenge = options.challenge;
    res.status(200).json(options);
  } catch (error) {
    console.error("Error generating registration options:", error);
    next(error);
  }
});

// Verify registration response
router.post("/register/verify", async (req, res, next) => {
  try {
    const { username, registrationResponse } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const expectedChallenge = req.session.challenge;
    const verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge,
      expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
      expectedRPID: process.env.RP_ID || "localhost",
    });

    if (!verification.verified) {
      return res.status(400).json({ message: "Registration failed" });
    }

    const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

    user.webAuthnCredentials.push({
      credentialID: credentialID.toString("base64"),
      publicKey: credentialPublicKey.toString("base64"),
      counter,
    });

    await user.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error verifying registration response:", error);
    next(error);
  }
});

// Generate authentication options
router.post("/auth/options", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const options = generateAuthenticationOptions({
      rpID: process.env.RP_ID || "localhost",
      timeout: 60000,
      allowCredentials: user.webAuthnCredentials.map((cred) => ({
        id: Buffer.from(cred.credentialID, "base64"),
        type: "public-key",
      })),
      userVerification: "preferred",
    });

    req.session.challenge = options.challenge;
    res.status(200).json(options);
  } catch (error) {
    console.error("Error generating authentication options:", error);
    next(error);
  }
});

// Verify authentication response
router.post("/auth/verify", async (req, res, next) => {
  try {
    const { username, authenticationResponse } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const expectedChallenge = req.session.challenge;
    const credential = user.webAuthnCredentials.find(
      (cred) => cred.credentialID === authenticationResponse.id
    );

    if (!credential) {
      return res.status(400).json({ message: "Credential not found" });
    }

    const verification = await verifyAuthenticationResponse({
      response: authenticationResponse,
      expectedChallenge,
      expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
      expectedRPID: process.env.RP_ID || "localhost",
      authenticator: {
        credentialPublicKey: Buffer.from(credential.publicKey, "base64"),
        counter: credential.counter,
      },
    });

    if (!verification.verified) {
      return res.status(400).json({ message: "Authentication failed" });
    }

    credential.counter = verification.authenticationInfo.newCounter;
    await user.save();

    const token = encryption.encryptToken(user._id.toString());
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error verifying authentication response:", error);
    next(error);
  }
});

module.exports = router;
