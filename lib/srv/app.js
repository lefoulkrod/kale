var hash = {};
var express = require('express');
var app = express();
var kale = require('./kale');
var log = require('./kale').log;
var queue = require('./kale').queue;

var staticPath = require('path').join(__dirname, '..', '..', 'static');
var kaleClientPath = require('path').join(__dirname, '..', 'client');
app.use(express.static(staticPath));
app.use(express.static(kaleClientPath));

app.post('/queue', function (req, res) {
    var id = new kale.randomString().toString();
    log.info('New queue ' + id + ' created.');
    hash[id] = new queue();
    res.status(201);
    res.send(id);
});

app.post('/queue/:id/event', function (req, res) {
    var q = hash[req.params.id];
    req.on('data', function (data) {
        log.info('Event ' + data + ' received');
        q.enqueue(data);
    });
    req.on('end', function () {
        res.send();
    });
});

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

app.listen(8889);
log.info('Welcome to Kale.  Kale is listening on port 8889.');