import { useState, useEffect } from "react";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "./firebase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { Icon } from "leaflet";
import marker from "./assets/marker.png";
import Track from "./components/track";

const db = getDatabase(app);

function App() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const updateID = (e) => {
    setId(e.target.value);
    console.log(id);
  };
  const updateName = (e) => {
    setName(e.target.value);
    console.log(name);
  };
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
      alert("Fiels can not be empty");

      setError("ID and Name cannot be empty");
      return; // Exit the function if validation fails
    }
    set(ref(db, `user/${name}`), {
      id: id,
      name: name,
      long: location.long,
      lat: location.lat,
    })
      .then(() => {
        setError("Data saved successfully"); // Set success message
      })
      .catch((err) => {
        setError("Error saving data: " + err.message); // Set error message if saving fails
      });
  };

  /////////////////////////////////
  const [location, setLocation] = useState({
    lat: 20.593745789784546,
    long: 78.96290123456789,
  });
  const [error, setError] = useState("");
  const [watchId, setWatchId] = useState(null);

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
            "Location Not identified. Allow app to access your Location"
          );
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      setWatchId(id);
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocationStatus("Location not identified");
    }

    // Cleanup function to stop watching the position when the component unmounts
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);
  ///////////////////////////
  /* Icon Images*/
  const customIcon = new Icon({ iconUrl: marker, iconSize: [27, 30] });
  ///////////////////////////

  /* Saving in when change occur */
  useEffect(() => {
    if (location.lat !== 0 && location.long !== 0 && name.trim() !== "") {
      set(ref(db, `user/${name}`), {
        id: id,
        name: name,
        long: location.long,
        lat: location.lat,
      }).catch((err) => {
        setError('Error updating location: ' + err.message);
      });
    }
  }, [location]);

  return (
    <>
    <div>Location Finder: Enter your detail so that your well wisher can locate you...</div>
      <label htmlFor="">Enter id</label>
      <input type="text" value={id} placeholder="Enter ID" onChange={updateID} />
      <br />
      <label htmlFor="">Enter name</label>
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={updateName}
      />
      <p>{locationStatus}</p>
      <label htmlFor="">Enter lat</label>
      <input type="text" value={location.lat} onChange={updateLat} />
      <label htmlFor="">Enter longitute</label>
      <input type="text" value={location.long} onChange={updateLong} />
      <button onClick={putData}>Save Data</button>

      {/* MAPS START */}

      <MapContainer center={[location.lat, location.long]} zoom={4}>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker icon={customIcon} position={[location.lat, location.long]}>
          <Popup>You are here...</Popup>
        </Marker>
      </MapContainer>
      {/* MAPS ENDS */}
      <Track/>
    </>
  );
}

export default App;

/* plan of action

find map api
use it using long and lat

fetch long and lat based on name and id


*/
