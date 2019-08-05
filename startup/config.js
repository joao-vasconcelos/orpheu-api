/* * */
/* * */
/* * * * * */
/* CONFIGURATION */
/* * */

const config = require("config");

module.exports = function() {
  if (!config.get("auth.jwt-private-key")) {
    throw new Error("FATAL ERROR: jwt-private-key is not defined.");
  }
};
