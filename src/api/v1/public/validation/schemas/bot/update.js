const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");
const botSchemas = require("./helpers");



const updateBotSchema = JoiRequired.object({
    serverPrefix: JoiRequired.string(),
});



module.exports = {
    updateBotSchema,
};