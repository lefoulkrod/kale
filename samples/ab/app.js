var path = require('path');
var kalePath = path.join('..', '..', 'lib', 'srv', 'kale');
var kale = require(kalePath);

//start a new queueserver
new kale.queueServer({
    port: process.env.PORT || 8889,
    host: 'floating-sierra-6487.herokuapp.com',
    staticPath: path.join(__dirname, '.')
});