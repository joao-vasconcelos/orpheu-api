/* * */
/* * */
/* * * * * */
/* CONFIGURATION */
/* * */

const config = require("config");

module.exports = function() {
  if (!config.get("auth.jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
