/* ╔══════════════════╗
 * ║                  ║
 * ║       Book       ║
 * ║                  ║
 * ╚══════════════════╝
 *
 * ─────────────────────────────────────────
 * API model for Book object.
 * Validation schema JOI must match database
 * schema MONGOOSE for correct functioning.
 * ─────────────────────────────────────────
 */

/* * */
/* IMPORTS */
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/* * */
/* * */
/* * */
/* * * * * */
/* MONGO DB MODEL */
/* * */
/* * */
/* Schema for MongoDB ["Book"] Object */
/* This Schema must match Joi */
const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    pictureURL: {
      type: String,
      maxlength: 255
    },
    title: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true
    },
    authors: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
        name: { type: String, minlength: 2, maxlength: 255 }
      }
    ],
    genres: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
        title: { type: String, minlength: 2, maxlength: 255 }
      }
    ],
    language: { type: String, minlength: 2, maxlength: 255 },
    publisher: { type: String, minlength: 2, maxlength: 255 },
    edition: { type: String, minlength: 2, maxlength: 255 },
    year: { type: Number, minlength: 2, maxlength: 4 },
    coverType: { type: String, minlength: 2, maxlength: 50 },
    pages: { type: String, minlength: 2, maxlength: 255 },
    dimensions: { type: String, minlength: 2, maxlength: 255 },
    condition: { type: String, minlength: 2, maxlength: 255 },
    sinopse: { type: String, minlength: 2, maxlength: 500 },
    price: { type: String, minlength: 2, maxlength: 255 },
    store: {
      // _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      _id: { type: String, required: true, default: "pending" },
      name: { type: String, minlength: 2, maxlength: 255 }
    },
    status: {
      code: { type: Number, required: true, default: 0 },
      message: {
        type: String,
        required: true,
        maxlength: 255,
        default: "pending..."
      }
    }
  })
);
/* * * * * * */
/* * */

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
  title: Joi.string()
    .min(2)
    .max(255)
    .required(),
  authors: Joi.array()
    .min(1)
    .max(50)
    .items(
      Joi.object({
        _id: Joi.string().required(),
        name: Joi.string()
          .max(255)
          .required()
      })
    )
    .required(),
  genres: Joi.array()
    .min(1)
    .max(50)
    .items(
      Joi.object({
        _id: Joi.string().required(),
        title: Joi.string()
          .max(255)
          .required()
      })
    ),
  language: Joi.string()
    .max(255)
    .allow(""),
  publisher: Joi.string()
    .max(255)
    .allow(""),
  edition: Joi.string()
    .max(255)
    .allow(""),
  year: Joi.number().max(255),
  coverType: Joi.string()
    .max(255)
    .allow(""),
  pages: Joi.number()
    .max(255)
    .allow(""),
  dimensions: Joi.string()
    .max(255)
    .allow(""),
  condition: Joi.string()
    .max(255)
    .allow(""),
  sinopse: Joi.string()
    .max(500)
    .allow(""),
  price: Joi.number().max(255),
  store: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string()
      .max(255)
      .required()
  }),
  status: Joi.object({
    code: Joi.number().label("Status Code"),
    message: Joi.string()
      .max(255)
      .label("Status Message")
  }).label("Status")
};

function validate(request) {
  return Joi.validate(request, validation_schema);
}
/* * * * * * */
/* * */

/* * */
/* Exports */
exports.Book = Book;
exports.validate = validate;
