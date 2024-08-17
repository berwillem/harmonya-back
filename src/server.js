const express = require("express");
const cors = require("cors");
const coockieParser = require("cookie-parser");
//require .env
require("dotenv").config();
//db config
const connectDB = require("./config/db");
const { errorHandler } = require("./helpers/errorHandler");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

//init server
const server = express();

// cookie
server.use(coockieParser());

//init cors
server.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//use json
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// access log
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
server.use(morgan("dev", { stream: logStream }));

//require routes

const routes = require("./router");
const { handleEventListeners } = require("./helpers/eventHandler");
const { updateExpiredSubscriptions } = require("./helpers/nodecron");
server.use(routes);
// Start the cron job
updateExpiredSubscriptions.start();

//use errorHandler
server.use(errorHandler);

//run server
connectDB()
  .then((con) => {
    console.log(
      `database connected host:${con.connection.host},dbname:${con.connection.db.databaseName}`
    );
    handleEventListeners();

    server.listen(process.env.PORT, () => {
      console.log(
        `express server running on port ${process.env.PORT} in ${server.get(
          "env"
        )}`
      );
    });
  })
  .catch((err) => console.log("failed to connect to database",err));

module.exports = server;
