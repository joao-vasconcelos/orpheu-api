/* * */
/* IMPORTS */
const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const storage = require("../services/storage");
const { Author, validate } = require("../models/author");

/* * */
/* SETTINGS */
const contentPath = "authors";

/* * */
/* * */
/* * */
/* * * * * */
/* ROUTES FOR 'AUTHORS' */
/* * */
/* * */

/* * */
/* * */
/* * * * * */
/* GET method for [/api/authors/] */
/* Responds with all items from the database */
router.get("/", async (req, res) => {
  const items = await Author.find().sort("name");
  res.send(items);
});

/* * */
/* * */
/* * * * * */
/* GET method for [/api/authors/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  const item = await Author.findById(req.params.id);
  if (item) res.send(item);
  else res.status(404).send("The author with the given ID was not found.");
});

/* * */
/* * */
/* * * * * */
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

  // Upload picture file to S3
  // and get pictureURL to store in the database
  const fileKey = storage.createFileNameAndKey(
    contentPath,
    req.body.name,
    req.files.picture.mimetype
  );

  req.body.pictureURL = await storage.uploadFile(
    fileKey,
    req.files.picture.data
  );

  // Try saving to the database
  let item = new Author(req.body);
  item = await item.save();
  res.send(item);
});

/* * */
/* * */
/* * * * * */
/* PUT method for [/api/authors/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put("/:id", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Upload coverImage file to S3
  // and get URL to store in the database
  if (req.files.length) {
    const fileKey = storage.createFileNameAndKey(
      contentPath,
      req.params.id,
      req.files.picture.mimetype
    );

    req.body.pictureURL = await storage.uploadFile(
      fileKey,
      req.files.picture.data
    );
  }

  // Try saving to the database
  const item = await Author.findByIdAndUpdate(
    req.params.id /* Which item to update */,
    req.body /* What is to change */,
    { new: true } /* Respond with the updated document */
  );
  res.send(item);
});

/* * */
/* * */
/* * * * * */
/* DELETE method for [/api/authors/:id] */
/* Deletes an existing item from the database. */
/* Responds with the deleted item */
router.delete("/:id", [auth, admin], async (req, res) => {
  const item = await Author.findByIdAndRemove(req.params.id);

  // Delete file in Storage
  const fileKey = storage.extractKeyFromURL(item.pictureURL);
  const fileHasBeenDeleted = await storage.deleteFile(fileKey);
  if (!fileHasBeenDeleted)
    return res.status(500).send("Error deleting the file.");

  res.send(item);
});

/* * */
/* Export router for [/api/authors/] */
module.exports = router;
