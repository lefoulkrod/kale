/*
 * Abstract out the logging so I can so something more or less fancy later.
 */
module.exports.info = function (data) {
    console.info(data);
}
module.exports.error = function (data) {
    console.error(data);
}
module.exports.warn = function (data) {
    console.warn(data);
}