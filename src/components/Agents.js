import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { auth, googleProvider, signInWithPopup, signOut, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import "./agents.css";

const Agents = () => {
  const [user, setUser] = useState(null);
  const [userIdInput, setUserIdInput] = useState("");
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  // New state for error message

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserIds();
    }
  },
);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      console.log("User logged in: ", result.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleAddUserId = async () => {
    if (!user || !userIdInput) {
      setErrorMessage("Please log in and enter a valid User ID.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      const dataRef = collection(db, "users", user.uid, "data");
      await setDoc(doc(dataRef, userIdInput), {
        userId: userIdInput,
      });

      console.log("User ID added successfully");
      setUserIdInput("");
      fetchUserIds();
    } catch (error) {
      console.error("Error adding user ID: ", error);
      setErrorMessage("Error adding User ID.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
    }
  };

  const handleDeleteUserId = async (id) => {
    if (!user) {
      setErrorMessage("Please log in to delete User IDs.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
  
    try {
      const dataRef = doc(db, "users", user.uid, "data", id);
      await deleteDoc(dataRef);
  
      console.log("User ID deleted successfully");
      fetchUserIds(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting User ID: ", error);
      setErrorMessage("Error deleting User ID.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };
  
  const fetchUserIds = async () => {
    if (!user) return;
    try {
      const dataRef = collection(db, "users", user.uid, "data");
      const snapshot = await getDocs(dataRef);
      const ids = snapshot.docs.map((doc) => doc.data().userId);
      setUserIds(ids);
    } catch (error) {
      console.error("Error fetching user IDs: ", error);
      setErrorMessage("Error fetching User IDs.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
    }
  };

  const handleViewList = async (userId) => {
    setSelectedUserId(userId);
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages
  
    try {
      const dataRef = collection(db, "users", userId, "entries");
      const snapshot = await getDocs(dataRef);
  
      if (snapshot.empty) {
        console.warn("No entries found for this User ID:", userId);
        setEntries([]); // Clear any previous entries
        setErrorMessage("User ID not found or wrong.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
        setSelectedUserId(null); // Reset selected userId if no entries are found
      } else {
        const fetchedEntries = snapshot.docs.map((doc) => doc.data());
        console.log("Fetched Entries:", fetchedEntries); // Log fetched entries
        setEntries(fetchedEntries); // Set entries state to display
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      setErrorMessage("An error occurred while fetching entries.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
    setEntries([]);
  };

  return (
    <div className="creator-container">
    <nav className="navbar">
    <div className="logo">
         <img
            src="https://static.vecteezy.com/system/resources/thumbnails/016/328/568/small/india-flat-rounded-flag-with-transparent-background-free-png.png"
            alt="logo"
          />
         </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/creator" className={({ isActive }) => (isActive ? "active" : "")}>
          <i class="fa-solid fa-house"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/Agents" className={({ isActive }) => (isActive ? "active" : "")}>
          <i class="fa-solid fa-person"></i> Agents ID
          </NavLink>
        </li>
        <li>
          <NavLink to="/Create_session" className={({ isActive }) => (isActive ? "active" : "")}>
          <i className="fa-solid fa-calendar-plus"></i> Create Session
          </NavLink>
        </li>
      </ul>
      {!user ? (
        <div className="google-login-container">
          <button className="google-login-btn" onClick={handleGoogleLogin}>
            <img src="google.png" alt="google-logo" /> Login with Google
          </button>
        </div>
      ) : (
        <div className="google-login-container">
          <button onClick={handleSignOut} className="sign-out-btn">
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      )}
    </nav>
    
      <div className="agent_content">
        {!selectedUserId && (
          <>
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="User ID"
            />
            <button className="add" onClick={handleAddUserId}>
              Add ID
            </button>

            {/* Display error message if there's any */}
            {errorMessage && <p className="message">{errorMessage}</p>}

            <h3>Stored User IDs:</h3>
            <div className="A-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Sr.no</th>
                    <th>User ID</th>
                    <th>View</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {userIds.length > 0 ? (
                    userIds.map((id, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {id}
                        </td>
                        <td>
                        <button className="view" onClick={() => handleViewList(id)}>
                        <i class="fa-solid fa-eye"></i> View List
                          </button>
                        </td>
                        <td>
                        <i className="fa-solid fa-trash" onClick={() => handleDeleteUserId(id)} style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No user IDs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Only show this section if a user ID is selected */}
        {selectedUserId && (
          <div> 
            <button className="back" onClick={handleBackToList}>
            <i class="fa-solid fa-backward"> </i> Back
            </button>
            <h3>Entries for User ID: {selectedUserId}</h3>
            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <div className="B-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Name</th>
                      <th>Alternate Name</th>
                      <th>Area</th>
                      <th>Contact</th>
                      <th>Attend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length > 0 ? (
                      entries.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.agent}</td>
                          <td>{entry.name}</td>
                          <td>{entry.Aternate_Name}</td>
                          <td>{entry.area}</td>
                          <td>{entry.contact}</td>
                          <td>{entry.isSelected ? "Yes" : "No"}</td>
                          </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No entries found for this User ID.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

<nav className="bottom-navbar">
          <NavLink to="/creator" activeClassName="active">
            <i className="fa-solid fa-home"></i> Home
          </NavLink>
          <NavLink to="/Agents" activeClassName="active">
          <i class="fa-solid fa-person"></i> Agents ID
          </NavLink>
          <NavLink to="/Create_session" activeClassName="active">
            <i className="fa-solid fa-calendar-plus"></i> Create
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Agents;
