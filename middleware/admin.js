const config = require("config");

module.exports = function(req, res, next) {
  if (config.get("auth.requiresAdmin")) {
    // Database must be queried to check if user isAdmin
    // This is not a solution for production
    if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  }
  next();
};
