console.log("App.js loaded");

const express = require("express");
const app = express();

const auth = require("./routes/auth");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", auth);

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.get("/check", (req, res) => {
  res.send("Check Route Working");
});

app.get("/xyz123", (req, res) => {
  res.send("XYZ123");
});

module.exports = app;
