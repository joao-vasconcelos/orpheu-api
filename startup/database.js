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
    .set()
    .connect(dbURL, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true // Temporary fixes for deprecation warnings.
    })
    .then(() => winston.info("Connected to MongoDB..."));
};
