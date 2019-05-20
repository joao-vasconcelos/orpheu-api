/* * */
/* IMPORTS */
const Joi = require("joi");
const mongoose = require("mongoose");

/* * */
/* * */
/* * * * * */
/* MONGO DB MODEL */
/* * */
/* Schema for MongoDB ["Author"] Object */
/* This Schema must match Joi */
const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 2,
      required: true
    }
  })
);

/* * */
/* * */
/* * * * * */
/* JOI VALIDATION SCHEMA */
/* * */
/* Schema for Joi ["Author"] Object validation */
/* This Schema must match MongoDB */
const validation_schema = {
  name: Joi.string()
    .min(2)
    .required()
};

function validate(request) {
  return Joi.validate(request, validation_schema);
}
/* * * * * * */
/* * */

/* * */
/* Export functions for User model and validate function */
exports.Author = Author;
exports.validate = validate;
