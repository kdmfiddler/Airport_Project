const express = require('express');
const public = express.Router();

const fetchMetar = require('../../metarfetch.js');
const fetchdb = require('../../airportdbfetch.js')


public.get("/metar/:icaoV", async (req, res) => {
    
    let icao = req.params.icaoV.toUpperCase();
    if (icao === 'KABC') {
        let source = require('../metars.js');
        let { page_values } = source;
        let dummy = page_values.find(item => item.icao === 'ABC');
        return res.status(200).json(dummy);
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
    console.log('🌐 DB ROUTE HIT:', icao);
    if (icao === 'KABC'){
        return res.status(404).json(null);
    }
    const db = await fetchdb(icao);
    console.log('📦 fetchdb RETURNED:', db ? 'DATA' : 'NULL')
    
    return res.json(db || null); 

});
module.exports = public;