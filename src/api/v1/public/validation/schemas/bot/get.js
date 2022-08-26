const { JoiRequired } = require("@beanc16/joi-helpers");



const getBotByAppIdSchema = JoiRequired.object({
    appId: JoiRequired.string(),
});

const getBotByAppAndServerIdSchema = JoiRequired.object({
    appId: JoiRequired.string(),
    serverId: JoiRequired.string(),
});



module.exports = {
    getBotByAppIdSchema,
    getBotByAppAndServerIdSchema,
};