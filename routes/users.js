/* * */
/* IMPORTS */
const _ = require("lodash");
const debug = require("debug")("app:users-api");
const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");
const { encryptPassword } = require("../services/hash");
const router = require("express").Router();

/* * */
/* GET method for [/api/users/me/] */
/* Responds with the currently logged in user */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

/* * */
/* POST method for [/api/users/] */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post("/", async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send("JOI: " + error.details[0].message);

  // Check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // Try saving to the database
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await encryptPassword(req.body.password),
      isAdmin: req.body.isAdmin
    });
    user = await user.save();
    res
      .header("x-auth-token", user.generateAuthToken())
      .send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
  } catch (err) {
    console.log("Did not POST because an error ocurred: ", err);
    return res
      .status(500)
      .send("An error ocurred. Please try again in a moment.");
  }
});

/* * */
/* Export router for [/api/users/] */
module.exports = router;
