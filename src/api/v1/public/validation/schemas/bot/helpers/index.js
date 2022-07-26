const appSchemas = require("./app");
const dataObjSchemas = require("./dataObj");
const serversSchemas = require("./servers");



module.exports = {
    ...appSchemas,
    ...dataObjSchemas,
    ...serversSchemas,
};
