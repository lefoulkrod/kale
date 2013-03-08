/*
 * abstract out random string genertion for creating a new queue id
 */
module.exports = function () {

    this.string = "1";

    this.toString = function () {
        return this.string;
    };
}
