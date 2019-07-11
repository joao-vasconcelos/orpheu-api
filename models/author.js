/* ╔══════════════════╗
 * ║                  ║
 * ║      Author      ║
 * ║                  ║
 * ╚══════════════════╝
 *
 * ─────────────────────────────────────────
 * API model for Author object.
 * Validation schema JOI must match database
 * schema MONGOOSE for correct functioning.
 * ─────────────────────────────────────────
 */

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
    coverURL: {
      type: String,
      maxlength: 255,
      default: "https://picsum.photos/100/100"
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true
    },
    nationality: {
      type: String,
      minlength: 2,
      maxlength: 25,
      required: true
    },
    birthdate: {
      type: String,
      maxlength: 10,
      required: true
    },
    deathdate: {
      type: String,
      maxlength: 10
    },
    biography: {
      type: String,
      maxlength: 1000
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
  coverURL: Joi.string()
    .max(255)
    .allow("")
    .label("CoverURL"),
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),
  nationality: Joi.string()
    .min(2)
    .max(25)
    .required(),
  birthdate: Joi.date()
    .max("now")
    .iso()
    .required(),
  deathdate: Joi.date()
    .max("now")
    .iso()
    .allow(""),
  biography: Joi.string()
    .max(1000)
    .allow("")
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
