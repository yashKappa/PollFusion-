import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Import the main App component

ReactDOM.render(
  <BrowserRouter basename="/PollFusion-/">
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
