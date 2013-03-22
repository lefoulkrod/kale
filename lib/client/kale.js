var Kale = {};

Kale.queue = function (options) {

    if (!options.baseUrl) { throw 'The baseUrl configuration is required.'; }
    this.url = options.baseUrl;
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
                    //TODO - parse the return to an event
                    var theEvent = xhr.responseText;
                    this.publishEvent(theEvent);
                }
            }.bind(this);
            xhr.send();
        }.bind(this), 500);
    };

    //a private method for firing events
    this.publishEvent = function (event) {
        if (this.handlers[event]) {
            for (var i = 0; i < this.handlers[event].length; i++) {
                var theHandler = this.handlers[event][i];
                theHandler.fn.call(theHandler.scope);
            }
        }
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
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 201) {
                var response = JSON.parse(xhr.responseText);
                this.queueid = response.queueid;
                this.qrimg = response.qrimg;
                this.publishEvent('created');
                this.listenForEvents();
            }
        }.bind(this);
        xhr.send();
    }
};