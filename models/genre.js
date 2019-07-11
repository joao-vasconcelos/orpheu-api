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
    coverURL: {
      type: String,
      maxlength: 255,
      default: "https://picsum.photos/100/100"
    },
    title: {
      type: String,
      minlength: 2,
      maxlength: 15,
      required: true
    },
    description: {
      type: String,
      maxlength: 1500
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
  coverImage: Joi.any(),
  coverURL: Joi.string()
    .max(255)
    .allow("")
    .label("CoverURL"),
  title: Joi.string()
    .min(2)
    .max(15)
    .required()
    .label("Title"),
  description: Joi.string()
    .max(1500)
    .allow("")
    .label("Description")
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
