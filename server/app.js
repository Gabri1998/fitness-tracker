const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

// Controllers and Middlewares
const usersControllers = require("./src/controllers/usersController");
const Sessions = require("./src/controllers/SessionsController");
const Exercises = require("./src/controllers/ExercisesController");
const Authentication = require("./src/controllers/AuthenticationController");
const workoutPlansController = require("./src/controllers/workoutPlans");
const webauthnController = require("./src/controllers/webauthnController");
const authorizationMiddleware = require("./src/middlewares/AuthorizationMiddleware");

// Variables
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/animalDevelopmentDB";
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).catch((err) => {
  console.error(`Failed to connect to MongoDB: ${err.stack}`);
  process.exit(1);
});
console.log(`Connected to MongoDB at ${mongoURI}`);

// Create Express app
const app = express();

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
}));

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));

// Logging and Parsers
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Assets
app.use('/sounds', express.static(path.join(__dirname, 'public/sounds')));

// Routes
app.get("/api", (req, res) => res.json({ message: "Welcome to HCI backend ExpressJS project!" }));
app.use("/api/v1/auth", Authentication);
app.use("/api/v1/webauthn", webauthnController);
app.use("/api/v1/users",authorizationMiddleware, usersControllers);
app.use("/api/v1/sessions", authorizationMiddleware, Sessions);
app.use("/api/v1/exercises", authorizationMiddleware, Exercises);
app.use("/api/v1/workoutplans", authorizationMiddleware, workoutPlansController);

// 404 Handler
app.use("/api/*", (req, res) => res.status(404).json({ message: "Not Found" }));

// Vue.js History Mode Support and Static Files
app.use(history());
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
