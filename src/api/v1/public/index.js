/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();





/*******************
 * EXTERNAL ROUTES *
 *******************/

const pingEndpoints = require("./routes/ping");
const botEndpoints = require("./routes/bot");
app.use(`/ping`, pingEndpoints);
app.use(`/bot`, botEndpoints);





module.exports = app;
