const Joi = require("joi");



const app = Joi.object();
const appRequired = app.required();



module.exports = {
    app,
    appRequired,
};
