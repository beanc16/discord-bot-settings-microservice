const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");



const server = Joi.object({
    serverId: JoiRequired.number(),
    prefix: JoiRequired.string(),
});
const serverRequired = server.required();

const servers = Joi.array().items(server);
const serversRequired = servers.required();



module.exports = {
    server,
    serverRequired,
    servers,
    serversRequired,
};
