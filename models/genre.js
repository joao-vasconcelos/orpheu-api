/* * */
/* IMPORTS */
const Joi = require("joi");
const mongoose = require("mongoose");

/* * */
/* * */
/* * */
/* * * * * */
/* MONGO DB MODEL */
/* * */
/* * */
/* Schema for MongoDB ["Genre"] Object */
/* This Schema must match Joi */
const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    }
  })
);

/* * */
/* * */
/* * */
/* * * * * */
/* JOI VALIDATION SCHEMA */
/* * */
/* * */
/* Schema for Joi ["Book"] Object validation */
/* This Schema must match MongoDB */
const validation_schema = {
  name: Joi.string()
    .min(3)
    .required()
};

function validate(request) {
  return Joi.validate(request, validation_schema);
}
/* * * * * * */
/* * */

/* * */
/* Export functions for User model and validate function */
exports.Genre = Genre;
exports.validate = validate;
