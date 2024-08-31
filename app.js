const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error");

const app = express();

app.use(cors());
app.use(express.json());

//Route imports
const locationRouter = require("./routes/v1/Location.Routes");
const tourRouter = require("./routes/v1/Tour.Routes");
const blogRouter = require("./routes/v1/Blog.Routes");

//invoking routes
app.use("/api/v1", locationRouter);
app.use("/api/v1", tourRouter);
app.use("/api/v1", blogRouter);

// Not found route
app.all("/", (req, res) => {
  res.send("Welcome to JMC_TOUR");
});
// Not found route
app.all("*", (req, res) => {
  res.send("NO route found.");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
