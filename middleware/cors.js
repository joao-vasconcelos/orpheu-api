const config = require("config");

module.exports = function(req, res, next) {
  if (config.get("connection.allowCrossDomain")) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  }
  next();
};
