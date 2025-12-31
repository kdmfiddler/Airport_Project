import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import menuData from './data.js';
import './App.css';
import { page_values, aptdb } from './metars.js';



function App() {
  const [activeView, setActiveView] = useState('dash');
  const [isOpen, setIsOpen] = useState(false);      
  const [metarData, setMetarData] = useState(null); 
  const [userInput, setUserInput] = useState(''); 
  const [icaoV, setIcaoV] = useState('KABC'); 
  const [tempT, setTempT] = useState('F'); 
  const [rwys, setRwys] = useState([]);
  
  useEffect(() => {
    const fetchdata = async () => {
      
      try{
        const rawdata = await fetch(`/metar/${icaoV}`);
        const data = await rawdata.json();
        console.log(data);
        setMetarData(data);
      } catch (error) {
        console.error('unable to retrieve METAR', error);
      }
      

      try{
        console.log('starting fetch');

        const dbdata = await fetch(`/db/${icaoV}`).catch(err => {
          console.error('fetch threw:', err);
          throw err;
        });
        console.log('DB Status: ', dbdata.status);
        const db = await dbdata.json();
        console.log('DB RAW:', db);                // ← ADD THIS
        console.log('DB TYPE:', typeof db, db); 
        setRwys(db || []);
      } catch (error){
        console.error('unable to retrieve db', error);
      }

    };
    fetchdata();  
    }, [icaoV]);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z]{0,3}$/.test(value)) {
      setUserInput(value);  
    }
  };

  const tempChg = () => {
    setTempT(tempT === 'F' ? 'C' : 'F');
  }

  const handleSubmit = () => {
    const newIcao = 'K' + userInput.toUpperCase();
    setIcaoV(newIcao); 
    setUserInput('');
    setActiveView('dash');
  };

  if(!metarData){
    return (
      <div>Retrieving</div>
    )
  }

  return (
    <>
      
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand">Airfield Dashboard</span>
        <button 
          className="navbar-toggler" 
          type="button"  
          onClick={() => setIsOpen(!isOpen)}  
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">  
            {Object.keys(menuData).map(key => (  
              <li key={key} className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => {
                    setActiveView(key);  
                    setIsOpen(false);    
                  }}
                >
                  {menuData[key].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="line-container">
        <div className="Solid-black"></div>
        <div className="Dash-yellow"></div>
        <div className="Solid-black"></div>
        <div className="Dash-yellow"></div>
        <div className="Solid-black"></div>
        <div className="Solid-yellow"></div>
        <div className="Solid-black"></div>
        <div className="Solid-yellow"></div>
        <div className="Solid-black"></div>
      </div>

      

      <section style={{ display: activeView === 'dash' ? 'block' : 'none' }}>
        <div className='top-line'>
          <div className='location-sign'>
            <h2><b>{metarData.icao}</b></h2>
          </div>
          <div className='data-grid'>

            <div className='data-box'>TEXT</div>
            
            <div className='data-box'>TEXT</div>
            
            <div className='data-box' style={{
              color: 'white',
              backgroundColor: metarData.ctemp < -17 ? '#0594FA':
                metarData.ctemp < 1 ? '#56B3F5':
                metarData.ctemp < 13 ? '#ceba05ff':
                metarData.ctemp < 21 ? '#F79E0F' : '#F75C0F',
              
              }}>
                {tempT === 'F' ? (
                  <b>{metarData.ctemp}°C</b>
                  ) : (
                  <b>{metarData.ftemp}°F</b>
                )}
              <button className='little-round-button' onClick={tempChg}>{tempT}</button>
                
            </div>
            <div className='data-box' style={{color: 'white', backgroundColor:'#524E4E'}}>
              {tempT === 'F' ? (
                 <b>Td {metarData.dewp}</b>
                ) : (
                 <b>Td {metarData.fdpoint}</b>
                )}

            
            </div>
          </div>
            
            
          
          
          <div className='location-sign' style={{fontSize: '12px', color: 'white', border: '3px solid white'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <b>Current as of <br/>
            <h6 style={{margin: 0}}>{metarData.caotime}</h6></b>
            </div>
          </div>

        </div>
        <div className="container mt-4">
          
            <div className="bg-light p-3 rounded">
             {JSON.stringify(metarData)}
            </div>  
         </div>
         <div>
             {JSON.stringify(rwys)}   
         </div>        
          
      </section>

      <section style={{ display: activeView === 'afld_lookup' ? 'block' : 'none' }}>
        <div className="container mt-4">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            maxLength={3}
            placeholder={icaoV.slice(1,4)}
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
