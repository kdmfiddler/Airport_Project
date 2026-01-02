const timestamp = coded => {
    const loc = coded.indexOf("T");
    /*if(loc == -1 || (coded.length - loc) < 6){
        return ('##:##')
    }*/
    let start = loc + 1;
    let end = loc + 6;
    const decoded = coded.slice(start, end);
    return decoded

}

const sTemp = value => {
    let f = Math.round((value * 1.8) + 32);
    return f;   
}

const iatac = icao => {
    let iata = icao.slice(1,4);
    return iata;
}

const retrieve_wgst = value => {
    if (value === undefined){
        return 0;
    }
    else{
        return value;
    }
}

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

const rwyhs = data => {
    const hdngs = Object.entries(data)
        .filter(([key]) => key.includes('heading_degT'))
        .map(([, value]) => value);
    const uhdngs = [...new Set(hdngs)];
    return uhdngs;
};

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

const gauntlet = data => {
    const flatData = flatdb(data);
    let dict = {};
    dict.name = aptname(flatData);
    dict.web = flatData.home_link;
    dict.rwyh = rwyhs(flatData);
    return dict;
}

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

export { gamut, gauntlet, crossdet };