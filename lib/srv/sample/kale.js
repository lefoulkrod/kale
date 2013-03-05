var Kale = {};

Kale.queue = function (options) {
    this.url = options.baseurl || 'http://127.0.0.1:8889/';

    this.handlers = {
        'event': function () { },
    };

    //add the event handler signup function
    this.onEvent = function (handler) {
        this.handlers['event'] = handler;
    };

    //a private method to listen for published events
    this.listenForEvents = function() {
        window.setInterval(function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.url + 'queue/' + this.queueid + '/event', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    this.handlers['event'](xhr.responseText);
                }
            }.bind(this);
            xhr.send();
        }.bind(this), 500);
    };

    //publish events to the queue
    this.enqueue = function (event) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.url + 'queue/' + this.queueid + '/event', true);
        xhr.send(event);
    };

    if (!options) { return; }
    
    this.onEvent(options.handler || function () { });
    this.queueid = options.queueid || '';

    //if a queue id was not provided, then we are going to create a new queue and start listening for events
    if (!this.queueid) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.url + 'queue/', true);
        xhr.onreadystatechange = function (that) {
            return function () {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    that.queueid = xhr.responseText;
                    that.listenForEvents();
                }
            };
        }(this);
        xhr.send();
    }
};