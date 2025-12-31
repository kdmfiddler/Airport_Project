const { metars, page_values } = require('./src/metars.js');
const { gamut } = require('./src/slicer.js');

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
        let pagevalues = gamut(data[0]);
        page_values.push(pagevalues);
        return pagevalues;
    }
    else {
        console.log('METAR not retrieved for ' + icaoV);
        return null;
    }

  } catch (error) {
    console.error('METAR retreival system error', error);
    return null;
  }
}

module.exports = fetchMetar;
