const debug = require("debug")("app:hash-api");
const bcrypt = require("bcrypt");

/* * */
/* Settings for password encryption */
const salt_rounds = 10;

/* * */
/* Method to encrypt password */
async function encryptPassword(password) {
  try {
    const salt = await bcrypt.genSalt(salt_rounds);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    debug("An error occured: ", err);
  }
}

/* * */
/* Method to validate password at login */
async function validatePassword(password, against) {
  try {
    return await bcrypt.compare(password, against);
  } catch (err) {
    debug("An error occured: ", err);
    return false;
  }
}

exports.encryptPassword = encryptPassword;
exports.validatePassword = validatePassword;
