import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // Import the Firestore instance from firebase.js
import "./Login.css";

const Login = () => {
  const [creatorName, setCreatorName] = useState("");
  const [area, setArea] = useState("");
  const [partyName, setPartyName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      // Add the form data to the Firestore database
      await addDoc(collection(db, "creators"), {
        creatorName,
        area,
        partyName,
        createdAt: new Date(), // Optional: Add a timestamp
      });
      setMessage("Data submitted successfully!");
      setCreatorName("");
      setArea("");
      setPartyName("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Error submitting data.");
    }
  };

  return (
    <div className="login-container">
      <h2>Creator Login</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Creator Name:</label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Area:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Party Name:</label>
          <input
            type="text"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
            <label>Submit</label>
        </button>
      </form>
    </div>
  );
};

export default Login;
