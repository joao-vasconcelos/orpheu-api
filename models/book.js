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
    coverURL: {
      type: String,
      minlength: 2,
      maxlength: 255,
      default: "https://picsum.photos/100/100"
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
        name: { type: String, minlength: 2 }
      }
    ],
    genres: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
        title: { type: String, minlength: 2 }
      }
    ],
    language: { type: String, minlength: 2 },
    publisher: { type: String, minlength: 2 },
    edition: { type: String, minlength: 2 },
    year: { type: String, minlength: 2 },
    coverType: { type: String, minlength: 2 },
    pages: { type: String, minlength: 2 },
    dimensions: { type: String, minlength: 2 },
    condition: { type: String, minlength: 2 },
    sinopse: { type: String, minlength: 2 },
    price: { type: String, minlength: 2 },
    seller: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String, minlength: 2 }
    },
    available: { type: Boolean, required: true, default: true }
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
    .required(),
  authors: Joi.array()
    .min(1)
    .items(
      Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required()
      })
    )
    .required(),
  genres: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      title: Joi.string().required()
    })
  ),
  language: Joi.string(),
  publisher: Joi.string(),
  edition: Joi.string(),
  year: Joi.number(),
  coverType: Joi.string(),
  pages: Joi.number(),
  dimensions: Joi.string(),
  condition: Joi.string(),
  sinopse: Joi.string(),
  price: Joi.number(),
  seller: Joi.object({
    _id: Joi.string().required(),
    title: Joi.string().required()
  })
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
