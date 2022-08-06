const getValidators = require("./get");
const createValidators = require("./create");
const updateValidators = require("./update");



module.exports = {
    ...getValidators,
    ...createValidators,
    ...updateValidators,
};
