require("dotenv").config();

const express = require("express");
const path = require("path");
const createError = require("http-errors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

require("./config/database");

const session = require("./config/session");
const routes = require("./routes/main.routes");

// configure express

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session);
app.use(routes);

app.use((req, _, next) => {
  req.currentUser = req.session.user;
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * Listen on provided port
 */
const port = normalizePort(process.env.PORT || "3000");
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Helper functions

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
