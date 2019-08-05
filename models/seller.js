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
/* Schema for MongoDB ["Seller"] Object */
/* This Schema must match Joi */
const Store = mongoose.model(
  "Store",
  new mongoose.Schema({
    pictureURL: {
      type: String,
      maxlength: 255,
      default: "https://picsum.photos/100/100"
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 15,
      required: true
    },
    address: {
      type: String,
      maxlength: 1500
    },
    about: {
      type: String,
      maxlength: 1500
    },
    workingHours: [
      {
        weekday: { type: String, maxlength: 1500 },
        hours: {}
      }
    ],
    reviews: [
      {
        userID: { type: String, maxlength: 1500 },
        title: { type: String, maxlength: 1500 },
        content: { type: String, maxlength: 1500 }
      }
    ]
  })
);

/* * */
/* * */
/* * */
/* * * * * */
/* JOI VALIDATION SCHEMA */
/* * */
/* * */
/* Schema for Joi ["Store"] Object validation */
/* This Schema must match MongoDB */
const validation_schema = {
  storeImage: Joi.any()
    .disallow(null)
    .label("Profile Picture"),
  storeImageURL: Joi.string()
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
exports.Store = Store;
exports.validate = validate;
