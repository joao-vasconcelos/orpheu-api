/* * */
/* IMPORTS */
const debug = require("debug")("app:users-api");
const Joi = require("joi");
const mongoose = require("mongoose");
const router = require("express").Router();

/* * */
/* SCHEMAS */
/* * */
/* * */
/* 1 */
/* Schema for MongoDB ["User"] Object */
/* This Schema must match Joi */
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  })
);

/* * */
/* 2 */
/* Schema for Joi ["User"] Object validation */
/* This Schema must match MongoDB */
const validation_schema = {
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
};
/* * * * * * */
/* * */

/* * */
/* GET method for [/api/users/] */
/* Responds with all items from the database */
router.get("/", async (req, res) => {
  const items = await User.find().sort("name");
  res.send(items);
});

/* * */
/* GET method for [/api/users/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  try {
    const item = await User.findById(req.params.id);
    res.send(item);
  } catch (err) {
    debug("Did not GET because an error ocurred: ", err);
    return res
      .status(404)
      .send(`The user with ID ${req.params.id} was not found.`);
  }
});

/* * */
/* POST method for [/api/users/] */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post("/", async (req, res) => {
  // Validate the request
  const { error } = Joi.validate(req.body, validation_schema);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  try {
    let item = new User({ name: req.body.name });
    item = await item.save();
    res.send(item);
  } catch (err) {
    debug("Did not POST because an error ocurred: ", err);
    return res
      .status(500)
      .send("An error ocurred. Please try again in a moment.");
  }
});

/* * */
/* PUT method for [/api/users/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put("/:id", async (req, res) => {
  // Validate the request
  const { error } = Joi.validate(req.body, validation_schema);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  try {
    const item = await User.findByIdAndUpdate(
      req.params.id /* Which item to update */,
      { name: req.body.name } /* What is to change */,
      { new: true } /* Respond with the updated document */
    );
    res.send(item);
  } catch (err) {
    debug("Did not UPDATE because an error ocurred: ", err);
    return res
      .status(404)
      .send(`The user with ID ${req.params.id} was not found.`);
  }
});

/* * */
/* DELETE method for [/api/users/:id] */
/* Deletes an existing item from the database. */
/* Responds with the deleted item */
router.delete("/:id", async (req, res) => {
  try {
    const item = await User.findByIdAndRemove(req.params.id);
    res.send(item);
  } catch (err) {
    debug("Did not DELETE because an error ocurred: ", err);
    return res
      .status(404)
      .send(`The user with ID ${req.params.id} was not found.`);
  }
});

/* * */
/* Export router for [/api/users/] */
module.exports = router;
