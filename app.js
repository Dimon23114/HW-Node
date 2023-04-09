const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const { notFound, serverError } = require("./utils");

dotenv.config({ path: "./.env" });

const contactsRouter = require("./routes/contactsRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

mongoose
  .connect(process.env.MONGO_URL)
  .then((connection) => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use(notFound);

app.use(serverError);

module.exports = app;