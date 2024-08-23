import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import marker from "../assets/marker.png";
import "leaflet/dist/leaflet.css";

const db = getDatabase(app);

// MapUpdater component defined outside of TrackSomeone
function MapUpdater({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [map, position]);

  return null;
}

const TrackSomeone = () => {
  const [searchName, setSearchName] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSearch = () => {
    const userRef = ref(db, `user/${searchName}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        setUserData(snapshot.val());
      } else {
        alert("User not found");
      }
    });
  };

  const customIcon = new Icon({ iconUrl: marker, iconSize: [27, 30] });

  return (
    <div>
      <div>Enter the name of the person you want to track...</div>
      <input
        type="text"
        placeholder="Enter Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button onClick={handleSearch}>Track</button>

      {userData && 
      (
        <MapContainer center={[userData.lat, userData.long]} zoom={12}  scrollWheelZoom={false}>
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker icon={customIcon} position={[userData.lat, userData.long]}>
            <Popup>{userData.name} is here...</Popup>
          </Marker>
          <MapUpdater position={[userData.lat, userData.long]} />
        </MapContainer>
      )
    }
    </div>
  );
};

export default TrackSomeone;