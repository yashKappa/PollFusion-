import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./CreateSession.css";

const CreateSession = () => {
  const [creatorName, setCreatorName] = useState("");
  const [area, setArea] = useState("");
  const [partyName, setPartyName] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      if (currentUser) {
        fetchSessionData(currentUser.uid);
        setUserID(currentUser.uid); // Set user ID when user is authenticated
      }
    });
    return unsubscribe;
  }, []);

  const fetchSessionData = async (userId) => {
    try {
      const sessionDocRef = doc(db, "users", userId, "sessions", "session");
      const sessionDocSnap = await getDoc(sessionDocRef);

      if (sessionDocSnap.exists()) {
        const data = sessionDocSnap.data();
        setSessionData(data);
        setCreatorName(data.creatorName || "");
        setArea(data.area || "");
        setPartyName(data.partyName || "");
        setIsEditing(true);
      } else {
        setSessionData(null);
        setMessage("No session found.");
        setTimeout(() => setMessage(""), 5000); // Clear the message after 5 seconds
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
      setMessage("Error fetching session data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionDocRef = doc(db, "users", user.uid, "sessions", "session");

      // If it's an update, update the session without changing the userID
      if (isEditing) {
        await updateDoc(sessionDocRef, {
          creatorName,
          area,
          partyName,
          updatedAt: new Date(),
        });
      } else {
        // Create a new session with the user ID
        await setDoc(sessionDocRef, {
          creatorName,
          area,
          partyName,
          updatedAt: new Date(),
          userID: userID, // Store user ID instead of invite code/link
        });
      }

      setMessage(isEditing ? "Session updated successfully!" : "Session created successfully!");
      setTimeout(() => setMessage(""), 5000); // Clear the message after 5 seconds
      fetchSessionData(user.uid); // Refresh the data
    } catch (error) {
      console.error("Error creating/updating session:", error);
      setMessage("Error creating/updating session.");
      setTimeout(() => setMessage(""), 5000); // Clear the message after 5 seconds
    }
  };

  return (
    <>
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>
      <div className="session-container">
        <h2>{isEditing ? "Edit Session" : "Create Session"}</h2>
        <div className="pop-up">
          {message && <p className="message">{message}</p>}
        </div>
        {!user ? (
          <div className="login-warning">
            <p>Please logged in to create or edit a session.</p>
            <img
              src="https://www.pngarts.com/files/3/India-Flag-PNG-Image.png"
              alt="img"
            />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="session-form">
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
              <p className="user-info">
                <strong>Last Updated:</strong>{" "}
                {sessionData && sessionData.updatedAt
                  ? new Date(sessionData.updatedAt.toDate()).toLocaleString()
                  : "No update yet"}
              </p>

              {userID && (
                <>
                  <div className="user-info">
                    <p>
                      <strong>User ID:</strong> {userID}
                    </p>
                    
                  </div>
                </>
              )}

              <button type="submit" className="submit-btn">
                {isEditing ? "Update" : "Create"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default CreateSession;
