import $ from 'jquery';

window.$ = $;
window.jQuery = $;

/*jshint esversion: 6 */

/**
 * A Collection of namespaced utility functions for the Portal UI
 */
// ensure that 'portal' namespace exists for functions, create if not
window.portal = window.portal || {};
window.portal.WebSockets = window.portal.WebSockets || {};

/**
 * A web socket manager, intended to provide "robust" websocket handling in the case
 * of connection failures
 */
(function(ns){
    ns.WebSocketManager = class  {
        static DEFAULT_OPTIONS(){
            return{
                // maximum number of retry attempts in the case of a connection failure
                maxRetries:5,
                // interval between attempts in the case of a connection failure in milliseconds
                retryInterval:10000,
                // the functionto call when the maximum number of retries has been exceeded
                onMaxRetries:function(webSocketManager){return;},
                // the code to use when closing the WebSocket internally/intentionally
                internalWsCloseCode: 3001
            };
        }

        /**
         * Constructor
         *
         * @param url the URL which the web socket needs maintain a connection to
         * @param options any customised options
         */
        constructor(url, options={}){
            this.url = url;
            this.options = $.extend({}, ns.WebSocketManager.DEFAULT_OPTIONS(), options);
            this.websocket = null;
            this.retryCount = 0;
        }

        /**
         * Causes the websocket connection to initiate.
         */
        connect(){
            portal.Logger.info('Trying to connect to: ', this.url);
            // make sure we aren't creating multiple connections if there
            // is an existing websocket still onpen
            this.disconnect();
            // create the connection
            this.websocket = new WebSocket(this.url);
            // assign event handlers
            this.websocket.onopen = this.onOpen.bind(this);
            this.websocket.onclose = this.onClose.bind(this);
            this.websocket.onerror = this.onError.bind(this);
            this.websocket.onmessage = this.onMessage.bind(this);
        }

        /**
         * Causes the existing websocket connection (if any) to terminate gracefully
         * with a client side initiated disconnection.
         */
        disconnect(){
            if(this.websocket !== null){
                this.websocket.close(this.options.internalWsCloseCode);
                this.websocket = null;
            }
        }

        /**
         * Event handler for the web socket 'onopen' event
         * @param evt the 'onopen' event
         */
        onOpen(evt){
            portal.Logger.debug('Connected to: '+ this.url);
            this.retryCount = 0;
        }

        /**
         * Event handler for the web socket 'onclose' event
         * @param evt the 'onclose' event
         */
        onClose(evt){
            this.websocket = null;
            if(evt.code !== this.options.internalWsCloseCode){
                portal.Logger.warning('Not connected: '+ this.url + evt.code, evt.reason);
                if(this.options.maxRetries <= 0 || this.retryCount < this.options.maxRetries){
                    this.retryCount ++;
                    let msg = 'Reconnecting in '+(this.options.retryInterval/1000.0)+' seconds';
                    if(this.options.maxRetries < 0){
                        msg += ' (retrying indefinitely).';
                    } else {
                        msg += '(attempt '+this.retryCount+' of '+this.options.maxRetries+').';
                    }
                    portal.Logger.info(msg);
                    setTimeout(this.connect.bind(this),
                               this.options.retryInterval);
                } else {
                    portal.Logger.warning('Maximum connection retries exceeded. Giving up.');
                    if($.isFunction(this.options.onMaxRetries)){
                        this.options.onMaxRetries(this);
                    }
                }
            } else {
                portal.Logger.info('Connection closed normally.');
            }
        }
        /**
         * Event handler for the web socket 'onerror' event
         * @param evt the 'onerror' event
         */
        onError(evt){
            // CONNECTING   0   The connection is not yet open.
            // OPEN	        1   The connection is open and ready to communicate.
            // CLOSING	    2   The connection is in the process of closing.
            // CLOSED       3
            // only handle errors if readyState is 1
            if(this.websocket.readyState === 1){
                portal.Logger.error('Web Socket error:', evt.message);
            }
        }
        /**
         * Event handler for the web socket 'onmessage' event
         * @param evt the 'onmessage' event
         */
        onMessage(evt){
            // not implemented
        }
    };

    /**
     * A web socket manager to manage the websocket connections used for the LiveWall to handle
     * anomaly notifications and video playback
     */
    ns.LiveWallWebSocket = class extends ns.WebSocketManager{
        /**
         * Constructor
         * @param url the URL for the web socket connection
         * @param soapStreamBase the 'base' of the URL for SOAP video stream retrieval
         * @param videoPaneManager the video pane manager of the LiveWall
         */
        constructor(url, soapStreamBase, videoPaneManager){
            super(url);
            this.id = ns.LiveWallWebSocket._hashCode(url);
            this.soapStreamBase = soapStreamBase;
            this.videoPaneManager = videoPaneManager;

            // TODO - this indicator stuff isn't particularly generic
            this.indicator = $('#connection-indicator-'+this.id);
            if(this.indicator.length === 0){
                let host = url.split('/')[2];
                this.indicator = $('<span id="connection-indicator-'+this.id+'" class="connection-indicator working" title="'+host+'"></span>');
                $('#connection-status').append(this.indicator);
            }
        }
        /**
         * @override
         */
        connect(){
            super.connect();
            this.indicator.removeClass('warning error').addClass('working');
        }
        /**
         * @override
         */
        onOpen(evt){
            super.onOpen(evt);
            this.indicator.removeClass('working warning error');
        }
        /**
         * @override
         */
        onClose(evt){
            super.onClose(evt);
            this.indicator.removeClass('working error').addClass('warning');
            if(this.options.maxRetries <= 0 || this.retryCount < this.options.maxRetries){
                this.indicator.addClass('warning');
            } else {
                this.indicator.addClass('error');
            }
        }
        /**
         * @override
         */
        onError(evt){
            super.onError(evt);
        }
        /**
         * @override
         */
        onMessage(evt){
            super.onMessage(evt);
            let anomalyEvent = JSON.parse(evt.data);
            let messageContent = {
                id: anomalyEvent.camera_id,
                title: anomalyEvent.camera_display_name,
                timestamp: anomalyEvent.anomaly_start,
                installation_timestamp: anomalyEvent.installation_time,
                streams: [
                    {
                        type: 'type/webm',
                        url: this.soapStreamBase + '?' + jQuery.param({
                            camera_name: anomalyEvent.camera_name,
                            anomaly_start: anomalyEvent.anomaly_start
                        })
                    }
                ]
            };
            let messageType = anomalyEvent.anomaly_state || false;
            if(messageType === 'BEGIN') {
                this.videoPaneManager.addFeed(messageContent);
            } else if(messageType === 'END') {
                this.videoPaneManager.removeFeed(messageContent);
            }
        }
        /**
         * Generates hash codes from strings - used to create a unique ID based on the URL string for
         * the websocket connection
         * @param text the string to create the hash code integer from
         * @return {number} a 32 bit integer hash code for the provided string
         * @private
         */
        static _hashCode(text){
            let hash = 0;
            if (text.length > 0){
                for (let i = 0; i < text.length; i++) {
                    hash  = ((hash << 5) - hash) + text.charCodeAt(i);
                    hash |= 0; // this converts the has value to a 32 bit integer
                }
            }
            return hash;
        }
    };

}(window.portal.WebSockets));
