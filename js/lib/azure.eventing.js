(function () {
    var eventCallbacks = {}, // map of event type to registered event callbacks
        socket, // the websocket connection
        socketUrl; // the URL for the websocket to connect to

    // we need to fetch a valid wss url to the blasteroids eventing Pub Sub    
    fetch('https://blasteroids.azurewebsites.net/api/tokenservice?id=1234&hubname=reptar', {
        mode: 'no-cors'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("AzureEventing failed to retrieve WSS url from token service: HTTP error " + response.status);
            }

            return response.json();
        })
        .then(tokenUrlJson => {
            socketUrl = tokenUrlJson.url;
        });

    /**
     * Returns the websocket connection, creating one if it does not exist.
     * @private
     * @returns {WebSocket} the websocket
     */
    var _getOrCreateWebSocket = function () {
        if (socket === undefined) {
            // protocol is required for azure webpubsub
            socket = new WebSocket(socketUrl, 'json.webpubsub.azure.v1');

            // when the socket opens at first, it is a noop
            socket.onopen = function () { };

            // when the socket receives a message
            socket.onmessage = function (event) {
                // get the data for the "message"
                var data = JSON.parse(event.data);

                if (data.type === 'message') {
                    // get the event from the "message" data
                    var event = JSON.parse(data.data);

                    if (event !== null) {
                        // publish the event locally
                        AzureEventing.publishEvent(event);
                    }
                }
            }
        }

        return socket;
    };

    /**
     * @namespace AzureEventing
     * @summary Azure eventing support.
     */
    AzureEventing = {
        /**
         * 
         * @param {Object} [context={}] context attributes of the Event
         * @param {string|Object} [data="{}"] the data for the Event, or the "payload"
         * @param {string} type the type for the Event 
         * @param {string} [id] the id for the event
         * @param {string} [datacontenttype="application/json"] the content type for the Event's data, or "payload" 
         * @param {string} [dataschema=""] URI to schema for the Event's data
         * @param {string} [source=""] URI for the source of this Event, prepended to Event id by default
         * @param {string} [specVersion="1.0"] the version of the spec this Event follows 
         * @param {string} [subject=""] Additional metadata about the Event that can be inspected by others 
         * without having to have access to Event data, or deserializing it. 
         * @param {string} [time] ISO string for the time the Event occured
         *  
         * @returns {Object} the Event
         */
        createEvent: function (context, data, type, id, datacontenttype, dataschema, source, specVersion, subject, time) {
            let date = new Date();

            return {
                id: id ? id : '' + (source ? source : 'null') + '_' + date.getTime(),
                context: context ? context : {},
                datacontenttype: datacontenttype ? datacontenttype : 'application/json',
                data: data ? JSON.stringify(data) : '{}',
                dataschema: dataschema ? dataschema : '',
                source: source ? source : '',
                specVersion: specVersion ? specVersion : '1.0',
                subject: subject ? subject : '',
                time: time ? time : date.toISOString(),
                type: type ? type : 'undetermined'
            };
        },

        isReady: function () {
            return socketUrl !== null && socketUrl !== undefined;
        },

        /**
         * Returns true if the event is a valid Event, false otherwise.
         * Only valid Events are published.
         * 
         * @param {Object} event the event to test
         * 
         * @returns {boolean} returns true if the event is a valid Event, false otherwise  
         */
        isValidEvent: function (event) {
            // @formatter:off
            return (event !== undefined &&
                event !== null &&
                typeof event === 'object' &&
                event.type !== undefined &&
                typeof event.type === 'string' &&
                event.type.length > 0 &&
                event.type !== 'undetermined' &&
                event.id !== undefined &&
                typeof event.id === 'string' &&
                event.id.length > 0 &&
                event.time !== undefined);
            // @formatter:on
        },

        /**
         * Publishes an Event, if it is a valid Event.
         *
         * @param {Object} event the event to publish, must be a valid Event
         * @param {String} [destination] the server destination to send the event to
         * if omitted, the event is broadcast within the local client only
         * 
         * @see AzureEventing.createEvent
         * @see AzureEventing.isValidEvent
         */
        publishEvent: function (event, destination) {
            if (AzureEventing.isValidEvent(event)) {
                if (destination != null && typeof destination === 'string' && destination.length > 0) {
                    //broadcast to WSS
                    var socket = _getOrCreateWebSocket();

                    // add the destination to the context
                    event.context.destination = destination;

                    if (socket.readyState === socket.OPEN) {
                        // if the socket is already open, we can send to the group for the event's type
                        socket.send(JSON.stringify({
                            type: 'sendToGroup',
                            data: JSON.stringify(event),
                            group: event.type
                        }));
                    } else {
                        // otherwise, we need to modify onopen to call orginal onopen,
                        var onopen = socket.onopen;

                        socket.onopen = function () {
                            onopen();

                            // then, we can send to group
                            socket.send(JSON.stringify({
                                type: 'sendToGroup',
                                data: JSON.stringify(event),
                                group: event.type
                            }));
                        };
                    }
                } else {
                    // broadcast locally only, not to WSS
                    if (eventCallbacks[event.type] !== null && eventCallbacks[event.type].length > 0) {
                        // call each callback for the received event type
                        eventCallbacks[event.type].forEach(function (callback) {
                            callback(event);
                        });
                    }
                }
            }
        },

        /**
         * Subscribe to a particular Event eventType and register a callback for events of that eventType.
         * 
         * To unsubsubscribe, call the callback that is returned from this function.
         * 
         * @param {string} eventType the type of the event to subscribe to 
         * @param {Function} callback a function that takes a single parameter, the event, 
         * which is called on and passed the event, whenever events of the provided eventType occur
         *  
         * @returns {Function} a function that takes no parameters and, when called, 
         * unregisters the previously registered callback
         */
        subscribeToEvent: function (eventType, callback) {
            if (eventType !== null && typeof eventType === 'string' && eventType.length > 0) {
                var socket = _getOrCreateWebSocket();

                if (socket.readyState === socket.OPEN) {
                    // if the socket is already open, we can joinGroup
                    socket.send(JSON.stringify({
                        type: 'joinGroup',
                        group: eventType
                    }));
                } else {
                    // otherwise, we need to modify onopen to call orginal onopen,
                    var onopen = socket.onopen;

                    socket.onopen = function () {
                        onopen();

                        // then, we can join the group
                        socket.send(JSON.stringify({
                            type: 'joinGroup',
                            group: eventType
                        }));
                    };
                }

                // create an array to hold callbacks for the eventType if one does not exist
                if (eventCallbacks[eventType] === undefined) {
                    eventCallbacks[eventType] = [];
                }

                // register the callback for the eventType
                eventCallbacks[eventType].push(callback);

                // return the unsubscribe callback function
                return function () {
                    var index = eventCallbacks[eventType].indexOf(callback);

                    // splice out the callback
                    if (index >= 0) {
                        eventCallbacks[eventType].splice(index, 1);
                    }

                    // then, leave the group
                    socket.send(JSON.stringify({
                        type: 'leaveGroup',
                        group: eventType
                    }));
                };
            }
        }
    }
})();