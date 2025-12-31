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

const gamut = data => {
    console.log('GAMUT CALLED WITH:', data.icaoId);
    let dict = {};
    dict.icao = iatac(data.icaoId);
    dict.ctemp = Math.round(data.temp);
    dict.ftemp = sTemp(data.temp);
    dict.dewp = Math.round(data.dewp);
    dict.fdpoint = sTemp(data.dewp);
    dict.caotime = timestamp(data.reportTime) + ' Z';
    return dict;
}

export { timestamp, sTemp, gamut };