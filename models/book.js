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
    year: { type: String, minlength: 2, maxlength: 255 },
    coverType: { type: String, minlength: 2, maxlength: 255 },
    pages: { type: String, minlength: 2, maxlength: 255 },
    dimensions: { type: String, minlength: 2, maxlength: 255 },
    condition: { type: String, minlength: 2, maxlength: 255 },
    sinopse: { type: String, minlength: 2, maxlength: 255 },
    price: { type: String, minlength: 2, maxlength: 255 },
    store: {
      // _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      _id: { type: String, required: true, default: "pending" },
      name: { type: String, minlength: 2, maxlength: 255 }
    },
    status: {
      code: { type: Number, required: true, default: 0 },
      message: { type: String, required: true, default: "pending" }
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
  genres: Joi.array()
    .min(1)
    .items(
      Joi.object({
        _id: Joi.string().required(),
        title: Joi.string().required()
      })
    ),
  language: Joi.string().allow(""),
  publisher: Joi.string().allow(""),
  edition: Joi.string().allow(""),
  year: Joi.number(),
  coverType: Joi.string().allow(""),
  pages: Joi.number().allow(""),
  dimensions: Joi.string().allow(""),
  condition: Joi.string().allow(""),
  sinopse: Joi.string().allow(""),
  price: Joi.number(),
  store: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required()
  }),
  status: Joi.object({
    code: Joi.number().label("Status Code"),
    message: Joi.string().label("Status Message")
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
