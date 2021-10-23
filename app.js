const express = require("express");
const app = express();
const compression = require("compression");
const createError = require("http-errors");
const morgan = require("morgan");

// express middlewares..
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(morgan("tiny"));

// api
app.use("/api/v1", require("./routes"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

//ERROR Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: Array.isArray(err.message) ? err.message[0].msg : err.message,
  });
});

// for testing
module.exports = app;
