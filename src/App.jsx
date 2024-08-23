import React, { useState } from "react";
import GetTracked from "./components/GetTracked";
import TrackSomeone from "./components/TrackSomeone";
import "./App.css"

function App() {
  const [view, setView] = useState(null);

  return (
    <div>
      {view === null && (
        <>
          <button onClick={() => setView("getTracked")}>Get Tracked</button>
          <button onClick={() => setView("trackSomeone")}>Track Someone</button>
        </>
      )}

      {view === "getTracked" && <GetTracked />}
      {view === "trackSomeone" && <TrackSomeone />}
    </div>
  );
}

export default App;
