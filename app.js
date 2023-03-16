require("dotenv").config();
require("express-async-errors");
const path = require("path");
const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");

// Error Middlewares
const notFound = require("./middlewares/not-found");

// Extra security packages
const helmet = require("helmet"); //
const xss = require("xss-clean");

// Using built in middlewares
app.use(express.json());
// Security packages
// app.use(helmet());
// app.use(xss());

app.use("api/v1/user/", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Kontaktz</h1>");
});

app.use(notFound);

const port = 3000 || process.env.PORT;

const start = async () => {
  try {
    app.listen(port, () => {
      console.log("App listening on port " + port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
