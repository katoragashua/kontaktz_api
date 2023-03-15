require("dotenv").config();
require("express-async-errors");
const path = require("path");
const express = require("express");
const app = express();

// Extra security packages
const helmet = require("helmet");//
const xss = require("xss-clean");

app.get("/", (req, res) => {
  res.send("<h1>Kontaktz</h1>");
});

const port = 3000 || process.env.PORT;

const start = () => {
  app.listen(port, () => {
    console.log("App listening on port " + port);
  });
};

start();
