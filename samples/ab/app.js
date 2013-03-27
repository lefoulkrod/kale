var path = require('path');
var kalePath = path.join('..', '..', 'lib', 'srv', 'kale');
var kale = require(kalePath);

//start a new queueserver
new kale.queueServer({
    port: 8889,
    staticPath: path.join(__dirname, '.')
});