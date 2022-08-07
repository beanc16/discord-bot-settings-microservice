const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");
const botSchemas = require("./helpers");



const upsertBotPrefixSchema = JoiRequired.object({
    serverPrefix: JoiRequired.string(),
});



module.exports = {
    upsertBotPrefixSchema,
};