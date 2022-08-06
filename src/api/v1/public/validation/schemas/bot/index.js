const getSchemas = require("./get");
const createSchemas = require("./create");
const updateSchemas = require("./update");



module.exports = {
    ...getSchemas,
    ...createSchemas,
    ...updateSchemas,
};
