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
    // TODO: Get all info on a discord bot.
    Success.json({
        res,
        message: "Pong",
    });
});

app.get("/:appId/:serverId", function(req, res)
{
    // TODO: Get info on a discord bot for a specific server.
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
    // TODO: Create discord bot as app in app microservice.
    Success.json({
        res,
        message: "Pong",
    });
});

app.post("/:appId", function(req, res)
{
    // TODO: Upsert server ID and prefix into MongoDB.
    Success.json({
        res,
        message: "Pong",
    });
});





module.exports = app;
