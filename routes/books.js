/* * */
/* IMPORTS */
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Book, validate } = require("../models/book");
const router = require("express").Router();

/* * */
/* GET method for [/api/books/] */
/* Responds with all items from the database */
router.get("/", async (req, res) => {
  throw new Error("Error");
  const items = await Book.find().sort("name");
  res.send(items);
});

/* * */
/* GET method for [/api/books/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  const item = await Book.findById(req.params.id);
  res.send(item);
});

/* * */
/* POST method for [/api/books/] */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post("/", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  let item = new Book({ name: req.body.name });
  item = await item.save();
  res.send(item);
});

/* * */
/* PUT method for [/api/books/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put("/:id", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  const item = await Book.findByIdAndUpdate(
    req.params.id /* Which item to update */,
    { name: req.body.name } /* What is to change */,
    { new: true } /* Respond with the updated document */
  );
  res.send(item);
});

/* * */
/* DELETE method for [/api/books/:id] */
/* Deletes an existing item from the database. */
/* Responds with the deleted item */
router.delete("/:id", [auth, admin], async (req, res) => {
  const item = await Book.findByIdAndRemove(req.params.id);
  res.send(item);
});

/* * */
/* Export router for [/api/books/] */
module.exports = router;
