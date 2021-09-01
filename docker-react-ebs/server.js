const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require("./verifytoken");
const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/build")));

app.use("/api/", verifyToken);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(port, () => {
  console.log(`App started at ` + port);
});
