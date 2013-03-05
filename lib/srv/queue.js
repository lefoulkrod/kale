/*
 * a simple queue abstraction wrapping an array.  
 * abstracted out to provide an extension point for future optimization in the event the array operations are too slow
 */
module.exports = function () {

    this.array = [];

    this.enqueue = function (val) {
        this.array.push(val);
    };

    this.dequeue = function () {
        return this.array.shift();
    };
}
