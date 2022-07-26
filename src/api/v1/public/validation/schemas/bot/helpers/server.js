const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");



const server = Joi.object({
    serverId: JoiRequired.number(),
    prefix: JoiRequired.string(),
});
const serverRequired = server.required();



module.exports = {
    server,
    serverRequired,
};
