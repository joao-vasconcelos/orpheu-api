/* * */
/* IMPORTS */
const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const storage = require("../services/storage");
const { Genre, validate } = require("../models/genre");

// const { upload } = require("../services/fileManager");

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
/* Validates the request. */
/* Stores the image in storage. */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post("/", [(auth, admin)], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if item already exists in the database
  let items = await Genre.find({ title: req.body.title });
  if (items.length) {
    return res.status(400).send("A genre with that title already exists.");
  }

  // Upload coverImage file to S3
  // and get URL to store in the database
  const URL = await storage.uploadFile(req.files.coverImage, req.body.title);
  req.body.coverURL = URL;

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
  const item = await Genre.findByIdAndUpdate(
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
