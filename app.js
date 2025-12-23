const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const publicRouter = require('./src/router/general.js');

app.use(publicRouter);

module.exports = app;