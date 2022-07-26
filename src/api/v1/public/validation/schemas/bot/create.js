const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");
const botSchemas = require("./helpers");



// Create app
const createAppSchema = JoiRequired.object({
    app: botSchemas.appRequired,
    servers: botSchemas.servers,
    data: botSchemas.dataObj,
});



module.exports = {
    createAppSchema,
};