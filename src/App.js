import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Home page
import Login from "./components/Login"; // Login page

const App = () => {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />
      {/* Login Page */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
