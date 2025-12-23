const express = require('express');
const public = express.Router();

const fetchMetar = require('../../metarfetch.js');



public.get("/metar/:icaoV", async (req, res) => {
    
    let icao = req.params.icaoV.toUpperCase();
    if (icao === 'KABC') {
        let metars = require('../../metars.js');
        let dummy = metars.find(item => item.icaoId === 'KABC');
        return res.status(200).json(dummy);
    }
    else {
        let current = await fetchMetar(icao);
        if (current && current.icaoId) {
            return res.json(current);
        }
        else {
            let metars = require('../../metars.js');
            let dummy = metars.find(item => item.icaoId === 'KABC');
            return res.status(404).json(dummy);    
        }
    }
});

module.exports = public;