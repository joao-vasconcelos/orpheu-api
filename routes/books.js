/* * */
/* IMPORTS */
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const debug = require("debug")("app:books-api");
const { Book, validate } = require("../models/book");
const router = require("express").Router();

/* * */
/* GET method for [/api/books/] */
/* Responds with all items from the database */
router.get("/", async (req, res) => {
  const items = await Book.find().sort("name");
  res.send(items);
});

/* * */
/* GET method for [/api/books/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  try {
    const item = await Book.findById(req.params.id);
    res.send(item);
  } catch (err) {
    debug("Did not GET because an error ocurred: ", err);
    return res
      .status(404)
      .send(`The book with ID ${req.params.id} was not found.`);
  }
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
  try {
    let item = new Book({ name: req.body.name });
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
/* PUT method for [/api/books/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put("/:id", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  try {
    const item = await Book.findByIdAndUpdate(
      req.params.id /* Which item to update */,
      { name: req.body.name } /* What is to change */,
      { new: true } /* Respond with the updated document */
    );
    res.send(item);
  } catch (err) {
    debug("Did not UPDATE because an error ocurred: ", err);
    return res
      .status(404)
      .send(`The book with ID ${req.params.id} was not found.`);
  }
});

/* * */
/* DELETE method for [/api/books/:id] */
/* Deletes an existing item from the database. */
/* Responds with the deleted item */
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const item = await Book.findByIdAndRemove(req.params.id);
    res.send(item);
  } catch (err) {
    debug("Did not DELETE because an error ocurred: ", err);
    return res
      .status(404)
      .send(`The book with ID ${req.params.id} was not found.`);
  }
});

/* * */
/* Export router for [/api/books/] */
module.exports = router;
