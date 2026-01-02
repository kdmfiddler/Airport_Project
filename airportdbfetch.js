const { aptdb } = require('./src/metars.js');
const { gauntlet } = require('./src/slicer.js');


async function fetchdb(icaoV) {
  const apiToken = 'ad57942ecc4eb16c28421c85673b724eba6b4f8162876f615f187b2edc54f0ebba5d2416be71314907470057f7954c42'  
  const url =`https://airportdb.io/api/v1/airport/${icaoV}?apiToken=${apiToken}` 
  
  
  console.log('sent request to' + url);

  try {
    const response = await fetch(url);
    
    const data = await response.json();
   
    const construct = JSON.parse(JSON.stringify(data)) || data;
    if (construct && Object.keys(construct).length > 0) {
        console.log('DB info found pushing to local repository');
        modified = gauntlet(construct);
        aptdb.push(modified);
        return modified;
    }
    else {
        console.log('DB Info not retrieved for ' + icaoV);
        return null;
    }

  } catch (error) {
    console.error('DB info retreival system error', error);
    return null;
  }
}

module.exports = fetchdb;

