import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
const [isOpen, setIsOpen] = useState(false);
const [metarData, setMetarData] = useState(null); 
const fetchMetar = async () => {
    const response = await fetch('https://api.allorigins.win/raw?url=' + 
    encodeURIComponent('https://aviationweather.gov/api/data/metar?ids=KATL&format=json')
    );
    const data = await response.json();
    setMetarData(data[0]);  // ← Save to state
  };

  useEffect(() => {      // ← Auto-fetch on load
    fetchMetar();
  }, []);

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Airfield Dashboard</a>
      <button 
        className="navbar-toggler" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
        <div className="navbar-nav ms-auto">
          <a className="nav-link active px-3" href="#">Home</a>
          <a className="nav-link px-3" href="#">Airport Lookup</a>
          <a className="nav-link px-3" href="#">Set Favorites</a>
          <a className="nav-link disabled px-3" href="#">Settings</a>
        </div>
      </div>
    </nav>
    <div className="container mt-4">
        {metarData ? (
          <pre className="bg-light p-3 rounded">
            {metarData.rawOb || metarData.text}  {/* KATL 191152Z 10006KT... */}
          </pre>
        ) : (
          'Loading KATL METAR...'
        )}
      </div>
      </>
  );
}

export default App;
