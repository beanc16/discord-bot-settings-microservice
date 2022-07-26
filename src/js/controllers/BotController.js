const { MongoDbControllerWithEnv } = require("mongodb-controller");
const { Bot } = require("../models");



class BotController extends MongoDbControllerWithEnv
{
    static collectionName = process.env.COLLECTION_BOT;
    static Model = Bot;
}



module.exports = BotController;
