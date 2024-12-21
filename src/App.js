import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Home page
import Create_session from "./components/Create_session"; // Login page
import Creator from "./components/Creator";
import Agents from "./components/Agents";
import List from "./components/List";

const App = () => {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />
      {/* Login Page */}
      <Route path="/Create_session" element={<Create_session />} />
      <Route path="/creator" element={<Creator />} />
      <Route path="/Agents" element={<Agents />} />
      <Route path="/List" element={<List />} />
    </Routes>
  );
};

export default App;
