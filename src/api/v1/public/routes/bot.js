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
    validateUpdateBotPayload,
} = require("../validation");


// Response
const {
    Success,
    ValidationError,
    InternalServerError,
    getResponseByStatusCode,
    NotFound,
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

app.get("/:appId/:serverId", _getBotByAppIdAndServerId);

async function _getBotByAppIdAndServerId(req, res, sendResponseOnServerDoesNotExist = true)
{
    return new Promise(function (resolve, reject)
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
                .then(function (result)
                {
                    const serverIdExists = result.servers.some(function (server)
                    {
                        return (server && server.serverId === req.params.serverId);
                    });
    
                    if (serverIdExists)
                    {
                        if (sendResponseOnServerDoesNotExist)
                        {
                            _sendBotGetSuccess(res, result, app);
                        }
                        resolve(app);
                    }
    
                    else
                    {
                        if (sendResponseOnServerDoesNotExist)
                        {
                            _sendBotGetServerDoesNotExistError(req, res, result, app);
                        }

                        else
                        {
                            reject({
                                statusCode: 404,
                                bot: new Bot({ ...result, appId: app._id }),
                                app,
                            });
                        }
                    }
                })
                .catch((err) => _sendBotGetError(res, err, app));
            })
            .catch((err) => _sendAppMicroserviceError(req, res, err, "retrieving"));
        })
        .catch((err) => _sendPayloadValidationError(res, err));
    });
}

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

function _sendBotGetServerDoesNotExistError(req, res, result, app)
{
    NotFound.json({
        res,
        message: `A bot named ${app.displayName} was found. However, it does not contain a server with a serverId of ${req.params.serverId}.`,
        data: result,
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

app.patch("/:appId/:serverId", function(req, res)
{
    validateUpdateBotPayload(req.body)
    .then(function (__)
    {
        _getBotByAppIdAndServerId(req, res, false)
        .then(function (app)
        {
            // Update
            _updateExistingPrefix(req, res, app);
        })
        .catch(function (response)
        {
            // Insert new prefix
            _insertNewPrefixOnExistingBot(req, res, response);
        });
    })
    .catch((err) => _sendPayloadValidationError(res, err));
});

function _updateExistingPrefix(req, res, app)
{
    BotController.findOneAndUpdate({ appId: req.params.appId }, {
        // Only update one server element: the one with the given serverId
        "servers.$[element].prefix": req.body.serverPrefix
    }, {
        arrayFilters: [{
            // Update the given server's prefix
            "element.serverId": req.params.serverId
        }]
    })
    .then((result) => _sendBotUpdateSuccess(res, result, app))
    .catch((err) => _sendBotUpdateError(res, err, app));
}

function _insertNewPrefixOnExistingBot(req, res, response)
{
    // The bot was found but the server does not exist.
    if (response && response.statusCode === 404)
    {
        BotController.findOneAndUpdate({ appId: req.params.appId }, {
            // Add the given serverPrefix to the end of the servers array
            servers: {
                serverId: req.params.serverId,
                prefix: req.body.serverPrefix,
            }
        }, { operator: "push" })
        .then((result) => _sendBotUpdateSuccess(res, result, response.app))
        .catch((err) => _sendBotUpdateError(res, err, response.app));
    }

    // An unknown error occured.
    else
    {
        _sendBotUpdateError(res, null, response.app);
    }
}

function _sendBotUpdateSuccess(res, result, app)
{
    Success.json({
        res,
        message: `Successfully updated a bot named ${app.displayName}`,
        data: result,
    });
}

function _sendBotUpdateError(res, err, app)
{
    const errMsg = `Failed to update a bot named ${app.displayName}`;
    logger.error(errMsg, err);

    InternalServerError.json({
        res,
        message: errMsg,
        error: err,
    });
}





/***********
 * HELPERS *
 ***********/

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
