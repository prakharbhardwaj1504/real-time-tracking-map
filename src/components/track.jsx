import React, { useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase";

const Track = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const updateID = (e) => {
    setId(e.target.value);
  };

  const updateName = (e) => {
    setName(e.target.value);
  };

  const fetchData = () => {
    if (id.trim() === "" || name.trim() === "") {
      setError("ID and Name cannot be empty");
      return;
    }

    const db = getDatabase(app);
    const userRef = ref(db, `user/${name}`);
    
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.id === id) {
        setUserData(data);
        setError("");
      } else {
        setError("No data found for this ID and Name.");
        setUserData(null);
      }
    });
  };

  return (
    <div>
      <h1>Track User Location</h1>
      <label htmlFor="id">Enter ID:</label>
      <input type="text" id="id" value={id} onChange={updateID} />
      <br />
      <label htmlFor="name">Enter Name:</label>
      <input type="text" id="name" value={name} onChange={updateName} />
      <br />
      <button onClick={fetchData}>Fetch Data</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userData && (
        <div>
          <p>ID: {userData.id}</p>
          <p>Name: {userData.name}</p>
          <p>Latitude: {userData.lat}</p>
          <p>Longitude: {userData.long}</p>
        </div>
      )}
    </div>
  );
};

export default Track;
