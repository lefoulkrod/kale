var Kale = {};

Kale.queue = function (options) {

    this.url = options.baseurl || 'http://127.0.0.1:8889/';
    this.handlers = {};

    //add the event handler signup function
    this.on = function (event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    };

    //a private method to listen for published events
    this.listenForEvents = function() {
        window.setInterval(function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.url + 'queue/' + this.queueid + '/event', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //TODO - figure out how to produce an object from JSON
                    var theEvent = xhr.responseText;
                    if (this.handlers[theEvent]) {
                        for (var i = 0; i < this.handlers[theEvent].length; i++) {
                            var theHandler = this.handlers[theEvent][i];
                            theHandler.fn.call(theHandler.scope);
                        }
                    }
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
    
    if (options.handlers) {
        for (var i = 0; i < options.handlers.length; i++) {
            var handler = options.handlers[i];
            this.on(handler.event, { fn: handler.fn, scope: handler.scope });
        }
    }

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