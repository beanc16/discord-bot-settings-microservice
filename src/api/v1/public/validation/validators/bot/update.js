const { upsertBotPrefixSchema } = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



function validateUpsertBotPrefixPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(upsertBotPrefixSchema, payload)
            .then(function (value)
            {
                resolve(value);
            })
            .catch(function (error)
            {
                reject(error);
            });
    });
}



module.exports = {
    validateUpsertBotPrefixPayload,
};
