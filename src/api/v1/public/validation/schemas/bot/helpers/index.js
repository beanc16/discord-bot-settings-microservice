const appSchemas = require("./app");
const dataObjSchemas = require("./dataObj");
const serverSchemas = require("./server");



module.exports = {
    ...appSchemas,
    ...dataObjSchemas,
    ...serverSchemas,
};
