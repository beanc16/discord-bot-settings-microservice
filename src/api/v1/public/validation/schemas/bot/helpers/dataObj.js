const Joi = require("joi");



const dataObj = Joi.object()
.max(100)
.pattern(
    Joi.string().max(100),                                  // Keys
    Joi.alternatives().try(                                 // Values
        Joi.string()
           .min(1)
           .max(500),
        Joi.number()
           .min(-999999999999999999999999999999)            // 30 digit
           .max(999999999999999999999999999999),            // 30 digit
        Joi.boolean(),
        Joi.date(),
    ),
);

const dataObjRequired = dataObj.required();



module.exports = {
    dataObj,
    dataObjRequired,
};
