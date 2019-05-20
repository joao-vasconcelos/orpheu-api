/* * */
/* * */
/* * * * * */
/* CONNECTION TO MONGODB */
/* * */

const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function() {
  mongoose
    .set("useCreateIndex", true) // Temporary fix for deprecation warning.
    .connect("mongodb://localhost/orpheu", { useNewUrlParser: true })
    .then(() => winston.info("Connected to MongoDB..."));
};
