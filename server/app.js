const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path"); // Keep only this one declaration
const cors = require("cors");
const history = require("connect-history-api-fallback");
const usersControllers = require("./src/controllers/usersController");
const Sessions = require("./src/controllers/SessionsController");
const Exercises = require("./src/controllers/ExercisesController");
const Authentication = require("./src/controllers/AuthenticationController");
const authorizationMiddleware = require("./src/middlewares/AuthorizationMiddleware");
const workoutPlansController = require("./src/controllers/workoutPlans");
const methodOverride = require("method-override");
const hateoasLinker = require("express-hateoas-links");

// Variables
const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/animalDevelopmentDB";
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).catch(function (err) {
  if (err) {
    console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.error(err.stack);
    process.exit(1);
  }
  console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

// Create Express app
const app = express();
app.use('/sounds', express.static(path.join(__dirname, 'public/sounds')));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(hateoasLinker);
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan("dev"));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options("*", cors());
app.use(cors());

// Import routes
app.get("/api", function (req, res) {
  res.json({ message: "Welcome to group-02 backend ExpressJS project!" });
});

app.use("/api/v1/auth", Authentication);
app.use("/api/v1/users", authorizationMiddleware, usersControllers);
app.use("/api/v1/sessions", authorizationMiddleware, Sessions);
app.use("/api/v1/exercises", authorizationMiddleware, Exercises);
app.use(
  "/api/v1/workoutplans",
  authorizationMiddleware,
  workoutPlansController
);

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use("/api/*", function (req, res) {
  res.status(404).json({ message: "Not Found" });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + "/..");
var client = path.join(root, "client", "dist");
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get("env");
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack);
  var err_res = {
    message: err.message,
    error: {},
  };
  if (env === "development") {
    // Return sensitive stack trace only in dev mode
    err_res["error"] = err.stack;
  }
  res.status(err.status || 500);
  res.json(err_res);
});

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Express server listening on port ${port}, in ${env} mode`);
  console.log(`Backend: http://localhost:${port}/api/`);
  console.log(`Backend: http://localhost:${port}/api/v1`);
  console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
