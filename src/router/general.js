const express = require('express');
const public = express.Router();

const fetchMetar = require('../../metarfetch.js');
const fetchdb = require('../../airportdbfetch.js');
const { gamut } = require('../slicer.js');

public.get("/metar/:icaoV", async (req, res) => {
    
    let icao = req.params.icaoV.toUpperCase();
    if (icao === 'KABC') {
        let source = require('../metars.js');
        let { metars, page_values } = source;
        let dummy = metars.find(item => item.icaoId === 'KABC');
        let response = gamut(dummy);
        page_values.push(response);
        return res.status(200).json(response);
    }
    else {
        let current = await fetchMetar(icao);
        
        if (current && current.icao) {
            return res.json(current);
        }
        else {
            let source = require('../metars.js');
            let { page_values } = source;           
            let dummy = page_values.find(item => item.icaoId === 'ABC');
            return res.status(404).json(dummy);    
        }
    }
});

public.get("/db/:icaoV", async (req, res) => {
    const icao = req.params.icaoV.toUpperCase();
    
    if (icao === 'KABC'){
        let source = require('../metars.js');
        let { aptdb } = source;
        let dummy = aptdb.find(item => item.name === 'Lookup Airport by ICAO');
        return res.status(200).json(dummy);
    }
    const db = await fetchdb(icao);
    
    
    return res.json(db || null); 

});
module.exports = public;