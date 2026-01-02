let metars = [
    {"icaoId":"KABC","receiptTime":"2025-01-01T00:00:00.001Z","obsTime":1764769920,"reportTime":"2025-12-03T14:00:00.000Z","temp":0.0,"dewp":0.0,"wdir":0,"wspd":0,"wgst":25,"visib":"--","altim":29.92,"slp":1021.2,"qcField":12,"metarType":"METAR","rawOb":"METAR KABC 010001Z 00000KT 0SM BKN010 02/M02 A2992 RMK AO2 SLP212 CIG 016V020 T00171022 $","lat":44.03820,"lon":-103.06076,"elev":100,"name":"UNABLE TO RETRIEVE","cover":"BKN","clouds":[{"cover":"BKN","base":1000}],"fltCat":"MVFR"}
]

let aptdb = [
    {"name":"Lookup Airport by ICAO","web":"","rwyh":["130","31"]}
]

let page_values = [
    
];



module.exports = {
    metars,
    aptdb,
    page_values
};