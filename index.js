const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");
const httpStatusText = require("./utils/httpStatusText");
const path = require("path");
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
const cors = require("cors");

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(url).then(() => {
  console.log("Mongo server started");
});

app.use(express.json());

app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    data: null,
    message: "Page not found",
    code: 404,
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    data: null,
    message: error.message,
    code: error.statusCode || 500,
  });
});

app.listen(port, "localhost", () => {
  console.log("listening on port " + port);
});
