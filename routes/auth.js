/* * */
/* IMPORTS */
const Joi = require("joi");
const { validatePassword, getToken } = require("../services/encrypt");
const { User } = require("../models/user");
const router = require("express").Router();

/* * */
/* SCHEMAS */
/* * */
/* * */
/* 2 */
/* Schema for Joi ["User"] Object validation against login operation */
/* This Schema must match MongoDB, but without "name" property */
/* because only "email" and "password" are tested against authentication */
const validation_schema = {
  email: Joi.string()
    .max(255)
    .email()
    .required(),
  password: Joi.string()
    .min(5)
    .max(255)
    .required()
};
/* * * * * * */
/* * */

/* * */
/* POST method for [/api/auth/] */
/* Authenticates an existing user */
/* Responds with a valid JWT Token */
router.post("/", async (req, res) => {
  // Validate the body of the request
  const { error } = Joi.validate(req.body, validation_schema);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User does not exist.");

  let validPassword = await validatePassword(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password.");

  res
    .header("x-auth-token", user.generateAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send("Login succesfull");
});

module.exports = router;
