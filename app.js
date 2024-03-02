const express = require("express");
const app = express();

const cors = require("cors");
const rateLimit = require("express-rate-limit");

const mongoose = require("mongoose");



const bodyparser = require("body-parser");
const route = require("./src/routes/api");

app.use(cors());
app.use(bodyparser.json());
app.use(rateLimit(
  {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  // limit each IP to 100 requests per windowMs
  }
))

// databse connection

const userName = "ashiq1102";
const password = "ashiq1102";
const databaseName = "todotasker";
const options = {
  autoIndex: true,
};

const uri = `mongodb+srv://${userName}:${password}@cluster0.h2zwyxc.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

mongoose.connect(uri, options)
.then(() => {
  console.log("database connected");
})
.catch((err) => {
  console.log(err);
})

app.use("/api/v1", route);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = app;
