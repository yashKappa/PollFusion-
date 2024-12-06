import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./style.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to PollFusion</h1>
      <p className="home-description">
        Manage elections, create polls, and analyze results seamlessly.
      </p>
      {/* Link instead of Button */}
      <Link to="/login" className="home-button">
        Get Started
      </Link>
      <img
        className="home-image"
        src="https://th-i.thgim.com/public/elections/8klch8/article68088752.ece/alternates/FREE_1200/Profiles1.jpg"
        alt="Election Background"
      />
      <img 
      className="home-img"
      src="https://i.pinimg.com/236x/a8/fd/bb/a8fdbba7f5368547df441af6182fda81.jpg"
      alt="Election BG"
      />
    </div>
  );
};

export default Home;
