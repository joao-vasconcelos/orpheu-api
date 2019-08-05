const config = require("config");

module.exports = function(req, res, next) {
  // Parse request if configuration enabled
  if (config.get("communication.parse-request-body-if-multipart")) {
    // Parse request if it is of type "multipart/form-data"
    const type = req.headers["content-type"];
    if (type && type.includes("multipart/form-data")) {
      const key = config.get("communication.key-to-parse");
      req.body = JSON.parse(req.body[key]);
    }
  }
  next();
};
