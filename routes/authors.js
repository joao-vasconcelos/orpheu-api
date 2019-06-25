/* * */
/* IMPORTS */
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Author, validate } = require("../models/author");
const router = require("express").Router();

/* * */
/* GET method for [/api/authors/] */
/* Responds with all items from the database */
router.get("/", async (req, res) => {
  const items = await Author.find().sort("name");
  res.send(items);
});

/* * */
/* GET method for [/api/authors/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  try {
    const item = await Author.findById(req.params.id);
    res.send(item);
  } catch (err) {
    return res.status(404).send("The author with the given ID was not found.");
  }
});

/* * */
/* POST method for [/api/authors/] */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post("/", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if item already exists in the database
  let items = await Author.find({ name: req.body.name });
  if (items.length) {
    return res.status(400).send("An author with that name already exists.");
  }

  // Try saving to the database
  item = new Author(req.body);
  item = await item.save();
  res.send(item);
});

/* * */
/* PUT method for [/api/authors/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put("/:id", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  const item = await Author.findByIdAndUpdate(
    req.params.id /* Which item to update */,
    req.body /* What is to change */,
    { new: true } /* Respond with the updated document */
  );
  res.send(item);
});

/* * */
/* DELETE method for [/api/authors/:id] */
/* Deletes an existing item from the database. */
/* Responds with the deleted item */
router.delete("/:id", [auth, admin], async (req, res) => {
  const item = await Author.findByIdAndRemove(req.params.id);
  res.send(item);
});

/* * */
/* Export router for [/api/authors/] */
module.exports = router;
