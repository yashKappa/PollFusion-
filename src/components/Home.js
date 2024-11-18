import React from "react";
import "./style.css";  // Importing the CSS file

const Home = () => {
  return (
    <div className="home-container">
      {/* Content Above the Image */}
      <h1 className="home-title">Welcome to PollFusion</h1>
      <p className="home-description">
        Manage elections, create polls, and analyze results seamlessly.
      </p>
      <button className="home-button" onClick={() => alert("Get Started!")}>
        Get Started
      </button>

      {/* Image in the Background */}
      <img className="home-image" src="https://th-i.thgim.com/public/elections/8klch8/article68088752.ece/alternates/FREE_1200/Profiles1.jpg" alt="Election Background" />
    </div>
  );
};

export default Home;
