const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");



const app = Joi.object();
const appRequired = app.required();



module.exports = {
    app,
    appRequired,
};
