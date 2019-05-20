/* * */
/* IMPORTS */
const winston = require("winston");
const helmet = require("helmet");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/database")();
require("./startup/config")();
require("./startup/validation")();

app.use(helmet());

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
