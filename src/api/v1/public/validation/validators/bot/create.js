const { createAppSchema } = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



function validateCreateBotPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(createAppSchema, payload)
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
    validateCreateBotPayload,
};
