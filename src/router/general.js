const express = require('express');
const public = express.Router();

const fetchMetar = require('../../metarfetch.js');



public.get("/metar/:icaoV", async (req, res) => {
    
    let icao = req.params.icaoV.toUpperCase();
    if (icao === 'KABC') {
        let source = require('../metars.js');
        console.log('you made it this far');
        let { page_values } = source;
        console.log('turning the corner a page_values definition');
        let dummy = page_values.find(item => item.icao === 'ABC');
        console.log('here is your dummy: ' + dummy);

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
            let dummy = page_values.find(item => item.icaoId === icao);
            return res.status(404).json(dummy);    
        }
    }
});

module.exports = public;