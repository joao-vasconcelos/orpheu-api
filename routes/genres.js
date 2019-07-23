/* * */
/* IMPORTS */
const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const storage = require("../services/storage");
const { Genre, validate } = require("../models/genre");

const contentPath = "genres";

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
  const item = await Genre.findById(req.params.id);
  if (item) res.send(item);
  else res.status(404).send("The genre with the given ID was not found.");
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
  const fileKey = storage.createFileNameAndKey(
    contentPath,
    req.body.title,
    req.files.coverImage.mimetype
  );

  req.body.coverURL = await storage.uploadFile(
    fileKey,
    req.files.coverImage.data
  );

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

  // Get the current item from db to compare
  const oldItem = await Genre.findById(req.params.id);

  // Check if title has changed
  // If yes, update fileTitle
  if (oldItem.title !== req.body.title) {
    const oldKey = storage.extractKeyFromURL(oldItem.coverURL);
    const newKey = storage.createFileNameAndKey(
      contentPath,
      req.body.title,
      oldItem.coverURL.split(".").pop()
    );

    req.body.coverURL = await storage.changeFileName(oldKey, newKey);
  }

  // Upload coverImage file to S3
  // and get URL to store in the database
  if (req.files) {
    const fileKey = storage.createFileNameAndKey(
      contentPath,
      req.body.title,
      req.files.coverImage.mimetype
    );

    req.body.coverURL = await storage.uploadFile(
      fileKey,
      req.files.coverImage.data
    );
  }

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

  // Delete file in Storage
  const fileKey = storage.extractKeyFromURL(item.coverURL);
  const fileHasBeenDeleted = await storage.deleteFile(fileKey);
  if (!fileHasBeenDeleted)
    return res.status(500).send("Error deleting the file.");

  res.send(item);
});

/* * */
/* Export router for [/api/books/] */
module.exports = router;
