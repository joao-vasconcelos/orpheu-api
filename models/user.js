/* * */
/* IMPORTS */
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

/* * */
/* * */
/* * */
/* * * * * */
/* MONGO DB MODEL */
/* * */
/* * */
/* Schema for MongoDB ["User"] Object */
/* This Schema must match Joi */
const user_schema = new mongoose.Schema({
  pictureURL: {
    type: String,
    maxlength: 255,
    default: "https://picsum.photos/100/100"
  },
  name: {
    type: String,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

/* * */
/* Method to get token after valid password */
user_schema.methods.generateAuthToken = function() {
  return jwt.sign(
    // Here are defined the params to include
    // in the "payload" of the JWT Token
    {
      _id: this._id,
      name: this.name,
      email: this.email
    },
    // Get the private key from environment variables
    config.get("auth.jwt-private-key")
  );
};

/* * */
/* Create the User model based on user_schema */
const User = mongoose.model("User", user_schema);

/* * */
/* * */
/* * */
/* * * * * */
/* JOI VALIDATION SCHEMA */
/* * */
/* * */
/* Schema for Joi ["User"] Object validation */
/* This Schema must match MongoDB */
const validation_schema = {
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),
  email: Joi.string()
    .min(3)
    .max(255)
    .email()
    .required(),
  password: Joi.string()
    .min(5)
    .max(255)
    .required(),
  isAdmin: Joi.boolean()
};

function validate(request) {
  return Joi.validate(request, validation_schema);
}
/* * * * * * */
/* * */

/* * */
/* Export functions for User model and validate function */
exports.User = User;
exports.validate = validate;
