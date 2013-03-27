var hash = {};
var express = require('express');
var app = express();
var kale = require('./kale');
var log = require('./kale').log;
var queue = require('./kale').queue;

module.exports = function (options) {

    var kaleClientPath = require('path').join(__dirname, '..', 'client');
    app.use(express.static(options.staticPath));
    app.use(express.static(kaleClientPath));
    app.use(express.bodyParser());

    // Create a new queue
    app.post('/queue', function (req, res) {
        var id = new kale.randomString().toString();
        log.info('New queue ' + id + ' created.');
        hash[id] = new queue();
        res.status(201);

        //create the qr code 
        var qr = kale.qrcode(4, 'M');
        qr.addData('http://192.168.1.4:8889/controller.html?q=' + id);
        qr.make();
        var imgTag = qr.createImgTag();
        res.send({ queueid: id, qrimg: imgTag });
    });

    // Create a new event on the queue
    app.post('/queue/:id/event', function (req, res) {
        var q = hash[req.params.id];
        var event = req.body;
        log.info('Event ' + event.name + ' received');
        q.enqueue(event);
        res.send();
    });

    // Get the head event from the queue
    app.get('/queue/:id/event', function (req, res) {
        var q = hash[req.params.id];
        if (!q) {
            res.statusCode = 404;
        }
        var event = q.dequeue();
        if (!event) {
            res.statusCode = 404;
        }
        res.send(event);
    });

    app.listen(options.port, options.host);
    log.info('Welcome to Kale.  Kale is listening on port ' + options.port + '.');
};
