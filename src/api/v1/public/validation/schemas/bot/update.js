const { JoiRequired } = require("@beanc16/joi-helpers");
const botSchemas = require("./helpers");



const upsertBotPrefixSchema = JoiRequired.object({
    serverPrefix: JoiRequired.string(),
});

const upsertDataSchema = JoiRequired.object({
    data: botSchemas.dataObjRequired.min(1),
});



module.exports = {
    upsertBotPrefixSchema,
    upsertDataSchema,
};