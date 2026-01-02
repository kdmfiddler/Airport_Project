import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import menuData from './data.js';
import './App.css';
import { crossdet } from './slicer.js'



function App() {
  const [activeView, setActiveView] = useState('dash');
  const [isOpen, setIsOpen] = useState(false);      
  const [metarData, setMetarData] = useState(null); 
  const [userInput, setUserInput] = useState(''); 
  const [icaoV, setIcaoV] = useState('KABC'); 
  const [tempT, setTempT] = useState('F'); 
  const [aptDb, setAptDb] = useState([]);
  
  
  useEffect(() => {
    const fetchdata = async () => {
      
      try{
        console.log('starting Metar fetch');
        
        const rawdata = await fetch(`/metar/${icaoV}`);
        const data = await rawdata.json();

        console.log(data);
        setMetarData(data);
        
        console.log('starting DB fetch');
        
        const dbdata = await fetch(`/db/${icaoV}`);
        const db = await dbdata.json();
        setAptDb(db || []);
        
        
        
      } catch (error) {
        console.error('unable to execute useEffect', error);
        
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

  if(!metarData || !aptDb || !aptDb.rwyh){
    return (
      <div>Retrieving</div>
    )
  }

  const crossW = crossdet(metarData.wdir, aptDb.rwyh);
  console.log('Crosswind found to be: ' + crossW);

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
          <div className='apt-name'style={{textDecoration:'none'}}><a href={aptDb.web}>{aptDb.name}</a></div>
          
          <div className='location-sign' style={{fontSize: '12px', color: 'white', border: '3px solid white'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <b>Current as of <br/>
            <h6 style={{margin: 0}}>{metarData.caotime}</h6></b>
            </div>
          </div>
        </div>
        
        <div className='top-line' style={{height: '30px'}}>
          <div className='data-grid'>

            <div className='data-box'style={{justifySelf: 'center'}}>Wind</div>

            <div className='data-box' style={{
              color: 'black', 
              backgroundColor: crossW ? '#f75c0f88':'#37bc1f82',  
              }}>
              <b>{metarData.wdir}</b></div>
            
            <div className='data-box' style={{justifySelf: 'center'}}>@</div>
            
            <div className='data-box' style={{
              color: 'black',
              backgroundColor: metarData.wspd > 17 || metarData.wgst > 25 ? '#ceba0586':
                metarData.wspd > 40|| metarData.wgst > 35 ? '#f75c0f80': '#37bc1f85',              
              }}>
              <b>{metarData.wspd} {metarData.wgst > 0 ? (' G ' + metarData.wgst) : ('')}</b></div>
            
            <div className='data-box'style={{justifySelf: 'center'}}>Temp</div>
            
            <div className='data-box' style={{
              color: 'white',
              backgroundColor: metarData.ctemp < -17 ? '#0594fa7d':
                metarData.ctemp < 1 ? '#56b3f58b':
                metarData.ctemp < 13 ? '#ceba0592':
                metarData.ctemp < 21 ? '#f79e0f89' : '#f75c0f88',
              }}>
                {tempT === 'F' ? (
                  <b>{metarData.ctemp}°C</b>
                  ) : (
                  <b>{metarData.ftemp}°F</b>
                )}
            </div>
            
            <div className='data-box' style={{justifySelf: 'center'}}>
              <button className='little-round-button' onClick={tempChg}>{tempT}</button>
                
            </div>
 
            <div className='data-box' style={{color: 'white', backgroundColor:'#524E4E'}}>
              {tempT === 'F' ? (
                 <b>Td {metarData.dewp}</b>
                ) : (
                 <b>Td {metarData.fdewp}</b>
                )}
            </div>
          </div>        

        </div>
        <div className="container mt-4">
          
            <div className="bg-light p-3 rounded">
             {JSON.stringify(metarData)}
            </div>  
         </div>
         <div>
             {JSON.stringify(aptDb)}   
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
