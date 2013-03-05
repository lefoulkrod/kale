var queue = require('./queue');
var hash = {};
var express = require('express');
var app = express();

//for now service up some static files
console.log(__dirname + '\\sample');
app.use(express.static(__dirname + '\\sample'));

app.post('/queue', function (req, res) {
    //var id = Math.floor(Math.random() * 11).toString();
    var id = '1';
    console.log('New queue ' + id + ' created.');
    hash[id] = new queue();
    res.status(201);
    res.send(id);
});

app.post('/queue/:id/event', function (req, res) {
    console.log('received event post');
    var q = hash[req.params.id];
    req.on('data', function (data) {
        console.log('Event ' + data + 'received');
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
console.log('Welcome to Kale.  Kale is listening on port 8889.');