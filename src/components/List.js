import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Ensure firebase is properly configured

const List = () => {
  const { userId } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      console.log("Fetching entries for Firestore path: users/" + userId + "/entries");
      try {
        const dataRef = collection(db, "users", userId, "entries");
        const snapshot = await getDocs(dataRef);
        if (!snapshot.empty) {
          const fetchedEntries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("Fetched entries:", fetchedEntries);
          setEntries(fetchedEntries);
        } else {
          console.log("No documents found in entries sub-collection.");
          setEntries([]);
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEntries();
  }, [userId]);
  
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Entries for User ID: {userId}</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Name</th>
              <th>Alternate Name</th>
              <th>Area</th>
              <th>Contact</th>
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
    </div>
  );
};

export default List;
