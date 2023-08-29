const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");



//require .env
require("dotenv").config();
//db config
const connectDB = require("./config/db");
const { errorHandler } = require("./helpers/errorHandler");

//init server
const server = express();

//init cors
server.use(cors());

//use json
server.use(express.json());



//require routes


// const routes = require("./router");
// server.use(routes);

//use errorHandler
server.use(errorHandler);

//run server
connectDB()
  .then(con => {
    console.log(
      `database connected host:${con.connection.host},dbname:${con.connection.db.databaseName}`
    );

    server.listen(process.env.PORT, () => {
      console.log(
        `express server running on port ${process.env.PORT} in ${server.get(
          "env"
        )}`
      );
    });
  })
  .catch(err => console.error("failed to connect to database"));

module.exports = server;
