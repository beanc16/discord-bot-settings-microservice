const { MongoDbControllerWithEnv } = require("mongodb-controller");
const { Bot } = require("../models");
const { logger } = require("@beanc16/logger");



class BotController extends MongoDbControllerWithEnv
{
    static collectionName = process.env.COLLECTION_BOT;
    static Model = Bot;
    static logger = logger;
}



module.exports = BotController;
