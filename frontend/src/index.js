import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
const dotenv = require("dotenv");
dotenv.config();

// Importing the Bootstrap CSS

ReactDOM.render(<App />, document.getElementById("root"));
