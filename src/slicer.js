// The following functions ammend items from data sources to be compiled in the correct format for the dashboard
// These come from the aviation weather METAR API with potential use for TAFs when forcast analysis is added
const timestamp = coded => {
    const loc = coded.indexOf("T");
    if(loc === -1 || (coded.length - loc) < 6){
        return ('##:##')
    }
    let start = loc + 1;
    let end = loc + 6;
    const decoded = coded.slice(start, end);
    return decoded

}

//Farenheight temperature conversiont "s for switch temp
const sTemp = value => {
    let f = Math.round((value * 1.8) + 32);
    return f;   
}

//Getting rid of the "K" for the sign; eventually will handle "P" for Alaska & Hawaii without need for edits
const iatac = icao => {
    let iata = icao.slice(1,4);
    return iata;
}

//Sometimes wind gust is null, making it zero for purposes of the page. 0 is filtered out and not displayed with CSS logic.
const retrieve_wgst = value => {
    if (value === undefined){
        return 0;
    }
    else{
        return value;
    }
}

//The following function flattens the data from AirportDB.io so necessary data can be retrieved with dot notation.

const flatdb = (data, prefix = '') => {
  const flat = {};

  for (let key in data) {
    if (Object.hasOwn(data, key)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;

       if (Array.isArray(data[key])) {
        data[key].forEach((item, i) => {
          Object.assign(flat, flatdb(item, `${newPrefix}[${i}]`));
        });
       } else if (typeof data[key] === 'object' && data[key] !== null) {
        Object.assign(flat, flatdb(data[key], newPrefix));
       } else {
        flat[newPrefix] = data[key];
       }
    }
  }
  return flat;
};

/*Removes unnecessary descriptors such as municipality and "airport" to display a concise title (i.e. Hartsfield-Jackson International
vs Atlanta Hartsfield Jackson International Airport)*/

const aptname = data => {
  let afldname = data.name;
  let municipality = data.municipality;
  
  let firsthack = afldname
    .replace(new RegExp(municipality, 'gi'), '')
    .replace(/airport/gi, '')                   
    .replace(/airfield/gi, '')    
    .trim();
  
  if(firsthack.toUpperCase() === 'INTERNATIONAL' || firsthack.toUpperCase() === 'REGIONAL') {
    afldname = municipality + ' ' + firsthack;
    return afldname;
  }

  return firsthack;
    
};

/*Retrieves a list of available runway headings from AirportDB.io (not idents). This is later used to analyze whether there are likely crosswinds.
For now considered >30 degree divergence from actual runway heading*/ 

const rwyhs = data => {
    const hdngs = Object.entries(data)
        .filter(([key]) => key.includes('heading_degT'))
        .map(([, value]) => value);
    const uhdngs = [...new Set(hdngs)];
    return uhdngs;
};

//Gamut calls all the METAR related items to return a dictionary of values properly formated for the dashboard
const gamut = data => {
    console.log('GAMUT CALLED WITH:', data.icaoId);
    let dict = {};
    dict.icao = iatac(data.icaoId);
    dict.ctemp = Math.round(data.temp);
    dict.ftemp = sTemp(data.temp);
    dict.dewp = Math.round(data.dewp);
    dict.fdewp = sTemp(data.dewp);
    dict.wdir = data.wdir;
    console.log('wdir set to: ' + data.wdir);
    dict.wspd = data.wspd;
    dict.wgst = retrieve_wgst(data.wgst);
    dict.caotime = timestamp(data.reportTime) + ' Z';
    return dict;
}

//Gauntlet does what gamut does, but for AirportDB.io data
const gauntlet = data => {
    const flatData = flatdb(data);
    let dict = {};
    dict.name = aptname(flatData);
    dict.web = flatData.home_link;
    dict.rwyh = rwyhs(flatData);
    return dict;
}

//This function utilizes the wind direction collected from the METAR/TAF and the runway heading collected from AirportDB to assigned true or false to the 
//crosswind variable
const crossdet = (windir, hdngs) => {
    let cross = true;
    let indicate, adjust;
    for (let i = 0; i < hdngs.length; i++) {
        if ((windir < 30 && hdngs[i] > 330) || (windir > 330 && hdngs[i] < 30)) {
            if (windir < hdngs[i]) {
                adjust = windir + 360;
                indicate = Math.abs(adjust - hdngs[i]); 
            }
            else {
                adjust = hdngs[i] + 360;
                indicate = Math.abs(adjust - windir);
            }
            if (indicate < 30){
                cross = false;
                break;
            }
        }
        else {
            indicate = Math.abs(windir - hdngs[i]) 
            if (indicate < 30) {
                cross = false;
                break;
            }
            
        }
    }
    return cross;
}

//Export the functions called outside the app; others are used by these function as data constructors
export { gamut, gauntlet, crossdet };