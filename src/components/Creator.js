import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { auth, googleProvider, signInWithPopup, signOut, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc  } from "firebase/firestore";

import "./Creator.css";

const Creator = () => {
  const [user, setUser] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the success or error message
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);

      const userRef = doc(db, "users", result.user.uid);
      await setDoc(
        userRef,
        {
          userId: result.user.uid,
          inviteCode: generateInviteCode(),
          creatorName: result.user.displayName || "Anonymous",
          partyName: "Default Party",
        },
        { merge: true }
      );

      console.log("User logged in and saved: ", result.user);
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

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent form reload
    if (!user) {
      setMessage("You need to be logged in to add an entry.");
      return;
    }
  
    const formData = new FormData(event.target);
    const newEntry = {
      name: formData.get("name"),
      area: formData.get("area"),
      agent: formData.get("agent"),
      contact: formData.get("contact"),
      Aternate_Name: formData.get("Aternate_Name"),
    };
  
    try {
      const entriesRef = collection(db, "users", user.uid, "entries");
      await setDoc(doc(entriesRef), newEntry); // Add the new entry to Firestore
      setEntries((prevEntries) => [...prevEntries, { ...newEntry, id: entriesRef.id }]); // Update state with the new entry
      setIsFormVisible(false); // Close the form popup
      setMessage("New entry added successfully!");

      // Hide the message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding new entry: ", error);
      setMessage("Failed to add entry. Please try again.");
      
      // Hide the error message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchEntries = async () => {
        setLoading(true);
        try {
          const entriesRef = collection(db, "users", user.uid, "entries");
          const querySnapshot = await getDocs(entriesRef);
          const entriesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEntries(entriesData);
        } catch (error) {
          console.error("Error fetching entries: ", error);
        }
        setLoading(false);
      };      
      fetchEntries();
    }
  }, [user]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const PollingCandidates = () => {
    const [selectedEntries, setSelectedEntries] = useState([]);

    const handleSelect = async (id) => {
      if (!user) return;
    
      // Find the selected entry in the local state
      const selectedEntry = entries.find((entry) => entry.id === id);
    
      if (!selectedEntry) {
        console.error("Entry not found!");
        return;
      }
    
      const newState = !selectedEntry.isSelected; // Toggle the checkbox state
    
      try {
        // Reference to the existing document in Firestore
        const entryRef = doc(db, "users", user.uid, "entries", id);
    
        // Use updateDoc to update the 'isSelected' field without overwriting the document
        await updateDoc(entryRef, { isSelected: newState });
    
        // Update the local state to reflect the change
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === id ? { ...entry, isSelected: newState } : entry
          )
        );
      } catch (error) {
        console.error("Error updating checkbox state: ", error);
      }
    };
    

    const toggleFormVisibility = () => {
      if (user) {
        setIsFormVisible(!isFormVisible);  // Show form if user is logged in
      } else {
        alert("You need to be logged in to add an entry.");  // Show error message if not logged in
      }
    };

    const handleDelete = async (entryId) => {
      if (!user) return;
  
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this entry?"
      );
      if (!confirmDelete) return;
  
      try {
        const entryRef = doc(db, "users", user.uid, "entries", entryId);
        await deleteDoc(entryRef);
  
        // Update UI after deletion
        setEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== entryId)
        );
  
        // Show success message
        setMessage("Entry deleted successfully.");
        setTimeout(() => setMessage(null), 3000); // Hide message after 3 seconds
      } catch (error) {
        console.error("Error deleting entry: ", error);
        setMessage("Failed to delete entry. Please try again.");
        setTimeout(() => setMessage(null), 3000); // Hide message after 3 seconds
      }
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

        <div className="content">
          <h2>Polling Candidates</h2>
        </div>

        <div className="table-container">
        {!user ? (
            <p className="no-data">Please log in to view your entries.</p>
        ) : loading ? (
            <p className="loading">Loading...</p>
        ) : entries.length === 0 ? (
            <p className="no-entries">No entries found.</p>
        ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Polling Agent Name</th>
                  <th>Aternate Name</th>
                  <th>area</th>
                  <th>Contact</th>
                  <th>Attend</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.agent}</td>
                    <td>{entry.name}</td>
                    <td>{entry.Aternate_Name}</td>
                    <td>{entry.area}</td>
                    <td>{entry.contact}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={entry.isSelected || false}
                        onChange={() => handleSelect(entry.id)}
                      />
                    </td>

                    <td>
                    <i
                    className="fa-solid fa-trash"
                    onClick={() => handleDelete(entry.id)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {message && <div className="message">{message}</div>} {/* Display message */}

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

        <div className="up-icon" onClick={scrollToTop}>
          <i className="fa-solid fa-arrow-up"></i>
        </div>

        <div className="add-icon" onClick={toggleFormVisibility}>
          <i className="fa-solid fa-plus"></i>
        </div>

        {isFormVisible && (
        <div className="form-popup">
          <div className="form-container">
            <div className="cancle">
              <i class="fa-solid fa-circle-xmark" onClick={toggleFormVisibility}></i>
            </div>
            <h2>Add New Entry</h2>
            <form onSubmit={handleFormSubmit}>
            <label>Agent Name: </label>
            <input type="text" name="agent" required />
            <label>Polling Agent Name:</label>
            <input type="text" name="name" required />
            <label> Aternate Name:</label>
            <input type="text" name="Aternate_Name" required />
            <label>Area:</label>
            <input type="text" name="area" required />
            <label> Contact:</label>
            <input type="text" name="contact" required />
            <button type="submit" className="submit-btn">Submit</button>
          </form>
          </div>
        </div>
      )}
      </div>
    );
  };

  return (
    <div>
      <PollingCandidates />
    </div>
  );
};

export default Creator;
