const metars = require('./metars.js');

async function fetchMetar(icaoV) {
  const url = `https://aviationweather.gov/api/data/metar?ids=${icaoV}&format=json`;
  
  console.log('sent request to' + url);

  try {
    const response = await fetch(url);
    console.log('response: '+ response)
    const data = await response.json();
    if (data.length > 0) {
        console.log('METAR found pushing to local repository');
        metars.push(data[0]);
        return data[0];
    }
    else {
        console.log('METAR not retrieved for ' + icao);
        let altdata = metars.find(item => item.icaoId === icao);
        return altdata;
    }

  } catch (error) {
    console.error('METAR retreival system error', error);
    return null;
  }
}

module.exports = fetchMetar;
