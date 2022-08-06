const { updateBotSchema } = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



function validateUpdateBotPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(updateBotSchema, payload)
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
    validateUpdateBotPayload,
};
