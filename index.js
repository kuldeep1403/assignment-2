const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controller/errorController");

const app = express();
const port = process.env.PORT || 3009;

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const DB = process.env.DATABASE_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
const server = app.listen(port, () => {
  console.log("server is started and running on port", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
