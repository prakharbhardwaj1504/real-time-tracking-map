import React, { useState, useEffect } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { MapContainer, TileLayer, Marker, Popup,useMap } from "react-leaflet";
import { Icon } from "leaflet";
import marker from "../assets/marker.png";
import "leaflet/dist/leaflet.css";
import "./GetTracked.css"

const db = getDatabase(app);

function MapUpdater({ position }) {
    const map = useMap();
    
    useEffect(() => {
      if (position) {
        map.flyTo(position, map.getZoom());
      }
    }, [map, position]);
  
    return null;
  }
const GetTracked = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState({
    lat: 20.593745789784546,
    long: 78.96290123456789,
  });
  const [locationStatus, setLocationStatus] = useState("");
  const [error, setError] = useState("");
  const [watchId, setWatchId] = useState(null);

  const updateID = (e) => setId(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updateLat = (e) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      lat: e.target.value,
    }));
  };
  const updateLong = (e) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      long: e.target.value,
    }));
  };

  const putData = () => {
    if (id.trim() === "" || name.trim() === "") {
      alert("Fields cannot be empty");
      return;
    }
    set(ref(db, `user/${name}`), {
      id: id,
      name: name,
      long: location.long,
      lat: location.lat,
    })
      .then(() => alert("Data saved successfully"))
      .catch((err) => alert("Error saving data: " + err.message));
  };

  // Update Firebase whenever location changes
  useEffect(() => {
    if (id.trim() !== "" && name.trim() !== "") {
      set(ref(db, `user/${name}`), {
        id: id,
        name: name,
        long: location.long,
        lat: location.lat,
      }).catch((err) => console.error("Error updating location: " + err.message));
    }
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          setLocationStatus("Location identified");
        },
        (err) => {
          setError("Error getting location: " + err.message);
          setLocationStatus(
            "Location not identified. Allow app to access your Location."
          );
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      setWatchId(id);
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocationStatus("Location not identified");
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const customIcon = new Icon({ iconUrl: marker, iconSize: [27, 30] });

  return (
    <div>
      <div>Enter your details so that your well-wisher can locate you...</div>
      <label htmlFor="id">Enter ID</label>
      <input type="text" id="id" value={id} onChange={updateID} />
      <br />
      <label htmlFor="name">Enter Name</label>
      <input type="text" id="name" value={name} onChange={updateName} />
      <p>{locationStatus}</p>
      <label htmlFor="">Latitude    </label>
      <input type="number" value={location.lat}  onChange={updateLat}/>
      <br />
      <label htmlFor="">Longitute </label>
      <input type="number" value={location.long}  onChange={updateLong}/>
      <button onClick={putData}>Save Data</button>

      <MapContainer center={[location.lat, location.long]} zoom={18} >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker icon={customIcon} position={[location.lat, location.long]}>
          <Popup>You are here...</Popup>
        </Marker>
        <MapUpdater position={[location.lat, location.long]} />
      </MapContainer>
    </div>
  );
};

export default GetTracked;
