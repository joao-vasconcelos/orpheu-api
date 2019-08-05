/* * */
/* IMPORTS */
const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const storage = require("../services/storage");
const { Book, validate } = require("../models/book");

/* * */
/* SETTINGS */
const contentPath = "books";

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
/* GET method for [/api/books/] */
/* Responds with all items from the database */
router.get("/", async (req, res) => {
  const items = await Book.find().sort("title");
  res.send(items);
});

/* * */
/* * */
/* * * * * */
/* GET method for [/api/books/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  const item = await Book.findById(req.params.id);
  if (item) res.send(item);
  else res.status(404).send("The book with the given ID was not found.");
});

/* * */
/* * */
/* * * * * */
/* GET method for [/api/books/filter/:path] */
/* Responds with specific items from the database */
router.get("/filter/:key/:value", async (req, res) => {
  const items = await Book.find({ [req.params.key]: req.params.value });
  res.send(items);
});

/* * */
/* * */
/* * * * * */
/* POST method for [/api/books/] */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post("/", [auth, admin], async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  console.log("error:", error);
  if (error) return res.status(400).send(error.details[0].message);

  // Upload picture file to S3
  // and get pictureURL to store in the database
  const fileKey = storage.createFileNameAndKey(
    contentPath,
    req.body.title,
    req.files.picture.mimetype
  );

  req.body.pictureURL = await storage.uploadFile(
    fileKey,
    req.files.picture.data
  );

  // Try saving to the database
  let item = new Book(req.body);
  item = await item.save();
  res.send(item);
});

/* * */
/* * */
/* * * * * */
/* PUT method for [/api/books/:id] */
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
  const item = await Book.findByIdAndUpdate(
    req.params.id /* Which item to update */,
    req.body /* What is to change */,
    { new: true } /* Respond with the updated document */
  );
  res.send(item);
});

/* * */
/* * */
/* * * * * */
/* DELETE method for [/api/books/:id] */
/* Deletes an existing item from the database. */
/* Responds with the deleted item */
router.delete("/:id", [auth, admin], async (req, res) => {
  const item = await Book.findByIdAndRemove(req.params.id);

  // Delete file in Storage
  const fileKey = storage.extractKeyFromURL(item.pictureURL);
  const fileHasBeenDeleted = await storage.deleteFile(fileKey);
  if (!fileHasBeenDeleted)
    return res.status(500).send("Error deleting the file.");

  res.send(item);
});

/* * */
/* Export router for [/api/books/] */
module.exports = router;
