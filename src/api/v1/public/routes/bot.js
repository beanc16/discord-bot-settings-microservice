/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();


// Response
const { Success } = require("dotnet-responses");





/********
 * GETS *
 ********/

app.get("/:appId", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});





/*********
 * POSTS *
 *********/

app.post("/create", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});





/***********
 * PATCHES *
 ***********/

app.patch("/:appId", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});





module.exports = app;
