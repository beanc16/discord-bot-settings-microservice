const {
    getBotByAppIdSchema,
    getBotByAppAndServerIdSchema,
} = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



function validateGetBotByAppIdPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(getBotByAppIdSchema, payload)
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

function validateGetBotByAppAndServerIdPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(getBotByAppAndServerIdSchema, payload)
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
    validateGetBotByAppIdPayload,
    validateGetBotByAppAndServerIdPayload,
};
