/* * */
/* * */
/* * * * * */
/* API ROUTES */
/* * */

const books_router = require("../routes/books");
const authors_router = require("../routes/authors");
const genres_router = require("../routes/genres");
const users_router = require("../routes/users");
const auth_router = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use("/api/books", books_router);
  app.use("/api/authors", authors_router);
  app.use("/api/genres", genres_router);
  app.use("/api/users", users_router);
  app.use("/api/auth", auth_router);
  app.use(error);
};
