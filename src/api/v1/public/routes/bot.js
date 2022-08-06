/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();


// Access req.body in post requests
const bodyParser = require("body-parser");
app.use(bodyParser.json());                         // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/xwww-form-urlencoded


// Telemetry
const { logger } = require("@beanc16/logger");


// Microservices
const { AppMicroservice } = require("@beanc16/microservices-abstraction");


// Models
const { Bot } = require("../../../../js/models");


// Controllers
const { BotController } = require("../../../../js/controllers");


// Validation
const {
    validateGetBotByAppIdPayload,
    validateGetBotByAppAndServerIdPayload,
    validateCreateBotPayload,
} = require("../validation");


// Response
const {
    Success,
    ValidationError,
    InternalServerError,
    getResponseByStatusCode,
} = require("dotnet-responses");





/********
 * GETS *
 ********/

app.get("/:appId", function(req, res)
{
    validateGetBotByAppIdPayload(req.params)
    .then(function (_)
    {
        AppMicroservice.v1.get({ id: req.params.appId })
        .then(function (result)
        {
            const app = result.data.data[0];

            BotController.getMostRecent({ appId: req.params.appId })
            .then((result) => _sendBotGetSuccess(res, result, app))
            .catch((err) => _sendBotGetError(res, err, app));
        })
        .catch((err) => _sendAppMicroserviceError(req, res, err, "retrieving"));
    })
    .catch((err) => _sendPayloadValidationError(res, err));
});

app.get("/:appId/:serverId", function(req, res)
{
    validateGetBotByAppAndServerIdPayload(req.params)
    .then(function (_)
    {
        AppMicroservice.v1.get({ id: req.params.appId })
        .then(function (result)
        {
            const app = result.data.data[0];

            BotController.getMostRecent({ appId: req.params.appId }, {
                // Only include one server element: the one with the given serverId
                "servers": {
                    "$elemMatch": {
                        "serverId": req.params.serverId
                    }
                }
            })
            .then((result) => _sendBotGetSuccess(res, result, app))
            .catch((err) => _sendBotGetError(res, err, app));
        })
        .catch((err) => _sendAppMicroserviceError(req, res, err, "retrieving"));
    })
    .catch((err) => _sendPayloadValidationError(res, err));
});

function _sendBotGetSuccess(res, result, app)
{
    Success.json({
        res,
        message: `Successfully retrieved a bot named ${app.displayName}`,
        data: result,
    });
}

function _sendBotGetError(res, err, app)
{
    const errMsg = `Failed to retrieve a bot${(app && app.displayName) ? ` named ${app.displayName}` : ""}`;
    logger.error(errMsg, err);

    InternalServerError.json({
        res,
        message: errMsg,
        error: err,
    });
}





/*********
 * POSTS *
 *********/

app.post("/create", function(req, res)
{
    validateCreateBotPayload(req.body)
    .then(function (_)
    {
        AppMicroservice.v1.create(req.body.app)
        .then(function (result)
        {
            const app = result.data.data;
            const bot = new Bot({
                appId: app._id,
                servers: req.body.servers,
                data: req.body.data,
            });

            BotController.insertOne(bot)
            .then((result) => _sendBotCreateSuccess(res, result, app))
            .catch((err) => _sendBotCreateError(res, err, app));
        })
        .catch((err) => _sendAppMicroserviceError(req, res, err));
    })
    .catch((err) => _sendPayloadValidationError(res, err));
});

function _sendBotCreateSuccess(res, result, app)
{
    Success.json({
        res,
        message: `Successfully created a bot named ${app.displayName}`,
        data: result,
    });
}

function _sendBotCreateError(res, err, app)
{
    const errMsg = `Failed to create a bot named ${app.displayName}`;
    logger.error(errMsg, err);

    InternalServerError.json({
        res,
        message: errMsg,
        error: err,
    });
}





/***********
 * PATCHES *
 ***********/

app.patch("/:appId", function(req, res)
{
    // TODO: Upsert servers array (ID and/or prefix) and data on existing bot.
    Success.json({
        res,
        message: "Pong",
    });
});





/***********
 * HELPERS *
 ***********/

function _sendQueryValidationError(res, err)
{
    ValidationError.json({
        res,
        message: "Query Validation Error",
        error: err,
    });
}

function _sendPayloadValidationError(res, err)
{
    ValidationError.json({
        res,
        error: err,
    });
}

function _sendAppMicroserviceError(req, res, err, verbing = "creating")
{
    const statusCode = (err && err.response && err.response.status)
        ? err.response.status
        : 500;

    if (statusCode !== 500)
    {
        const Response = getResponseByStatusCode(statusCode);

        Response.json({
            res,
            message: (statusCode === 422)
                ? "App validation error"
                : err.response.data.message,
            error: err.response.data.err,
        });
    }

    else
    {
        const errMsg = `An unknown error occurred while ${verbing} an app`;
        logger.error(errMsg, err.response.data.error || err, req.query, err.response.data);

        InternalServerError.json({
            res,
            message: errMsg,
            data: req.query,
            error: err.response.data.error || err,
        });
    }
}





module.exports = app;
