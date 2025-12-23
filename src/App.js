import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import menuData from './data.js';



function App() {
  const [activeView, setActiveView] = useState('dash');
  const [isOpen, setIsOpen] = useState(false);      
  const [metarData, setMetarData] = useState(null); 
  const [userInput, setUserInput] = useState(''); 
  const [icaoV, setIcaoV] = useState('KABC')  
  
   
  useEffect(() => {
    const fetchdata = async () => {
      try{
        const rawdata = await fetch(`/api/metar/${icaoV}`);
        const data = await rawdata.json();
        setMetarData(data.metars?.[0] || null);
      } catch (error) {
        console.error('unable to retrieve', error);
      }
    };
    fetchdata();  
    }, [icaoV]);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z]{0,3}$/.test(value)) {
      setUserInput(value);  // ✅ Use state setter
    }
  };

  const handleSubmit = () => {
    const newIcao = 'K' + userInput.toUpperCase();
    setIcaoV(newIcao); 
    setUserInput('');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand">Airfield Dashboard</span>
        <button 
          className="navbar-toggler" 
          type="button"  // ✅ Required for Bootstrap
          onClick={() => setIsOpen(!isOpen)}  // ✅ Now works
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">  {/* ✅ Use <ul> + <li> for Bootstrap */}
            {Object.keys(menuData).map(key => (  // ✅ Use 'key' variable
              <li key={key} className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => {
                    setActiveView(key);  // ✅ Dynamic key
                    setIsOpen(false);    // ✅ Close menu after click
                  }}
                >
                  {menuData[key].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ✅ Fixed sections */}
      <section style={{ display: activeView === 'dash' ? 'block' : 'none' }}>
        <h3>Weather</h3>
        <div className="container mt-4">
          
            <div className="bg-light p-3 rounded">
             {JSON.stringify(metarData)}
            </div>  
         </div>        
          
      </section>

      <section style={{ display: activeView === 'afld_lookup' ? 'block' : 'none' }}>
        <div className="container mt-4">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            maxLength={3}
            placeholder="ATL"
            className="form-control w-auto d-inline-block me-2"
            style={{ width: '60px', textTransform: 'uppercase' }}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={userInput.length !== 3}
          >
            Set ICAO
          </button>
          <p className="mt-2">Current: {userInput}</p>
        </div>
      </section>
    </>
  );
}

export default App;
