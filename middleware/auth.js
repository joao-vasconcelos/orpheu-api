const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Switch authentication ON or OFF based on config file
  if (!config.get("auth.requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    req.user = jwt.verify(token, config.get("auth.jwtPrivateKey"));
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};
