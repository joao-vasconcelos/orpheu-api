/* * */
/* * */
/* * * * * */
/* CONNECTION TO MONGODB */
/* * */

const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function() {
  const dbURL = config.get("database.url");
  mongoose
    .set("useCreateIndex", true) // Temporary fix for deprecation warning.
    .connect(dbURL, { useNewUrlParser: true })
    .then(() => winston.info("Connected to MongoDB..."));
};
