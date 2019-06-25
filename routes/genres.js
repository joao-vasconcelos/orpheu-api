/* * */
/* IMPORTS */
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const router = require("express").Router();

/* * */
/* GET method for [/api/genres/] */
/* Responds with all items from the database */
router.get("/", async (req, res) => {
  const items = await Genre.find().sort("title");
  res.send(items);
});

/* * */
/* GET method for [/api/genres/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  try {
    const item = await Genre.findById(req.params.id);
    res.send(item);
  } catch (err) {
    return res.status(404).send("The genre with the given ID was not found.");
  }
});

/* * */
/* POST method for [/api/genres/] */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post("/", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if item already exists in the database
  let items = await Genre.find({ title: req.body.title });
  if (items.length) {
    return res.status(400).send("A genre with that title already exists.");
  }

  // Try saving to the database
  item = new Genre(req.body);
  item = await item.save();
  res.send(item);
});

/* * */
/* PUT method for [/api/genres/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put("/:id", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  const item = await Book.findByIdAndUpdate(
    req.params.id /* Which item to update */,
    req.body /* What is to change */,
    { new: true } /* Respond with the updated document */
  );
  res.send(item);
});

/* * */
/* DELETE method for [/api/genres/:id] */
/* Deletes an existing item from the database. */
/* Responds with the deleted item */
router.delete("/:id", [auth, admin], async (req, res) => {
  const item = await Genre.findByIdAndRemove(req.params.id);
  res.send(item);
});

/* * */
/* Export router for [/api/books/] */
module.exports = router;
