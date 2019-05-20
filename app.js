const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:init");
const books_router = require("./routes/books");
const users_router = require("./routes/users");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json());
app.use(helmet());
app.use("/api/books", books_router);
app.use("/api/users", users_router);

mongoose
  .connect("mongodb://localhost/books", { useNewUrlParser: true })
  .then(() => debug("Connected to MongoDB..."))
  .catch(err => debug("Could not connect to MongoDB", err));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan is enabled...");
}

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));
