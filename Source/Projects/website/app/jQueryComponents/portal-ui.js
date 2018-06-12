import $ from 'jquery';
import swal from 'sweetalert2';
import toastr from 'toastr';
import NProgress from 'nprogress';

window.$ = $;
window.jQuery = $;
window.NProgress = NProgress;

/* eslint-disable */

/**
 * A Collection of namespaced utility functions for the Portal UI
 */

// ensure that 'portal' namespace exists for functions, create if not
window.portal = window.portal || {};
window.portal.Logger = window.portal.Logger || {};
window.portal.Alerts = window.portal.Alerts || {};
window.portal.Toast = window.portal.Toast || {};
window.portal.TextUtils = window.portal.TextUtils || {};
window.portal.DateTimeUtils = window.portal.DateTimeUtils || {};
window.portal.StatusUtils = window.portal.StatusUtils || {};
window.portal.DownloadUtils = window.portal.DownloadUtils || {};
window.portal.UploadUtils = window.portal.UploadUtils || {};

(function(ns){
    /**
     * Logging utilities
     *
     * Note that most methods return the logger namespace so that methods can be "chained" - for
     * example:
     *
     *     portal.Logger.error('This is an error').fatal('This is a fatal condition);
     */
    "use strict";
    // ============================================================================================
    // window.portal.Logger
    // ============================================================================================
    // log levels
    ns.FATAL = 0;   // least verbose
    ns.ERROR = 1;
    ns.WARNING = 2;
    ns.INFO = 3;
    ns.DEBUG = 4;   // most verbose
    // log severity limits
    ns.MIN_LEVEL = ns.FATAL; // least verbose
    ns.MAX_LEVEL = ns.DEBUG; // most verbose
    // label/prefixes for log messages of various severities
    ns.LEVEL_LABLES = {
        0: 'FATAL  ', // least verbose
        1: 'ERROR  ',
        2: 'WARNING',
        3: 'INFO   ',
        4: 'DEBUG  '  // most verbose
    };
    // start with ERROR level logging
    ns.currentThreshold = ns.ERROR;
    /**
     * Set the current logging threshold to restrict logging output - for example:
     *
     *     portal.Logger.setThreshold(portal.Logger.INFO);
     *
     * @param level the highest incident level to log - should be one of FATAL, ERROR, WARNING,
     *        INFO or DEBUG (see constants above), in order from quietest/least verbose to
     *        noisiest/most verbose.
     * @return {*|{}}
     */
    ns.setThreshold = function (level) {
        ns.currentThreshold = ns._constrainedLevel(level);
        return ns;
    };
    /**
     * Obtain the current logging threshold
     * @return {number|*} the highest incident level which will be logged as an integer
     */
    ns.getThreshold = function () {
        return ns.currentThreshold;
    };
    /**
     * Determine if a message logged at the FATAL level will actually be logged under the currently
     * active logging threshold level. Useful for determining whether it is "worth" constructing a
     * complex logging message or not, given that it may not actually be logged anyway.
     * @return {boolean} true if a message a the FATAL level will actually be logged
     */
    ns.willLogFatal = function () {
        return ns.willLog(ns.FATAL);
    };
    /**
     * Determine if a message logged at the ERROR level will actually be logged under the currently
     * active logging threshold level. Useful for determining whether it is "worth" constructing a
     * complex logging message or not, given that it may not actually be logged anyway.
     * @return {boolean} true if a message a the ERROR level will actually be logged
     */
    ns.willLogError = function () {
        return ns.willLog(ns.ERROR);
    };
    /**
     * Determine if a message logged at the WARNING level will actually be logged under the currently
     * active logging threshold level. Useful for determining whether it is "worth" constructing a
     * complex logging message or not, given that it may not actually be logged anyway.
     * @return {boolean} true if a message a the WARNING level will actually be logged
     */
    ns.willLogWarning = function () {
        return ns.willLog(ns.WARNING);
    };
    /**
     * Determine if a message logged at the INFO level will actually be logged under the currently
     * active logging threshold level. Useful for determining whether it is "worth" constructing a
     * complex logging message or not, given that it may not actually be logged anyway.
     * @return {boolean} true if a message a the INFO level will actually be logged
     */
    ns.willLogInfo = function () {
        return ns.willLog(ns.INFO);
    };
    /**
     * Determine if a message logged at the DEBUG level will actually be logged under the currently
     * active logging threshold level. Useful for determining whether it is "worth" constructing a
     * complex logging message or not, given that it may not actually be logged anyway.
     * @return {boolean} true if a message a the DEBUG level will actually be logged
     */
    ns.willLogDebug = function () {
        return ns.willLog(ns.DEBUG);
    };
    /**
     * Determine if a message logged at the given level will actually be logged under the currently
     * active logging threshold level. Useful for determining whether it is "worth" constructing a
     * complex logging message or not, given that it may not actually be logged anyway.
     * @return {boolean} true if a message a the given level will actually be logged
     */
    ns.willLog = function (level) {
        return level <= ns.currentThreshold;
    };
    /**
     * Log a DEBUG level message
     * @param msg the message to log
     * @return {*|{}}
     */
    ns.debug = function (...msg) {
        return ns._log(ns.DEBUG, ...msg);
    };
    /**
     * Log an INFO level message
     * @param msg the message to log
     * @return {*|{}}
     */
    ns.info = function (...msg) {
        return ns._log(ns.INFO, ...msg);
    };
    /**
     * Log a WARNINGlevel message
     * @param msg the message to log
     * @return {*|{}}
     */
    ns.warning = function (...msg) {
        return ns._log(ns.WARNING, ...msg);
    };
    /**
     * Log an ERROR level message
     * @param msg the message to log
     * @return {*|{}}
     */
    ns.error = function (...msg) {
        return ns._log(ns.ERROR, ...msg);
    };
    /**
     * Log a FATAL level message
     * @param msg the message to log
     * @return {*|{}}
     */
    ns.fatal = function (...msg) {
        return ns._log(ns.FATAL, ...msg);
    };
    /**
     * Performs the actual logging tasks
     * @param level the level of severity of the message
     * @param msg the message to log
     * @return {*|{}}
     * @private
     */
    ns._log = function (level, ...msg) {
        // sanity check log level
        level = ns._constrainedLevel(level);
        // log only if at or below current logging threshold
        if(level <= ns.currentThreshold){
            let levelLabel = ns.LEVEL_LABLES[level] +' :';
            msg.map(function(msg) {
                console.log(levelLabel, msg);
            });
        }
        return ns;
    };
    /**
     * Utility method to ensure that log level values are constrained to the valid range of values
     * @param level the log level
     * @return {number} the constrained log level
     * @private
     */
    ns._constrainedLevel = function(level){
        return Math.max(ns.MIN_LEVEL, Math.min(ns.MAX_LEVEL, level));
    };
}(window.portal.Logger));

/**
 * Basic debouncing function, to avoid multiple calls to the same function in rapid succession,
 * such as may occur when handling events related to keystrokes, window resizing and so on.
 * It creates a function, will not be invoked until it has *not* been invoked for a certain
 * timeout - more concretely, the function will be called after it *stops* being called for 'wait'
 * milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the
 * trailing.
 *
 * Example usage:
 *
 *      var debouncedFunction = window.portal.debounce(function() {
 *	        // something time consuming
 *      }, 250);
 *      window.addEventListener('resize', debouncedFunction);
 *
 * @param func the function to be 'debounced'
 * @param wait the time to wait for "non-execution" before actually calling the function
 * @param immediate call on the 'start' rather than the 'end' of the wait cycle.
 * @return {Function}
 */
window.portal.debounce = function debounce(func, wait, immediate) {
	let timeout = null;
	return function() {
		let context = this, args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow){
		    func.apply(context, args);
        }
	};
};

(function(ns, jQuery, sweetalerts){
    "use strict";
    // ============================================================================================
    // window.portal.Alerts
    // Utility functions for producing alerts - uses SweetAlerts
    // Ref: https://sweetalert2.github.io/
    // ============================================================================================
    /**
     * A simple success message dialog
     *
     * @param title the title of the dialog
     * @param text the text of the dialog
     * @param opts other options as available to SweetAlert dialogs, if required
     */
    ns.successMessage = function (title, text, opts) {
        let defaultOptions = {
            type: 'success',
        };
        let options = jQuery.extend({}, defaultOptions, opts);
        ns._basicMessage(title, text, options);
    };
    /**
     * A simple warning message dialog
     *
     * @param title the title of the dialog
     * @param text the text of the dialog
     * @param opts other options as available to SweetAlert dialogs, if required
     */
    ns.warningMessage = function (title, text, opts) {
        let defaultOptions = {
            type: 'warning',
        };
        let options = jQuery.extend({}, defaultOptions, opts);
        ns._basicMessage(title, text, options);
    };
    /**
     * A simple error message dialog
     *
     * @param title the title of the dialog
     * @param text the text of the dialog
     * @param opts other options as available to SweetAlert dialogs, if required
     */
    ns.errorMessage = function (title, text, opts) {
        let defaultOptions = {
            type: 'error',
        };
        let options = jQuery.extend({}, defaultOptions, opts);
        ns._basicMessage(title, text, options);
    };
    /**
     * A simple message dialog
     *
     * @param title the title of the dialog
     * @param text the text of the dialog
     * @param opts other options as available to SweetAlert dialogs, if required
     */
    ns._basicMessage = function (title, text, opts) {
        let defaultOptions = {
            title: title,
            html: text,
            confirmButtonText: 'OK',
        };
        let options = jQuery.extend({}, defaultOptions, opts);
        sweetalerts(options);
    };
    /**
     * Utility functions for producing alerts - uses SweetAlerts (swal(...))
     *
     * An alert message dialog with a confirmation
     * @param title the title of the dialog
     * @param text the text of the dialog
     */
    ns.alertWithConfirm = function (title, text) {
        if(sweetalerts){
            sweetalerts({
                title: title,
                text: text,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel'
            }).then(function () {
                // confirmed
                sweetalerts(
                    'Confirmed',
                    'The action was confirmed',
                    'success'
                );
            }, function (dismiss) {
                // cancelled
                // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                if (dismiss === 'cancel') {
                    sweetalerts(
                        'Cancelled',
                        'The action was cancelled',
                        'error'
                    );
                }
            });
        }
    };
    /**
     * Determine if a (SweetAlert) dialog is currently visible
     *
     * NOTE: this just wraps swal.isVisible()
     *
     * @return {boolean} true if a (SweetAlert) dialog is currently visible, false otherwise
     */
    ns.isAlertVisible = function(){
        return swal.isVisible();
    };
    /**
     * Close any visible (SweetAlert) dialog
     *
     * NOTE: this just wraps swal.close()
     */
    ns.closeAlert = function(){
        return swal.close();
    };
    /**
     * Display a "working" spinner on any visible (SweetAlert) dialog
     *
     * NOTE: this just wraps swal.showLoading()
     * NOTE: this will also hide any confirmation button, and disable any cancellation button
     */
    ns.showSpinner = function(){
        return swal.showLoading();
    };
}(window.portal.Alerts, jQuery, swal));

(function(ns, toastr, jQuery){
    "use strict";
    // ============================================================================================
    // window.portal.Toast
    // ============================================================================================
    /**
     * Utility functions for producing 'toast' notifications - generally speaking all toast
     * notifications are done using the same basic set of parameters, so this simplifies the
     * code in 99% of cases. Uses 'toastr' - https://codeseven.github.io/toastr/
     */
    ns.defaultOptions = {
        positionClass: 'toast-bottom-left',
        timeOut:10000,
        progressBar:true,
        showDuration:200, hideDuration:200
    };
    ns.info = function(title, text, opts) {
        ns._toast(toastr.info, title, text, opts);
    };
    ns.success = function(title, text, opts) {
        ns._toast(toastr.success, title, text, opts);
    };
    ns.warning = function(title, text, opts) {
        ns._toast(toastr.warning, title, text, opts);
    };
    ns.error = function(title, text, opts) {
        ns._toast(toastr.error, title, text, opts);
    };
    ns.toast = function(level, title, text, opts){
        let lookup = {
            'info':toastr.info,
            'success':toastr.success,
            'warning':toastr.warning,
            'error':toastr.error
        };
        let toastFunc = lookup[level] || toastr.info;
        ns._toast(toastFunc, title, text, opts);
    };
    ns._toast = function(toastFunc, title, text, opts)
    {
        toastr.options = jQuery.extend({}, ns.defaultOptions, opts);
        toastFunc(text, title);
    };
}(window.portal.Toast, toastr, jQuery));

(function(ns){
    "use strict";
    // ============================================================================================
    // window.portal.TextUtils
    // ============================================================================================
    /**
     * Utility method to join a list of words with an 'and' - for example:
     *      andJoin(['a']) = 'a'
     *      andJoin(['a', 'b']) = 'a and b'
     *      andJoin(['a', 'b', 'c']) = 'a, b and c'
     *      andJoin(['a', 'b', 'c', 'd']) = 'a, b, c and d'
     * @param parts an array of text items to join
     * @returns {*} the result of the 'and' joining
     */
    ns.andJoin = function(parts) {
        return ns._andOrJoin(parts, ' and ');
    };
    /**
     * Utility method to join a list of words with an 'or' - for example:
     *      orJoin(['a']) = 'a'
     *      orJoin(['a', 'b']) = 'a or b'
     *      orJoin(['a', 'b', 'c']) = 'a, b or c'
     *      orJoin(['a', 'b', 'c', 'd']) = 'a, b, c or d'
     * @param parts an array of text items to join
     * @returns {*} the result of the 'or' joining
     */
    ns.orJoin = function(parts) {
        return ns._andOrJoin(parts, ' or ');
    };
    /**
     * Utility function to facilitate use of template strings for formatting.
     * Example usage:
     *      let formatter1 = makeStringFormatter`${0}${1}${0}!`;
     *      formatter1('Y', 'A');  // "YAY!"
     *
     *      let formatter2 = makeStringFormatter`${0} ${'foo'}!`;
     *      formatter2('Hello', {foo: 'World'});  // "Hello World!"
     *
     * @param strings
     * @param keys
     * @returns {Function}
     */
    ns.makeStringFormatter = function (strings, ...keys) {
        return (function(...values) {
            let dict = values[values.length - 1] || {};
            let result = [strings[0]];
            keys.forEach(function(key, i) {
                let value = Number.isInteger(key) ? values[key] : dict[key];
                result.push(value, strings[i + 1]);
            });
            return result.join('');
        });
    };
    /**
     * Private function to support the andJoin and orJoin functions
     * @param parts an array of text items to join
     * @param joiner the 'joiner' (either ' and ' or ' or ')
     * @returns {*} the result of the joining
     * @private
     */
    ns._andOrJoin = function(parts, joiner) {
        if(!Array.isArray(parts)){
            return '';
        }

        // remove any empty strings or nulls
        parts = parts.filter(function(q){return q !== null && q !== undefined && q !== '';});

        if(parts.length === 0){
            return '';
        } else if (parts.length === 1){
            return parts[0];
        } else {
            return [parts.slice(0,parts.length-1).join(', '),
                parts.slice(parts.length-1, parts.length)]
                .join(joiner);
        }
    };
}(window.portal.TextUtils));


(function(ns){
    "use strict";
    // ============================================================================================
    // window.portal.DateTimeUtils
    // ============================================================================================
    ns.MINUTE_SECONDS = 60;
    ns.HOUR_SECONDS = ns.MINUTE_SECONDS * 60;
    ns.DAY_SECONDS = ns.HOUR_SECONDS * 24;
    ns.WEEK_SECONDS = ns.DAY_SECONDS * 7;
    ns.YEAR_SECONDS = ns.DAY_SECONDS * 365;
    /**
     * Attempts to provide a 'humanized' duration which doesn't give overly precise details for long
     * durations (such '1 year and 5 seconds', in which case we don't really care about the seconds)
     * and more precise details for shorter durations.
     *
     * @param milliseconds: the duration in milliseconds
     * @param opts options - the following are accepted:
     *            forceFull if true, all details will be provided, regardless of the length of the
     *                      duration
     *            year/month/week/day/hour/minute/second
     * @return {*}
     */
    ns.humanizedDuration = function(milliseconds, opts={}) {
        let defaultOptions = {
            forceFull:false,
            year:{singular:'year', plural:'years'},
            month:{singular:'month', plural:'months'},
            week:{singular:'week', plural:'weeks'},
            day:{singular:'day', plural:'days'},
            hour:{singular:'hour', plural:'hours'},
            minute:{singular:'minute', plural:'minutes'},
            second:{singular:'second', plural:'seconds'}
        };
        let options = $.extend({}, defaultOptions, opts);

        let seconds = Math.floor(milliseconds / 1000.0);
        milliseconds = milliseconds - (seconds * 1000);

        let steps = [{key:'Y', unit:options.year, block:ns.YEAR_SECONDS},
                     {key:'W', unit:options.week, block:ns.WEEK_SECONDS},
                     {key:'D', unit:options.day, block:ns.DAY_SECONDS},
                     {key:'H', unit:options.hour, block:ns.HOUR_SECONDS},
                     {key:'M', unit:options.minute, block:ns.MINUTE_SECONDS}];
        let parts = {};
        for(let idx=0; idx<steps.length; idx++){
            let step = steps[idx];
            let key = step.key;
            let unit = step.unit;
            let block = step.block;
            let value = Math.floor(seconds / block);
            seconds -= value * block;
            parts[key] = (value === 0 ? '' : value + ' ' + (value === 1 ? unit.singular : unit.plural));
        }

        let unit = options.second;
        seconds = Math.floor(seconds);
        if(seconds > 0){
            seconds = seconds + ' ' + (seconds === 1 ? unit.singular : unit.plural);
        } else if (parts.Y==='' && parts.W==='' && parts.D==='' && parts.H==='' && parts.M===''){
            // years, months, days, hours and minutes are all 0
            seconds = '0'+(milliseconds>0?('.'+milliseconds):'')+' ' + unit.plural;
        } else {
            // at least one of years, months, days, hours and minutes is greater than 0
            seconds = '';
        }
        parts.S = seconds;

        if(options.forceFull){
            return portal.TextUtils.andJoin([parts.Y, parts.W, parts.D, parts.H, parts.M, parts.S]);
        } else if(parts.Y !== ''){
            // more than 0 years
            return portal.TextUtils.andJoin([parts.Y, parts.W, parts.D]);
        } else if(parts.W !=='' || parts.D !== ''){
            // more than 0 weeks or more than 0 days
            return portal.TextUtils.andJoin([parts.W, parts.D, parts.H, parts.M]);
        }
        return portal.TextUtils.andJoin([parts.H, parts.M, parts.S]);
    };
    /**
     *  Attempts to provide a humanized start-end string, taking into account the fact that if the
     * start and end are both on the same day, we don't need to explicitly mention the date twice.
     * For example, rather than...
     *
     *    12:00PM 12 Oct 2016 - 1:00PM 12 Oct 2016
     *
     * ...we would normally write simply...
     *
     *    12:00PM - 1:00PM, 12 Oct 2016
     *
     * @param start the start of the period as a UNIX time in milliseconds (may be null)
     * @param end the end of the period as a UNIX time in milliseconds (may be null)
     * @param timeFormat optionally specify the time format
     * @param dateFormat optionally specify the date format
     * @return {string} a humanized start-end string
     */
    ns.humanizedStartToEnd = function(start=null, end=null,
                                      timeFormat='HH:mm:ss', dateFormat='YYYY/MM/DD') {
        let hasStart = (start !== null && start !== undefined);
        let hasEnd = (end !== null && start !== undefined);
        if (!(hasStart || hasEnd)) {
            // start and end are both null or undefined - exit now
            return '';
        }

        let startTime = '';
        let startDate = '';
        if (hasStart) {
            start = moment(start);
            startTime = start.format(timeFormat);
            startDate = start.format(dateFormat);
        }

        let endTime = '';
        let endDate = '';
        if (hasEnd) {
            end = moment(end);
            endTime = end.format(timeFormat);
            endDate = end.format(dateFormat);
        }

        let isSameYear = hasStart && hasEnd && (start.year() === end.year());
        let isSameMonth = isSameYear && (start.month() === end.month());
        let isSameDay = isSameMonth && (start.day() === end.day());

        let isStartOfDay = hasStart && start.hour() === 0 && start.minute() === 0;
        let isEndOfDay = hasEnd && end.hour() === 23 && end.minute() === 59;

        let isAllDay = isSameDay && isStartOfDay && isEndOfDay;

        if (hasStart && hasEnd) {
            if (isAllDay) {
                return startDate;
            } else if (isSameDay) {
                return startTime + ' - ' + endTime + ', ' + startDate;
            } else if (isStartOfDay) {
                if (isEndOfDay) {
                    return startDate + ' - ' + endDate;
                }
                return 'From the start of ' + startDate + ' to ' + endTime + ' ' + endDate;
            } else if (isEndOfDay) {
                return 'From ' + startTime + ' ' + startDate + ' to the end of ' + endDate;
            }
            return startTime + ' ' + startDate + ' - ' + endTime + ' ' + endDate;
        } else if (hasStart) {
            if (isStartOfDay) {
                return 'Since the start of ' + startDate;
            }
            return 'Since ' + startTime + ' ' + startDate;
        } else if (hasEnd) {
            if (isEndOfDay) {
                return 'Until the end of ' + endDate;
            }
            return 'Until ' + endTime + ' ' + endDate;
        }
        return '';
    };
}(window.portal.DateTimeUtils));


(function(ns, jQuery, NProgress){
    "use strict";
    // ============================================================================================
    // window.portal.DownloadUtils
    // ============================================================================================
    /**
     * Utility function to make it simple to get a file download via an AJAX call. Relies on the AJAX file download
     * jQuery plugin to do this - see https://github.com/johnculviner/jquery.fileDownload
     *
     * @param url the URL forthe download
     */
    ns.basicAjaxFileDownload = function(url) {
        if (jQuery.fileDownload) {
            if (NProgress) {
                NProgress.start();
            }
            jQuery.fileDownload(url, {
                successCallback: function () {
                    if (NProgress) {
                        NProgress.done();
                    }
                },
                failCallback: function () {
                    if (NProgress) {
                        NProgress.done();
                    }
                }
            });
        }
        else {
            alert('AJAX file download not available');
        }
    };
}(window.portal.DownloadUtils, jQuery, NProgress));

(function(ns, portalAlerts, jQuery){
    "use strict";
    // ============================================================================================
    // window.portal.StatusUtils
    // Utility functions for checking status
    // ============================================================================================
    /**
     * A simple class which allows repeated 'pinging' of a URL endpoint to establish that the URL
     * is still accessible
     *
     * @type {Sonar}
     */
    ns.Sonar = class {
        /**
         * Constructor
         *
         * @param pingURL the ping endpoint as a URL
         * @param opts options
         */
        constructor(pingURL, opts){
            this.pingURL = pingURL;

            let defaultOptions = {
                // the interval between successive pings, in milliseconds
                interval: 5000,
                // the timeout for a response to a ping, in milliseconds - if the ping takes
                // longer than this to receive a response, the ping is deemed to have failed.
                timeout: 5000,
                // if true, automated pinging begins immediately on instantiation, otherwise a
                // call to the start() method will be required after instantiation to begin the
                // automated pinging
                autoStart:true,
                // callback functions in the case of a success, error or completion (completion is
                // called regardless of whether the ping results in a success or error)
                success:null,
                error:null,
                complete:null
            };
            this.options = jQuery.extend({}, defaultOptions, opts);

            // timer for scheduling repeated pings
            this._pingTimer = null;
            // boolean indicating whether automated repeated pinging is active
            this._isActive = false;

            if(this.options.autoStart === true){
                // if we are configured for immediate start of pinging, begin now
                this.start();
            }
        }
        /**
         * Start pinging
         */
        start(){
            if(!this._isActive){
                this._isActive = true;
                this._schedulePing(true);
            }
        }
        /**
         * Stop pinging
         */
        stop(){
            this._clearTimer();
            this._isActive = false;
        }
        /**
         * Obtain the currently configured pinging interval.
         *
         * @return the configured ping interval in milliseconds.
         */
        getInterval(){
            return this.options.interval;
        }
        /**
         * Change the configured pinging interval. If pinging is active at the time of this method
         * call, the pinging will resume at the newly configured interval.
         *
         * @param interval the ping interval in milliseconds.
         */
        setInterval(interval){
            if(interval !== this.options.interval){
                let wasActive = this.isActive();
                if(wasActive) {
                    this.stop();
                }

                this.options.interval = interval;

                if(wasActive){
                    this.start();
                }
            }
        }
        /**
         * Perform a single 'ping'
         */
        ping(){
            jQuery.ajax({
                url:this.pingURL,
                method:'GET',
                dataType:'json',
                timeout:this.options.timeout,
                success:this._success.bind(this),
                error:this._error.bind(this),
                complete:this._complete.bind(this)
            });
        }
        /**
         * Determine if pinging is active (i.e., pings are being automatically sent at the
         * configured interval
         *
         * @return {boolean} true if pinging is active, false otherwise
         */
        isActive(){
            return this._isActive;
        }
        /**
         * A utility method to clear any scheduled pings
         *
         * @private
         */
        _clearTimer(){
            if(this._pingTimer !== null){
                clearTimeout(this._pingTimer);
                this._pingTimer = null;
            }
        }
        /**
         * A utility method to schedule a ping for the configured interval
         *
         * @param immediate if true, the ping will be sent immediately, otherwise the ping will be
         * sent after he configured interval
         * @private
         */
        _schedulePing(immediate=false){
            this._clearTimer();
            if(immediate){
                this.ping();
            } else {
                this._pingTimer = setTimeout(this.ping.bind(this), this.options.interval);
            }
        }
        /**
         * A utility function which is called on a successful ping
         *
         * @param data the ping response data
         * @param textStatus the ping response status text
         * @param jqXHR the ping response's jQuery XMLHttpRequest content - please refer to the
         * documentation at {@link https://api.jquery.com/jQuery.ajax/} for more details
         * @private
         */
        _success(data, textStatus, jqXHR){
            if(jQuery.isFunction(this.options.success)){
                this.options.success.call(this, data, textStatus, jqXHR);
            }
        }
        /**
         * A utility function which is called on a ping error
         *
         * @param jqXHR the ping response's jQuery XMLHttpRequest content - please refer to the
         * documentation at {@link https://api.jquery.com/jQuery.ajax/} for more details
         * @param textStatus the ping response status text
         * @param errorThrown the textual portion of the HTTP status, such as "Not Found" or
         * "Internal Server Error".
         * @private
         */
        _error(jqXHR, textStatus, errorThrown){
            if(jQuery.isFunction(this.options.error)){
                this.options.error.call(this, jqXHR, textStatus, errorThrown);
            }
        }
        /**
         * A utility function which is called on a ping completion, regardless of success or error
         * status
         *
         * @param jqXHR the ping response's jQuery XMLHttpRequest content - please refer to the
         * documentation at {@link https://api.jquery.com/jQuery.ajax/} for more details
         * @param textStatus the ping response status text
         * @private
         */
        _complete(jqXHR, textStatus){
            if(jQuery.isFunction(this.options.complete)){
                this.options.complete.call(this, jqXHR, textStatus);
            }
            if(this._isActive){
                this._schedulePing();
            }
        }
    };

    /**
     * A class to perform connectivity monitoring.
     *
     * Basically it uses an instance of the the {@link ns.Sonar} class to periodically 'ping' an
     * endpoint. In the case that the ping fails, it shows a non-dismissable modal dialog which
     * blocks further interaction on the page until such time as connectivity is restored.
     *
     * During periods of detected non-connectivity, the ping rate is increased (by default to once
     * per second), while during times of normal connectivity the ping rate is decreased (by default
     * to once every 5 seconds).
     *
     * @type {ConnectivityMonitor}
     */
    ns.ConnectivityMonitor = class{
        /**
         * Constructor
         *
         * @param pingURL the ping endpoint as a URL
         * @param opts options
         */
        constructor(pingUrl, opts){
            this.connectionStatus = true;

            let defaultOptions = {
                // the ping rate while the last ping succeeded
                successInterval: 5000,
                // the ping rate while the last ping failed
                errorInterval: 1000,
                // how long to display the "Connectivity Restored" message before auto-dismissing
                restoredMessageTimeout: 3000,
                // the function to call on a successful ping (should be no need to modify this)
                success:this._success.bind(this),
                // the function to call on a failed ping (should be no need to modify this)
                error:this._error.bind(this),
            };
            this.options = jQuery.extend({}, defaultOptions, opts);
            let sonarOptions = jQuery.extend({}, this.options, {
                interval:this.options.successInterval
            });

            this.lastPing = new Date().getTime();
            this.sonar = new ns.Sonar(pingUrl, sonarOptions);
        }
        /**
         * Start the connectivity monitor
         */
        start(){
            this.sonar.start();
        }
        /**
         * Stop the connectivity monitor
         */
        stop(){
            this.sonar.stop();
            if(portalAlerts.isAlertVisible()) {
                portalAlerts.closeAlert();
            }
        }
        /**
         * Internal callback function for successful 'pings' by the {@link ns.Sonar} instance
         *
         * @param data the ping response data (ignored)
         * @param status the ping response status text (ignored)
         * @param jqXHR the ping response jQuery XHR instance (ignored)
         * @private
         */
        _success(data, status, jqXHR){
            // Remove the navigation prompt
            $(window).off('beforeunload', ns.ConnectivityMonitor._confirmNavAway);
            // update the ;ast successful ping time so that we can time diconnection periods
            this.lastPing = new Date().getTime();

            if(this.connectionStatus !== true){
                // we've just reconnected after a period of non-connectivity, so update
                // the connection status
                this.connectionStatus = true;
                // reset the ping rate the to the less prequent 'connected' rate
                this.sonar.setInterval(this.options.successInterval);
                // do we have an alert visible?
                if(portalAlerts.isAlertVisible()) {
                    // because of the code flow this must be a dialog saying we are currently not
                    // connected, so close that now
                    portalAlerts.closeAlert();
                }
                // show an auto-dismissing message letting the user know that connectivity is
                // restored - the user can also dismiss the dialog with the escape or enter keys,
                // or by clicking outside the dialog
                portalAlerts.successMessage(
                    'Connectivity Restored',
                    'Server is available again.',
                    {
                        // auto dismiss the dialog
                        timer: this.options.restoredMessageTimeout,
                        // show the spinner
                        onOpen:function(){portalAlerts.showSpinner();}
                    }
                );
            }
        }
        /**
         * Internal callback function for failed 'pings' by the {@link ns.Sonar} instance
         *
         * @param jqXHR the ping response jQuery XHR instance (ignored)
         * @param status the ping response status text (ignored)
         * @param error the ping response error text (ignored)
         * @private
         */
        _error(jqXHR, status, error){
            // Enable navigation prompt, which prevents the user from navigating away from the page
            // without responding to a confirmation prompt
            $(window).on('beforeunload', ns.ConnectivityMonitor._confirmNavAway);

            if (this.connectionStatus === false && portalAlerts.isAlertVisible()){
                // we already know we are disconnected and have a dialog showing - just
                // update the text for the amount of time we have been disconnected
                let now = new Date().getTime();
                let durationText = portal.DateTimeUtils.humanizedDuration(now - this.lastPing);
                $('#connectivity-lost-duration').text(durationText);
            } else if(this.connectionStatus === true || !swal.isVisible()) {
                // we either didn't know we were disconnected or don't have a dialog showing to let
                // the user know we are disconnected
                // update the connection status
                this.connectionStatus = false;
                // close any visible dialog - because of the code flow if a dialog is showing at
                // this point it must be one saying that connectivity was restored, so we need to
                // get rid of it now
                if(portalAlerts.isAlertVisible()) {
                    portalAlerts.closeAlert();
                }
                // create the (non-dismissable) dialog and message text
                let now = new Date().getTime();
                let durationText = portal.DateTimeUtils.humanizedDuration(now - this.lastPing);
                portalAlerts.warningMessage(
                    'Connectivity Lost',
                    '<p>Server was last available about<br><span id="connectivity-lost-duration">' +
                        durationText + '</span> ago.</p>'+
                        '<p>No action is required, however you cannot<br>use the system '+
                        'until connectivity is restored.</p>'+
                        '<p>You may wish to contact your Systems Administrator if '+
                        'this problem persists.</p>',
                    {
                        // make the dialog non-dismissable by conventional means - while the
                        // connection is down, the user can't do anything anyway.
                        showConfirmButton:false,
                        showCancelButton:false,
                        allowOutsideClick:false,
                        allowEscapeKey:false,
                        allowEnterKey:false
                    }
                );
                // increase the ping rate during times of non-connectivity
                this.sonar.setInterval(this.options.errorInterval);
            }
        }

        /**
         * A utility function to prevent navigating away from the page during times of
         * non-connectivity. This function registered with to the window.onbeforeunload event
         * handler during times of detected non-connectivity.
         *
         * @return {boolean} always true, preventing navigation away from the page unless the user
         * responds in the affirmative to a (browser controlled) confirmation dialog
         * @private
         */
        static _confirmNavAway(){
            // Modern browsers now consider displaying a custom message to be a security hazard and
            // it has therefore been removed from all of them. Refer to...
            //     https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#Browser_compatibility
            // ...for full details. Browsers now only display generic messages. Since we no longer
            // have to worry about setting the message, it is as simple as:
            return true;
        }
    };
}(window.portal.StatusUtils, window.portal.Alerts, jQuery));

(function(ns, jQuery) {
    "use strict";
    // ============================================================================================
    // window.portal.UploadUtils
    // ============================================================================================
    /**
     * Ensure that the File.slice(...) method is able to be called in the same way regardless of
     * the browser being used.
     *
     * This is used by the UploadUtils utilities below.
     */
    if (!File.prototype.slice) {
        // no method called 'slice' on File - check for existence of 'mozSlice' or 'webkitSlice'...
        let newSlice = File.prototype.mozSlice || File.prototype.webkitSlice;
        if (newSlice) {
            // found one - monkey patch File so that it has a slice() method which wraps whichever of
            // the 'mozSlice' or 'webkitSlice' methods was found.
            File.prototype.slice = (function () {
                return function (startingByte, length) {
                    return newSlice.call(this, startingByte, length + startingByte);
                };
            })();
        }
        else {
            // no File.slice() method or its equivalents available! UploadUtils utilities checks for
            // this and provides fallback functionality - the alternative would be to throw an
            // exception like...
            // throw "File.slice() not supported."
            // ...which is not very friendly if you have an older browser.
        }
    }
    /**
     * "Magic number" definitions to allow client side identification/verification of various file
     * types by signature bytes present within the files. Server side verification is also
     * recommended if the file is to be uploaded.
     *
     * This is a more accurate way of checking than asking for the file type like this:
     *
     *     let file = $("#fileInput).get(0).files[0];
     *     let fileType = file.type;
     *
     * ...because the value returned by file.type is determined by the file extension and so can
     * therefore be easily 'fooled' by simply renaming the file.
     *
     * These values were obtained from various sources, including, but not limited to:
     *
     *      https://linux.die.net/man/5/magic
     *      https://billatnapier.wordpress.com/2013/04/22/magic-numbers-in-files/
     *      https://en.wikipedia.org/wiki/Magic_number_(programming)
     *
     * Obviously more could be added as required, but these definitions are adequate for the
     * purposes of this implementation.
     */
    ns.MAGIC_NUMBERS = {
        // MIME TYPE              MAGIC BYTE MATCHING DEFINITIONS
        'image/jpeg': [{'offset': 0, 'bytes': [0xFF, 0xD8]}],
        'image/png':  [{'offset': 0, 'bytes': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]}],
        'image/gif':  [{'offset': 0, 'bytes': [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]}, // GIF89a
                      {'offset': 0, 'bytes': [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]}], // GIF87a
        'image/bmp':  [{'offset': 0, 'bytes': [0x42, 0x4D]}],
        'image/tiff': [{'offset': 0, 'bytes': [0x49, 0x49]}],
        'image/ico':  [{'offset': 0, 'bytes': [0x00, 0x00, 0x01, 0x00]}],
        'video/avi':  [{'offset': 0, 'bytes': [0x52, 0x49, 0x46, 0x46]}],
        'video/mp4':  [{'offset': 0, 'bytes': [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32]}],
        'video/quicktime': [{'offset': 4, 'bytes': [0x66, 0x74, 0x79, 0x70, 0x71, 0x74]},  // ftypqt
                            {'offset': 4, 'bytes': [0x6D, 0x6F, 0x6F, 0x76]},              // moov
                            {'offset': 4, 'bytes': [0x6d, 0x64, 0x61, 0x74]},              // mdat
                            {'offset': 12, 'bytes': [0x6d, 0x64, 0x61, 0x74]}],            // mdat
        'video/flv': [{'offset': 0, 'bytes': [0x46, 0x4C, 0x56]}],
        'video/swf': [{'offset': 0, 'bytes': [0x46, 0x57, 0x53]}],
        'video/wmv': [{'offset': 0, 'bytes': [0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF]}],
        'application/zip': [{'offset': 0, 'bytes': [0x50, 0x4B]}],
        'application/gz':  [{'offset': 0, 'bytes': [0x1F, 0x8B, 0x08]}],
        'application/7z':  [{'offset': 0, 'bytes': [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C]}],
        'application/tar': [{'offset': 0, 'bytes': [0x75, 0x73, 0x74, 0x61, 0x72]}],
        'application/postscript': [{'offset': 0, 'bytes': [0x25, 0x21]}, // postscript (.ps)
                                   {'offset': 0, 'bytes': [0x25, 0x21, 0x50, 0x53, 0x2D, 0x41, 0x64, 0x6F, 0x62, 0x65, 0x2D, 0x33, 0x2E, 0x30, 0x20, 0x45, 0x50, 0x53, 0x46, 0x2D, 0x33, 0x20, 0x30]}], // extended postscript (.eps)
        'application/rtf': [{'offset': 0, 'bytes': [0x7B, 0x5C, 0x72, 0x74, 0x66, 0x31]}],
        'application/pdf': [{'offset': 0, 'bytes': [0x25, 0x50, 0x44, 0x46]}],
        'application/msoffice': [{'offset': 0, 'bytes': [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]}, // .doc, .xls, .ppt, etc...
                                 {'offset': 0, 'bytes': [0x50, 0x4B, 0x03, 0x04]}]                         // .docx, .xlsx, .pptx, etc...
    };
    /**
     * Utility function to determine if a file is an image file based on "magic number"
     * detection
     *
     * Example usage:
     *
     *    let file = $("#fileInput).get(0).files[0];
     *    UploadUtils.isImage(file, function(isImage){
     *        console.log('The file is' + (isImage?'':' not') + ' an image file.');
     *    });
     *
     * @param file the file to be checked (as obtained from an <input type="file" /> field
     * @param isImageCallback a function to call back with a single boolean parameter which is
     *        true if the file is an image and false otherwise.
     */
    ns.isImage = function (file, isImageCallback) {
        ns.isMimeType(file, ['image/jpeg', 'image/png', 'image/gif',
            'image/bmp', 'image/tiff', 'image/ico'], isImageCallback);
    };
    /**
     * Utility function to determine if a file is a video file based on "magic number" detection
     *
     * Example usage:
     *
     *    let file = $("#fileInput).get(0).files[0];
     *    UploadUtils.isVideo(file, function(isVideo){
     *        console.log('The file is' + (isVideo?'':' not') + ' a video file.');
     *    });
     *
     * @param file the file to be checked (as obtained from an <input type="file" /> field
     * @param isVideoCallback a function to call back with a single boolean parameter which is
     *        true if the file is a video and false otherwise.
     */
    ns.isVideo = function (file, isVideoCallback) {
        ns.isMimeType(file, ['video/avi', 'video/mp4', 'video/quicktime',
            'video/flv', 'video/swf', 'video/wmv'], isVideoCallback);
    };
    /**
     * Utility function to determine if a file is a document file based on "magic number" detection
     *
     * Example usage:
     *
     *    let file = $("#fileInput).get(0).files[0];
     *    UploadUtils.isDocument(file, function(isDocument){
     *        console.log('The file is' + (isDocument?'':' not') + ' a document file.');
     *    });
     *
     * @param file the file to be checked (as obtained from an <input type="file" /> field
     * @param isDocumentCallback a function to call back with a single boolean parameter which is
     *        true if the file is a document and false otherwise.
     */
    ns.isDocument = function (file, isDocumentCallback) {
        ns.isMimeType(file, ['application/postcript', 'application/pdf',
            'application/msoffice'], isDocumentCallback);
    };
    /**
     * Utility function to determine if a file is a particular MIME type based on "magic number"
     * detection
     *
     * Example usage:
     *
     *    let file = $("#fileInput).get(0).files[0];
     *    UploadUtils.isMimeType(file, ['application/zip','application/7z'], function(isMimeType){
     *        console.log('The file is' + (isMimeType?'':' not') + of an acceptable MIME type');
     *    });
     *
     * @param file the file to be checked (as obtained from an <input type="file" /> field
     * @param mimeTypes may be a string or an array of strings of acceptable MIME types
     * @param fileTypeCallback a function to call back with a single boolean parameter which is true if the file is
     *        one of the specified MIME types and false otherwise.
     */
    ns.isMimeType = function (file, mimeTypes, fileTypeCallback) {
        // if there is no callback function there is no point doing anything!
        if (!jQuery.isFunction(fileTypeCallback)) {
            return;
        }
        // if there are no mimeTypes specified then the result is false
        if (mimeTypes === null) {
            fileTypeCallback.call(false, false);
        }
        if (typeof(mimeTypes) === 'string') {
            mimeTypes = mimeTypes.split(',');
        }
        // older browser fail-over -------------------------------------------------------
        // sanity check for very old browsers with no File.slice() functionality available
        if (!File.prototype.slice) {
            // no method called 'slice' on File - note the check earlier in this file which
            // also checks for existence of 'mozSlice' or 'webkitSlice' and monkey patches
            // if possible - if we've got here and there is still no slice() method on File
            // there is no hope - we can't use magic numbers and have to fall back on an
            // older technique which can be tricked simply by changing the file extension on
            // the file
            let mimeType = 'application/octet-stream';
            if (file.type) {
                mimeType = file.type;
            }
            // simple text match on mime type
            for (let i = 0; i < mimeTypes.length; i++) {
                if (mimeTypes[i] === mimeType) {
                    // match
                    fileTypeCallback.call(true, true);
                    // early bail-out!
                    return;
                }
            }
            // no match
            fileTypeCallback.call(false, false);
            // early bail-out!
            return;
        } // older browser fail-over -----------------------------------------------------

        let allowedMagicByteDefinitions = [];
        if (Array.isArray(mimeTypes)) {
            for (let idx = 0; idx < mimeTypes.length; idx++) {
                let currentMimeType = mimeTypes[idx];
                let magicByteDefinitions = ns.MAGIC_NUMBERS[currentMimeType.trim()];
                if (magicByteDefinitions)
                    allowedMagicByteDefinitions.push(magicByteDefinitions);
            }
        }
        // if there are no mimeTypes specified then the result is false
        if (allowedMagicByteDefinitions.length === 0) {
            fileTypeCallback.call(false, false);
        }

        // set up the FileReader and the onload event handler
        let reader = new FileReader();
        reader.onload = function () {
            // put the bytes read from the file into a uint8 array
            let fileHeaderBytes = new Uint8Array(reader.result);
            // compare the initial bytes of the file to known "magic numbers"
            for (let i = 0; i < allowedMagicByteDefinitions.length; i++) {
                let magicByteDefinitions = allowedMagicByteDefinitions[i];
                for (let j = 0; j < magicByteDefinitions.length; j++) {
                    if (ns._checkBytesMatch(fileHeaderBytes, magicByteDefinitions[j])) {
                        fileTypeCallback.call(true, true);
                        return;
                    }
                }
            }
            fileTypeCallback.call(false, false);
        };
        // read the first 32 bytes of the file, reader.onload() handler defined above will be triggered
        let blob = file.slice(0, 32);
        reader.readAsArrayBuffer(blob);
    };
    /**
     * Utility function to determine the MIME type of the given file based on "magic number" detection
     *
     * Example usage:
     *
     *    let file = $("#fileInput).get(0).files[0];
     *    UploadUtils.getMimeType(file, function(mimeType){
     *        console.log('The MIME type of the file is' + mimeType);
     *    });
     *
     * @param file the file to be checked (as obtained from an <input type="file" /> field
     * @param fileTypeCallback a function to call back with a single parameter indicating whether
     *        the file is one of the specified MIME types or not.
     */
    ns.getMimeType = function (file, fileTypeCallback) {
        // if there is no callback function there is no point doing anything!
        if (!jQuery.isFunction(fileTypeCallback)) {
            return;
        }

        // older browser fail-over -------------------------------------------------------
        // sanity check for very old browsers with no File.slice() functionality available
        if (!File.prototype.slice) {
            // no method called 'slice' on File - note the check earlier in this file which
            // also checks for existence of 'mozSlice' or 'webkitSlice' and monkey patches
            // if possible - if we've got here and there is still no slice() method on File
            // there is no hope - we can't use magic numbers and have to fall back on an
            // older technique which can be tricked simply by changing the file extension on
            // the file
            let mimeType = 'application/octet-stream';
            if (file.type) {
                mimeType = file.type;
            }

            fileTypeCallback.call(mimeType, mimeType);
            // early bail-out!
            return;
        } // older browser fail-over -----------------------------------------------------

        // set up the FileReader and the onload event handler
        let reader = new FileReader();
        reader.onload = function () {
            // put the read bytes from the file into a uint8 array
            let fileHeaderBytes = new Uint8Array(reader.result);
            // compare the initial bytes of the file to known "magic numbers"
            for (let mimeType in ns.MAGIC_NUMBERS) {
                if (!ns.MAGIC_NUMBERS.hasOwnProperty(mimeType)) {
                    continue;
                }

                let magicByteDefinitions = ns.MAGIC_NUMBERS[mimeType];
                for (let i = 0; i < magicByteDefinitions.length; i++) {
                    if (ns._checkBytesMatch(fileHeaderBytes, magicByteDefinitions[i])) {
                        fileTypeCallback.call(mimeType, mimeType);
                        return;
                    }
                }
            }
            fileTypeCallback.call(null, null);
        };
        // read the first 32 bytes of the file, reader.onload() handler defined above will be triggered
        let blob = file.slice(0, 32);
        reader.readAsArrayBuffer(blob);
    };
    /**
     * Internal utility function to determine whether the given bytes match the provided definition
     *
     * @param fileHeaderBytes the bytes from the file to be checked against the "magic bytes"
     *        definition
     * @param magicByteDefinition the "magic bytes" definition
     * @returns {boolean} true if the bytes from the file match the definition, false otherwise
     */
    ns._checkBytesMatch = function (fileHeaderBytes, magicByteDefinition) {
        // what bytes are we checking for, and how far into the file are they?
        let offset = magicByteDefinition.offset;
        let magicBytes = magicByteDefinition.bytes;

        // sanity check for length of magic bytes vs number of bytes we have from the file
        let match = (magicBytes.length + offset) <= fileHeaderBytes.length;
        if (!match)
            return false;

        // check that the bytes match
        let idx = 0;
        while (match && (idx < magicBytes.length) && (idx + offset < fileHeaderBytes.length)) {
            if (magicBytes[idx] !== fileHeaderBytes[idx + offset]) {
                return false; // bytes don't match - exit now
            }
            idx++;
        }

        // if we got this far then all the bytes must have matched
        return true;
    };
}(window.portal.UploadUtils, $));

(function(ns, jQuery) {
    "use strict";
    // ============================================================================================
    // window.portal
    // ============================================================================================
    /**
     * Utility function to merge the contents of two or more objects together into the first
     * object.
     *
     * Example use:
     *      let x = extend({}, {'a':1,'b':2}, {'b':3,'c':4}) ==> x = {'a':1, 'b':3, 'c':4}
     *
     * @return {{}}
     */
    ns.extend = function () {
        let argCount = arguments.length;
        let arg0 = argCount > 0 ? arguments[0] : {};
        for (let i = 1; i < argCount; i++) {
            let argument = arguments[i];
            if (argument) {
                let keys = Object.getOwnPropertyNames(arguments[i]);
                for (let j = 0; j < keys.length; j++) {
                    let key = keys[j];
                    arg0[key] = arguments[i][key];
                }
            }
        }
        return arg0;
    };
    /**
     * Zip two arrays, one containing keys and the other containing values into a JavaScript object
     * For example:
     *      zip(['a', 'b', 'c'], [1, 2, 3]) ==> {'a':1, 'b':2, 'c':3}
     *
     * @param keys the keys
     * @param values the values
     * @return {{}} the zipped arrays as an object
     */
    ns.zip = function(keys, values){
        let zipped = {};
        if(keys && values && keys.length === values.length){
            keys.map(function(e,i){return[e,values[i]];})
                .map(function(e){zipped[e[0]]=e[1];});
        }
        return zipped;
    };
    /**
     * Utility function to generate a Version 4 UUID
     *
     * A Version 4 UUID is a universally unique identifier that is generated using random numbers.
     *
     * @return a Version 4 UUID (such as "9697a023-810c-4034-a552-aad10053b161")
     */
    ns.S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    ns.generateUUID = function () {
        return ns.S4() + ns.S4() + "-" + ns.S4() + "-" + ns.S4() + "-" + ns.S4() + "-" + ns.S4() + ns.S4() + ns.S4();
    };
    /**
     * Inject CSS rules at runtime to extend or override existing CSS rules.
     *
     * NOTE: USE SPARINGLY, WITH CAUTION, AND ONLY FOR GOOD REASON!!
     *
     * Example:
     *     Adding the 'selected' class on table rows makes the <tr> element's background turn blue
     *     because of the CSS rule...
     *
     *         tr.selected{background-color:blue;}
     *
     *     ...but you need to change the behaviour for a specific row to change red, but only know
     *     which row it is at runtime. So...
     *
     *         portal.injectStyles('tr#abc123.selected{background-color:red;}', 'injectedStyles');
     *
     *     Note that the 'tr' in the selector above is actually redundant, but left for clarity of
     *     the example.
     *
     * @param rule the CSS rule
     * @param id the DOM ID to use when injecting the rule, so that it can be removed afterwards if
     * required
     */
    ns.injectStyles = function(rule, id){
        if(typeof(id)==='string'){
            // remove any existing style injection from the DOM
            $('#'+id).remove();
        }
        let styleContainer = $('<div'+(typeof(id)==='string'?(' id="'+id+'"'):'')+' />');
        styleContainer.html('<style>' + rule + '</style>');
        styleContainer.appendTo("body");
    };
    /**
     * A utility method to facilitate invoking methods with browser specific prefixes.
     *
     * Example usage:
     *      if (RunPrefixMethod(document, "FullScreen") ||
     *          RunPrefixMethod(document, "IsFullScreen")) {
     *              RunPrefixMethod(document, "CancelFullScreen");
	 *      } else {
	 *	        RunPrefixMethod(e, "RequestFullScreen");
	 *      }
     *
     * @param obj the object to attempt to run the prefixed unprefixedMethod agains
     * @param unprefixedMethod the name of the method to invoke (without any prefix)
     */
    ns.BROWSER_PREFIXES = ['webkit', 'moz', 'ms', 'o', '']; // unprefixed is last
    ns.runPrefixedMethod = function (obj, unprefixed) {
        let idx = 0;
        let propertyName, propertyType;
        while (idx < ns.BROWSER_PREFIXES.length && !obj[propertyName]) {
            let prefix = ns.BROWSER_PREFIXES[idx];
            propertyName = unprefixed;
            if (prefix === '') {
                propertyName = propertyName.substr(0, 1).toLowerCase() + propertyName.substr(1);
            }
            propertyName = prefix + propertyName;
            propertyType = typeof(obj[propertyName]);
            if (propertyType !== 'undefined') {
                // update prefixes list for next time so we get it right the first time
                ns.BROWSER_PREFIXES = [prefix];
                // invoke the method if it *is* a method and return the result, otherwise
                // just return the property itself
                return (propertyType === 'function' ? obj[propertyName]() : obj[propertyName]);
            }
            idx++;
        }
        // if we get here there's no such property defined and we just carry on
        ns.Logger.debug(['No such property found (prefixed or otherwise) for "' + unprefixed + '" on instance:', obj]);
    };

    /**
     * A Collection of utility functions for dealing with the current view properties (such as filtering,
     * page number, items per page, and so on). Must be kept in sync with ViewProperties class in
     * Python code.
     */
    ns.ViewProperties = class {
        constructor() {
            // 'root' level filters cookie key
            this.ROOT_KEY = 'ViewProps';
            // keys for the various properties
            this.FILTERS_DATETIME_KEY = 'fDatetime';
            this.FILTERS_CAMERA_KEY = 'fCamera';
            this.FILTERS_CATEGORY_KEY = 'fCategory';
            // the following two parameters are never used in JavaScript, but
            // are left here for symmetry with the Python code.
            this.PAGE_NUMBER_KEY = 'page';
            this.ITEMS_PER_PAGE_KEY = 'items';

            let properties = Cookies.getJSON(this.ROOT_KEY);
            this.properties = properties ? properties : {};
            return this;
        }

        persist() {
            let properties = this.getProperties();
            if (Object.keys(properties).length > 0) {
                Cookies.set(this.ROOT_KEY, properties, {expires: 7});
            } else {
                Cookies.remove(this.ROOT_KEY);
            }
            return this;
        }

        /**
         * Utility function to obtain all properties currently stored.
         *
         * @return the stored properties. Guaranteed to return at least an empty object (i.e., will never return null)
         */
        getProperties() {
            if (typeof(this.properties) !== 'object') {
                this.properties = {};
            }
            return this.properties;
        }

        /**
         * Utility function to obtain the definition of a particular property.
         *
         * @param propertyKey the key for the property
         * @return the definition of the property. May be undefined if no such property has yet been set
         */
        getProperty(propertyKey) {
            let properties = this.getProperties();
            return properties[propertyKey];
        }

        /**
         * Utility function to clear the value for a particular filter. The filter entry will not exist after this method
         * is called (i.e., getFilter(filterKey) will return an undefined value for that filterKey value)
         *
         * @param filterKey the key for the filter to clear
         */
        clearProperty(filterKey) {
            let properties = this.getProperties();
            if (Object.keys(properties).length > 0) {
                if (typeof(properties[filterKey]) !== 'undefined') {
                    delete(properties[filterKey]);
                    this.persist();
                }
            }
        }

        /**
         * Utility function to set the value for a particular filter. Any existing value for the filter entry will be
         * overwritten by this method call
         *
         * @param filterKey the key for the filter to set
         * @param value the value for the filter
         */
        setProperty(filterKey, value) {
            if (value === null || typeof(value) === 'undefined') {
                this.clearProperty(filterKey);
            } else {
                let properties = this.getProperties();
                if (properties[filterKey] !== value) {
                    properties[filterKey] = value;
                    this.persist();
                }
            }
        }
    };

    /**
     * A manager for a grid of video panes, as for a live wall. It is responsible for finding
     * the next available 'cell' in the grid when a video is added, and for cleaning up once
     * a video has finished.
     *
     * @param targetElms an array of the DOM elements which make up the grid cells, in the order
     * in which it is preferred they be filled.
     */
    ns.VIDEO_CONTAINER_DIV = '<div class="video-panel" />';
    ns.VideoPaneManager = class {
        constructor(targetElms, opts) {
            let defaultOptions = {
                // the maximum playback time allowed for a video before it is automatically removed
                // from the livewall
                maxPlaybackTime:45,
                // the minimum time a video must remain on playing before it may be automatically
                // removed from the livewall
                minPlaybackTime:15,
                // a function to call when a feed video is clicked - takes the feed ID as
                // an argument to the function - e.g.:
                //     onFeedClick:function(feedId){console.log(feedId);}
                // may also be null if there is no action required when a video feed is clicked
                onFeedClick:null,
                // load calculation function - a function to calculate the current 'load' of the
                // video panes as a floating point value between 0.0 (no load) and 1.0 (full load)
                // generally speaking this should not require modification
                loadCalculator:ns.VideoPaneManager.logarithmicLoad
            };
            this.options = jQuery.extend({}, defaultOptions, opts);

            this.currentMaxPlaybackTime = this.options.maxPlaybackTime;
            // the DOM elements which act as grid cells for the manager to use for video
            this.targetElms = [];
            jQuery(targetElms).each(function (idx, elm) {
                this.targetElms.push(jQuery(elm).empty());
            }.bind(this));
            // lookup to keep track of video panels
            this.videoPaneLookup = {};
            // FIFO queue to track 'oldest' playing video panels (to prioritise for removal if the
            // grid is full and more videos need to be added
            this.videoPaneFifoQueue = [];
            // a camera filter - null means no filtering, a JavaScript object can be provided with
            // camera names as keys and true/false booleans as values indicating whether the camera's
            // feed should be included. See setCameraFilter() and clearCameraFilter() for more detail.
            this.cameraFilter = null;
        }
        /**
         * Set the camera filtering option (i.e., apply filtering, display anomalies only from
         * selected cameras).
         *
         * @param cameraFilter a JavaScript object containing camera names as keys and true/false
         * booleans as values indicating whether the camera's feed should be included (true) or
         * excluded (false, or non-existent). If null, no filtering is applied.
         */
        setCameraFilter(cameraFilter) {
            // firstly check that the filter is actually different - avoid doing updates to the
            // video panel if the filter hasn't changed.
            if (cameraFilter === undefined) {
                cameraFilter = null;
            }
            if (this.cameraFilter === null && cameraFilter === null) {
                // no change to the filter - it was null before and is null now
                return;
            }
            if (this.cameraFilter !== null && cameraFilter !== null) {
                let currentFilterIds = Array.sort(Object.getOwnPropertyNames(this.cameraFilter));
                let newFilterIds = Array.sort(Object.getOwnPropertyNames(cameraFilter));
                if (currentFilterIds.length === newFilterIds.length) {
                    let idx = 0;
                    let same = true;
                    while (same && idx < currentFilterIds.length) {
                        same = currentFilterIds[idx] === newFilterIds[idx];
                        idx++;
                    }
                    if (same) {
                        // no change to the filter - it has the same values as the existing filter
                        return;
                    }
                }
            }

            // update the filter to the new value
            this.cameraFilter = cameraFilter;

            if (cameraFilter !== null) {
                // the specified camera filter was not null, so we need to update the currently
                // displayed video feeds to make sure that they comply with the new filter
                let videoPaneIds = Object.getOwnPropertyNames(this.videoPaneLookup);
                for (let idx = 0; idx < videoPaneIds.length; idx++) {
                    let videoPaneId = videoPaneIds[idx];
                    if (this.cameraFilter[videoPaneId] !== true) {
                        // this feed should not be displayed under the new filter
                        this.cleanupVideoPane(videoPaneId);
                    }
                }
            }
        }
        /**
         * Clear camera filtering (i.e., apply no filtering, display anomalies from *any* camera)
         */
        clearCameraFilter() {
            this.setCameraFilter(null);
        }
        /**
         * Add a new feed to the grid
         * @param feed the feed definition, expected to be of the following form
         *        {
         *          id:'UNIQUE ID OF FEED', // for tracking/identification purposes
         *          title:'NAME OF FEED', // for display purposes
         *          timestamp:TIMESTAMP_OF_VIDEO_START, // UNIX time in seconds
         *          streams:[
         *              {
         *              type:VIDEO_TYPE,  // e.g. 'type/mp4', 'type/webm' etc
         *              url:STREAM_URL
         *              },
         *              ...
         *          ]
         *        }
         */
        addFeed(feed) {
            if (this.cameraFilter !== null) {
                let camera_pk = feed.id;
                if (this.cameraFilter[camera_pk] !== true) {
                    return;
                }
            }

            let videoPaneId = feed.id;
            if (typeof(videoPaneId) === 'undefined') {
                ns.Logger.warning('A unique feed identifier is required (feed.id), but none was provided');
                return;
            }
            let isCollision = typeof(this.videoPaneLookup[videoPaneId]) !== 'undefined';
            if (isCollision) {
                // This can occur because we add the feed even on anomaly update to allow the live
                // wall to start showing anomaly quickly when the page is initially refreshed.
                // ns.Logger.warning('Cannot add feed with ID "'+feed.id+'" because it is already being displayed.');
                return;
            }
            this.populateVideoPane(videoPaneId,
                feed.title, feed.timestamp, feed.installation_timestamp, feed.streams);
            this.adjustMaxPlaybackTime();
        }
        /**
         * Remove an existing feed from the grid
         * @param feed the feed definition, expected to be of the following form
         *        {
         *          id:'UNIQUE ID OF FEED', // for tracking/identification purposes
         *          timestamp:TIMESTAMP_OF_VIDEO_END, // UNIX time in seconds
         *        }
         */
        removeFeed(feed) {
            let videoPaneId = feed.id;
            if (typeof(videoPaneId) === 'undefined') {
                ns.Logger.warning('A unique feed identifier is required (feed.id) to remove a feed, but none was provided');
                return;
            }
            let isMissing = typeof(this.videoPaneLookup[videoPaneId]) === 'undefined';
            if (isMissing) {
                ns.Logger.warning('Cannot remove feed with ID "' + feed.id + '" because it is not being displayed.');
                return;
            }
            this.cleanupVideoPane(videoPaneId);
        }
        /**
         * A function which calculates the current 'load' of the video wall.
         *
         * @return {number} the current load
         */
        getLoad() {
            let available = this.targetElms.length;
            let occupied = this.videoPaneFifoQueue.length;
            return this.options.loadCalculator(available, occupied);
        }
        adjustMaxPlaybackTime() {
            let playbackTimeRange = this.options.maxPlaybackTime - this.options.minPlaybackTime;
            let load = this.getLoad();
            // at 0.0 load (i.e., minimium load) we will playback for the maximum configured
            // playback time, and at 1.0 (i.e., maximum load) we will playback for the minimum
            // configured playback time
            this.currentMaxPlaybackTime = this.options.maxPlaybackTime - (playbackTimeRange * load);
        }
        /**
         * Cleans up (i.e. removes the content of) a grid pane.
         * @param paneId the ID of the pane when it was initialised
         * @param title the title for the pane (to be displayed in the header bar)
         * @param timestamp the timestamp (UNIX time in seconds) for the start of the video feed
         * @param installation_timestamp the timestamp (UNIX time in milliseconds) for the current time of the installation.
         * @param streams an array of JavaScript objects describing video sources, expected to be
         *        of the following form:
         *          [
         *              {
         *                  type:VIDEO_TYPE,  // e.g. 'type/mp4', 'type/webm' etc
         *                  url:STREAM_URL
         *              },
         *              ...
         *          ]
         */
        populateVideoPane(paneId, title, timestamp, installation_timestamp, streams) {
            // find somewhere to put the panel in the grid
            let gridCell = this.getNextAvailable();
            if (gridCell !== null) {
                // create the video panel
                let videoPane = new ns.VideoPane(paneId, this);
                // flag this cell as 'occupied'
                gridCell.data({occupied: true});
                // swap out the original content of the cell, keep it for later restoration
                let originalContent = gridCell.children().detach();
                // create a record of what's going into the cell
                let record = {
                    id: paneId,
                    videoPane: videoPane,
                    container: gridCell,
                    originalContent: originalContent,
                    playbackSpeedupTimer: null
                };
                // store the record in the lookup map and FIFO queue
                this.videoPaneLookup[paneId] = record;
                this.videoPaneFifoQueue.push(record);

                // We can either make the speed up static, or we can make
                // how long we speed up static.
                let speedUpFactor = 2.0;
                let timeout_delay = (installation_timestamp - timestamp) / speedUpFactor;

                // kick off the playback of the stream
                videoPane.initialize({onClick:this.options.onFeedClick});
                videoPane.setHeight(gridCell.height());
                videoPane.setMuted(true);
                videoPane.setFeed(title, timestamp, streams);
                videoPane.setFeedTickCallback(this.onFeedTicked.bind(this));
                videoPane.setFeedEndCallback(this.onFeedEnded.bind(this));
                videoPane.setPlaybackSpeed(speedUpFactor);
                gridCell.append(videoPane.getContainer());

                record.playbackSpeedupTimer = setTimeout(jQuery.proxy(function () {
                    videoPane.setPlaybackSpeed(1.0);
                    record.playbackSpeedupTimer = null;
                }, this), timeout_delay);
                videoPane.play();
            }
        }
        /**
         * Cleans up (i.e. removes the content of) a grid pane.
         * @param paneId the ID of the pane when it was initialised
         */
        cleanupVideoPane(paneId) {
            let videoPaneRecord = this.videoPaneLookup[paneId];
            if (videoPaneRecord) {
                if (videoPaneRecord.playbackSpeedupTimer !== null) {
                    clearTimeout(videoPaneRecord.playbackSpeedupTimer);
                }

                delete this.videoPaneLookup[paneId];
                this.removeFromFifoQueue(videoPaneRecord);

                videoPaneRecord.videoPane.destroy();
                videoPaneRecord.container.empty();
                if (videoPaneRecord.originalContent !== null) {
                    videoPaneRecord.container.append(videoPaneRecord.originalContent);
                }
                videoPaneRecord.container.data({occupied: false});

                this.adjustMaxPlaybackTime();
            }
        }
        /**
         * This should be called when the containers of the video panes change size, such as
         * when a screen resizing occurs (including a transition to full screen mode). It makes
         * sure all of the active video panes correctly "follow" the sizing of their containing
         * DOM elements.
         */
        refreshSizes() {
            let keys = Object.getOwnPropertyNames(this.videoPaneLookup);
            for (let j = 0; j < keys.length; j++) {
                let videoPaneRecord = this.videoPaneLookup[keys[j]];
                let videoPane = videoPaneRecord.videoPane;
                let container = videoPaneRecord.container;
                videoPane.setHeight(container.height());
            }
        }
        /**
         * Utility method to find the next available cell in the grid
         * @returns the next available cell in the grid, or null if all cells are occupied
         */
        getNextAvailable() {
            // look for first unoccupied cell
            for (let idx = 0; idx < this.targetElms.length; idx++) {
                let candidate = this.targetElms[idx];
                if (!candidate.data('occupied')) {
                    // cell is not occupied - use it
                    return candidate;
                }
            }
            // all cells are occupied
            return null;
        }
        /**
         * Remove an item from the FIFO queue
         * @param record the item to be removed
         */
        removeFromFifoQueue(record) {
            let idx = 0;
            let done = false;
            while (!done && idx < this.videoPaneFifoQueue.length) {
                if (record.id === this.videoPaneFifoQueue[idx].id) {
                    this.videoPaneFifoQueue.splice(idx, 1);
                    done = true;
                }
                idx++;
            }
        }
        /**
         * Callback function which should be called when a video in a VideoPane ends its playback -
         * cleanup tasks are done here
         * @param id the id of the VideoPane which finished playback
         */
        onFeedEnded(id) {
            this.cleanupVideoPane(id);
        }
        /**
         * Callback function which should be called periodically as a VideoPane continues its
         * playback - cleanup tasks may be done here if the video has been playing for too long
         * @param id the id of the VideoPane which has 'ticked'
         * @param playbackTime the current playback time (i.e., how far through the video the
         * playback is in seconds, from 0)
         */
        onFeedTicked(id, playbackTime) {
            if (playbackTime > this.currentMaxPlaybackTime) {
                this.cleanupVideoPane(id);
            }
        }
        /**
         * A function which calculates the current 'load' of the video wall. This is actually not
         * really suitable for keeping videos up as long as possible, and the function
         * {@link ns.VideoPaneManager#logarithmicLoad()} should be used in most cases.
         *
         * NOTE: 0 or 1 cell occupancy are *both* considered to be 0.0 load
         *
         * NOTE: A value of 0 means that zero or one cells are occupied, and a value of 1 indicates
         * that all cells are occupied. The relationship of the load value to cell occupancy is
         * linear. That is, if charted the load values would look basically like this:
         *
         *  1.0  |             **
         *       |           **
         *       |         **
         *  load |       **
         *       |     **
         *       |   **
         *       | **
         *  0.0  L_______________
         *       none         all
         *        occupied cells
         *
         * @return {number} the current load as a floating point value in the range 0.0 to 1.0,
         * where 0.0 is zero or 1 occupancy and 1.0 is maximum load
         */
        static linearLoad(available, occupied){
            if (available === 0 || occupied === 0) {
                return 0;
            } else if (occupied >= available) {
                return 1.0;
            }

            return 1.0 - ((available - (occupied-1)) / available);
        }
        /**
         * A function which calculates the current 'load' of the video wall as a logarithmic
         * function of availability -vs- occupancy. This means that the perceived load increases
         * slowly at low occupancy ratios and more quickly at higher occupancy ratios.
         *
         * NOTE: 0 or 1 cell occupancy are *both* considered to be 0.0 load
         *
         * This allows us to keep videos up on the wall as long as possible, only trimming the
         * playback length significantly once the playback wall reaches the upper occupancy ratios.
         *
         * So, although a value of 0.0 means that zero or one cells are occupied, and a value of
         * 1.0 indicates that all cells are occupied, if charted the load values would look
         * basically like this:
         *
         *  1.0  |                      *
         *       |                     *
         *       |                   **
         *  load |                ***
         *       |            ****
         *       |       *****
         *       | ******
         *  0.0  L_______________________
         *       none                 all
         *             occupied cells
         *
         * @return {number} the current load as a floating point value in the range 0.0 to 1.0,
         * where 0.0 is zero or 1 occupancy and 1.0 is maximum load
         */
        static logarithmicLoad(available, occupied){
            if (available === 0 || occupied === 0) {
                return 0;
            } else if (occupied >= available) {
                return 1.0;
            }

            return 1.0 - Math.log10(available - (occupied-1)) / Math.log10(available);
        }
    };

    /**
     * A video pane containing a video for playback and an informational title bar
     *
     * @param id the ID that this VideoPane should identify itself with
     * @param manager the video pane manager, if any
     * @constructor
     */
    ns.VideoPane = class {
        constructor(id, manager=null) {
            // the ID with which this instance can identify itself
            this.id = id;
            // the manager which manages this pane, if any
            this.manager = manager;

            // the following are DOM components which are created to form the video pane - variables
            // with a $ prefix indicate a jQuery-ised element
            this.$container = null;
            this.$videoElm = null;
            this.videoElm = null; // non-jQuery version of $videoElm for convenience
            this.$feedDetailContainer = null;
            this.$feedNameElm = null;
            this.$feedTimestampElm = null;
            // details of the video feed which has been assigned to this instance
            this.feedDetails = null;
            // timer used for periodic updates to video details, such as current playback time
            this.updateTimer = null;
            // flag to indicate whether this instance is ready to play, pause etc
            this.isInitialized = false;
        }

        /**
         * Set up the basics of the video panel
         * @param opts not used at the moment
         */
        initialize(opts) {
            if (this.isInitialized) {
                return;
            }

            // default for initialisation options
            let defaultOptions = {
                autoplay: false,
                controls: false,
                muted: true,
                preventRightClicks: true,
                onClick: null,
                timestampFormat: 'HH:mm:ss YYYY/MM/DD'
            };
            // set up options - merge 'over' defaults to get final options
            this.options = jQuery.extend({}, defaultOptions, opts);

            this.$container = $(ns.VIDEO_CONTAINER_DIV);

            this.$feedDetailContainer = jQuery('<div class="feed-detail" />');
            this.$feedNameElm = jQuery('<span class="feed-name pull-left" />');
            this.$feedDismissElm = jQuery('<span class="feed-dismiss pull-right"><i class="fas fa-window-close" style="" /></span>');
            this.$feedPlaybackRateElm = jQuery('<span class="feed-playback-rate pull-right"><i class="ffwd-indictator fas fa-forward" style="" /><i class="play-indictator fas fa-play" style="" /></span>');
            this.$feedTimestampElm = jQuery('<span class="feed-timestamp pull-right" />');
            this.$feedDetailContainer.append(
                this.$feedNameElm,
                this.manager === null ? null : this.$feedDismissElm,
                this.$feedPlaybackRateElm,
                this.$feedTimestampElm
            );

            this.$feedVideoContainer = jQuery('<div class="feed-video" />');
            this.$videoElm = jQuery('<video controls autoplay/>');
            this.$feedVideoContainer.append(this.$videoElm);

            this.videoElm = this.$videoElm.get(0);
            this.videoElm.autoplay = this.options.autoplay;
            this.videoElm.controls = this.options.controls;
            this.videoElm.muted = this.options.muted;
            if (this.options.preventRightClicks) {
                this.$videoElm.on({
                    'contextmenu': function (evt) {
                        // trap right clicks on the video element to prevent the user from
                        // manually pausing, playing etc via the context menu
                        evt.preventDefault();
                    }
                });
            }
            if (jQuery.isFunction(this.options.onClick)) {
                this.$videoElm.on({
                    'click': function () {
                        // call the configured function when the user clicks a video
                        this.options.onClick.call(this, this.id);
                    }.bind(this)
                }).css({cursor:'pointer'});
            }
            if (this.manager !== null) {
                this.$feedDismissElm.on('click', function () {
                    this.manager.cleanupVideoPane(this.id);
                }.bind(this));
            }

            this.$container.append(this.$feedDetailContainer, this.$feedVideoContainer);

            this.isInitialized = true;
        }

        setHeight(height) {
            let detailHeight = 20;
            let videoHeight = height - detailHeight;
            this.$feedDetailContainer.height(detailHeight);
            this.$feedVideoContainer.height(videoHeight);
        }

        /**
         * Set up the feed that this video panel should play
         *
         * @param title the title to be displayed in the header bar
         * @param timestamp the timestamp (UNIX time, in seconds) for the start of the feed
         * @param streams an array of stream definitions as a JavaScript object of the
         *        following form:
         *        [
         *              {
         *              type: VIDEO_TYPE,  // e.g. 'type/mp4', 'type/webm' etc
         *              url: STREAM_URL
         *              },
         *              ...
         *        ]
         */
        setFeed(title, timestamp, streams) {
            if (this.isInitialized) {
                this.feedDetails = {title: title, timestamp: timestamp, streams: streams};

                this.updateFeedDetailBar();
                if (streams.length === 1 && streams[0].type === 'video/mjpg') {
                    // this is a bit of a hack to allow playback of MJPEG streams using an
                    // <img> element rather than a <video> element, which does not support
                    // playback of MJPEG video. It will likely be removed later on since we
                    // do not anticipate actually streaming MJPG streams in the future.
                    // remove the <video> element and replace it with an <img> element
                    this.$videoElm.detach();
                    this.$container.append(jQuery('<img src="' + streams[0].url + '">'));
                }
                else {
                    $(this.feedDetails.streams).each(function (idx, stream) {
                        // this.$videoElm.append(jQuery('<source type="' + stream.type + '" src="' + stream.url + '">'));
                        this.$videoElm.attr('src', stream.url);
                    }.bind(this));

                    this.$videoElm.off('play').on('play', function () {
                        this.$videoElm.off('ended').one('ended', function () {
                            if (this.feedEndCallback) {
                                this.feedEndCallback.call(null, this.id);
                            }
                        }.bind(this));
                    }.bind(this));
                }
            }
        }

        /**
         * Obtain the jQuery-ised DOM element which is the outer container of the VideoPane
         * @returns the jQuery-ised DOM element which is the outer container of the VideoPane
         */
        getContainer() {
            return this.$container;
        }

        /**
         * Updates the detail bar at the top of the video pane to reflect the current state of
         * playback.
         */
        updateFeedDetailBar() {
            if (this.isInitialized && this.feedDetails !== null) {
                if (this.videoElm.playbackRate === 1.0) {
                    this.$feedDetailContainer.removeClass("speed-up");
                } else {
                    this.$feedDetailContainer.addClass("speed-up");
                }

                // camera name
                this.$feedNameElm.text(this.feedDetails.title);
                // update displayed timestamp basde on feed's "start" timestamp
                // and the current playback position
                let currentTimestamp = (this.feedDetails.timestamp + this.videoElm.currentTime * 1000);
                let dateTimeStr = moment(currentTimestamp).format(this.options.timestampFormat);
                this.$feedTimestampElm.text(dateTimeStr);
            }
        }

        /**
         * Calling this causes a periodic update of detail bar at the top of the video pane to
         * reflect the current state of playback.
         * @param interval the interval at which the detail bar should be updated, in milliseconds
         */
        periodicFeedDetailUpdater(interval) {
            // stop any existing periodic update task
            this.stopFeedDetailUpdater();

            if (this.feedTickCallback) {
                // call the tick update callback if defined
                this.feedTickCallback.call(null, this.id, this.videoElm.currentTime);
            }
            // update the detail bar
            this.updateFeedDetailBar();
            // set up the next update
            this.updateTimer = setTimeout(
                function () {
                    this.periodicFeedDetailUpdater(interval);
                }.bind(this),
                interval
            );
        }

        /**
         * Calling this causes any periodic update of the detail bar in progress to cease.
         */
        stopFeedDetailUpdater() {
            // check for an update timer
            if (this.updateTimer !== null) {
                // found one - clear it out
                clearTimeout(this.updateTimer);
                this.updateTimer = null;
            }
        }

        /**
         * Set the callback function which should be executed as video playback continues
         * @param callback the callback function which to execute as video playback continues
         */
        setFeedTickCallback(callback) {
            if (jQuery.isFunction(callback)) {
                this.feedTickCallback = callback;
            } else {
                this.feedTickCallback = undefined;
            }
        }

        /**
         * Set the callback function which should be executed when video playback ends
         * @param callback the callback function which to execute when video playback ends
         */
        setFeedEndCallback(callback) {
            if (jQuery.isFunction(callback)) {
                this.feedEndCallback = callback;
            } else {
                this.feedEndCallback = undefined;
            }
        }

        /**
         * Start video playback
         */
        play() {
            if (this.isInitialized && this.videoElm.paused) {
                this.periodicFeedDetailUpdater(500);
                this.videoElm.play();
            }
        }

        /**
         * Pause video playback
         */
        pause() {
            if (this.isInitialized && !this.videoElm.paused) {
                this.videoElm.pause();
            }
        }

        /**
         * Mute audio on video playback
         */
        setMuted(shouldMute) {
            if (this.isInitialized) {
                this.videoElm.muted = shouldMute;
            }
        }

        /**
         * Check if audio is currently muted on video playback
         */
        isMuted() {
            return this.isInitialized && this.videoElm.muted;
        }

        /**
         * Set the volumen of the audio for video playback
         * @param level the volume level from 0 (no sound) to 1 (maximum volume) inclusive
         */
        setVolume(level) {
            if (this.isInitialized) {
                // set volume, sanity checked to the range 0-1
                this.videoElm.volume = Math.max(0, Math.min(1, level));
            }
        }

        /**
         * Skip to a given timestamp in the video, in seconds (start of playback is 0)
         * @param timestamp the timestamp to skip to, in seconds (start of playback is 0)
         */
        skipTo(timestamp) {
            if (this.isInitialized) {
                this.videoElm.currentTime = Math.max(0.0, Math.min(this.videoElm.duration, timestamp));
            }
        }

        /**
         * Skip forward (or backward) from the current timestamp in the video, in seconds (negative
         * seconds will skip backward).
         * @param seconds the amount to skip by, in seconds
         */
        skipBy(seconds) {
            if (this.isInitialized) {
                this.skipTo(this.videoElm.currentTime + seconds);
            }
        }

        /**
         * Restart playback from the beginning - this is equivalent to skipTo(0);
         */
        restartPlayback() {
            this.skipTo(0);
        }

        /**
         * Set the playback speed of the video using a multiplier - for example, 2 will result in
         * a 2x speed playback. Negative values will be treated as 0.
         * @param multiplier the playback speed multiplier
         */
        setPlaybackSpeed(multiplier) {
            if (this.isInitialized) {
                this.videoElm.playbackRate = Math.max(0, multiplier);
            }
        }

        /**
         * Reset the playback speed of the video to its default
         */
        resetPlaybackSpeed() {
            if (this.isInitialized) {
                this.videoElm.playbackRate = this.videoElm.defaultPlaybackRate;
            }
        }

        /**
         * Clean up this VideoPane
         */
        destroy() {
            this.stopFeedDetailUpdater();
            // https://github.com/kzahel/web-server-chrome/issues/63
            // The video needs to be stopped and the src blanked otherwise
            // chrome will keep the socket open and you are only allowed
            // 6 sockets to a single server.
            this.$videoElm.stop();
            this.$videoElm.attr('src', '');

            this.$container.remove();
            this.isInitialized = false;
        }
    };
}(window.portal, jQuery));

(function(ns, jQuery) {
    /**
     * A zoom control bar with buttons for zoom in, zoom out, and zoome extents.
     *
     * @type {ns.ZoomControls}
     */
    ns.ZoomControls = class {
        /**
         * Constructor
         *
         * @param container the DOM element which will contain the zoom controls
         * @param opts options to customise the appearance of the zoom controls
         */
        constructor(container, opts = {}) {
            this.container = container;
            this.$container = jQuery(this.container);

            let defaultOpions = {
                buttonGroup: {
                    // classes to apply to the button grouping <div>
                    klasses: [],
                    buttons: {
                        // classes, label and tooltip to apply to the <button> elemenst
                        zoomIn: {klasses: [], label: '+', tooltip: 'Zoom In'},
                        zoomOut: {klasses: [], label: '-', tooltip: 'Zoom Out'},
                        zoomExtents: {klasses: [], label: '⇋', tooltip: 'Zoom Extents'}
                    }
                },
                // event options
                events: {
                    // event namespacing
                    namespace: 'zoom-control-',
                    // event names
                    names: {
                        // emmitted when the zoom in button is pressed
                        zoomIn: 'in',
                        // emmitted when the zoom out previous button is pressed
                        zoomOut: 'out',
                        // emmitted when the zoom extents button is pressed
                        zoomExtents: 'extents'
                    }
                }
            };
            this.options = jQuery.extend(true, {}, defaultOpions, opts);

            // build the elements for the zoom controls
            this._initialiseGUI();
            // set up event handling on the zoom controls
            this._initialiseEvents();
        }
        /**
         * Creates the DOM elements which make up the media controls, assembles them, and inserts
         * them into the container.
         *
         * @private
         */
        _initialiseGUI() {
            // create DOM elements
            // button group
            let buttonGroupOptions = this.options.buttonGroup;
            let $buttonGroup = jQuery('<div role="group" aria-label="zoom controls" />')
                .addClass(buttonGroupOptions.klasses.join(' '));
            // buttons
            let buttonOptions = buttonGroupOptions.buttons;
            let buttonHtml = '<button></button>';
            this.$zoomIn = jQuery(buttonHtml)
                .html(buttonOptions.zoomIn.label)
                .attr('title', buttonOptions.zoomIn.tooltip)
                .addClass(buttonOptions.zoomIn.klasses.join(' '));
            this.$zoomOut = jQuery(buttonHtml)
                .html(buttonOptions.zoomOut.label)
                .attr('title', buttonOptions.zoomOut.tooltip)
                .addClass(buttonOptions.zoomOut.klasses.join(' '));
            this.$zoomExtents = jQuery(buttonHtml)
                .html(buttonOptions.zoomExtents.label)
                .attr('title', buttonOptions.zoomExtents.tooltip)
                .addClass(buttonOptions.zoomExtents.klasses.join(' '));


            // assemble DOM elements
            $buttonGroup.append(
                this.$zoomIn, this.$zoomOut, this.$zoomExtents
            );

            // add to container (after first clearing out any existing content)
            this.$container.empty().append($buttonGroup);
        }

        /**
         * Initialises event handling for the various buttons when they are clicked
         *
         * @private
         */
        _initialiseEvents() {
            // these buttons just fire events
            this.$zoomIn.on('click', this._fireZoomInEvent.bind(this));
            this.$zoomOut.on('click', this._fireZoomOutEvent.bind(this));
            this.$zoomExtents.on('click', this._fireZoomExtentsEvent.bind(this));
        }

        /**
         * Utility method to create 'namespaced' event names for the timeline
         *
         * @param eventName the name of the event
         * @return {string} the 'namespaced' event name
         * @private
         */
        _makeEventName(eventName) {
            return this.options.events.namespace + eventName;
        }

        /**
         * Utility method to fire a custom event when zoom in is pressed
         *
         * @return {ns.ZoomControls}
         * @private
         */
        _fireZoomInEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.zoomIn), {});
        }

        /**
         * Utility method to fire a custom event when zoom out is pressed
         *
         * @return {ns.ZoomControls}
         * @private
         */
        _fireZoomOutEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.zoomOut), {});
        }

        /**
         * Utility method to fire a custom event when zoom to extents is pressed
         *
         * @return {ns.ZoomControls}
         * @private
         */
        _fireZoomExtentsEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.zoomExtents), {});
        }
        /**
         * Utility method to fire a custom event
         *
         * @param eventName the name of the event
         * @param eventProperties any properties which should be available from the event
         * @return {ns.Timeline}
         * @private
         */
        _fireEvent(eventName, eventProperties = {}) {
            let event; // The custom event that will be created
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent(eventName, true, true);
            } else {
                event = document.createEventObject();
                event.eventType = eventName;
            }

            event.eventName = eventName;
            event.timeline = this;
            jQuery.extend(event, eventProperties);

            if (document.createEvent) {
                this.container.dispatchEvent(event);
            } else {
                this.container.fireEvent("on" + event.eventType, event);
            }
            return this;
        }

        /**
         * Internal static method to provide the key for data on the widget indicating play/pause
         * status
         *
         * @return {string} the key to obtain data off the DOM element as to whether the controls
         * are in a playing state or not
         * @constructor
         */
        static DATA_IS_PLAYING() {
            return 'is_playing';
        }
    };
}(window.portal, jQuery));

(function(ns, jQuery) {
    /**
     * A media playback control bar with buttons for play/pause, skip to next, previous, last and
     * first.
     *
     * @type {MediaControls}
     */
    ns.MediaControls = class {
        /**
         * Constructor
         *
         * @param container the DOM element which will contain the playback controls
         * @param opts options to customise the appearance of the media controls
         */
        constructor(container, opts = {}) {
            this.container = container;
            this.$container = jQuery(this.container);

            let defaultOpions = {
                toolbar: {
                    // classes to apply to the toolbar containing <div>
                    klasses: [],
                    buttonGroup: {
                        // classes to apply to the button grouping <div>
                        klasses: [],
                        buttons: {
                            // classes, label and tooltip to apply to the <button> elemenst
                            skipToFirst: {klasses: [], label: '⇚', tooltip: 'Skip to First'},
                            skipToPrevious: {klasses: [], label: '⇤', tooltip: 'Skip to Previous'},
                            playPause: {
                                klasses: [],
                                label: {play: '▸', pause: '‖'},
                                tooltip: 'Play/Pause'
                            },
                            skipToNext: {klasses: [], label: '⇥', tooltip: 'Skip to Next'},
                            skipToLast: {klasses: [], label: '⇛', tooltip: 'Skip to Last'},
                        },
                    }
                },
                // event options
                events: {
                    // event namespacing
                    namespace: 'media-control-',
                    // event names
                    names: {
                        // emmitted when the skip to first button is pressed
                        skipToFirst: 'skip-to-first',
                        // emmitted when the skip to previous button is pressed
                        skipToPrevious: 'skip-to-previous',
                        // emmitted when the play/paused button is pressed such that it
                        // toggles to 'play' mode
                        play: 'play',
                        // emmitted when the play/paused button is pressed such that it
                        // toggles to 'pause' mode
                        pause: 'pause',
                        // emmitted when the skip to next button is pressed
                        skipToNext: 'skip-to-next',
                        // emmitted when the skip to last button is pressed
                        skipToLast: 'skip-to-last'
                    }
                }
            };
            this.options = jQuery.extend(true, {}, defaultOpions, opts);

            // build the elements for the media controls
            this._initialiseGUI();
            // set up event handling on the media controls
            this._initialiseEvents();
        }

        /**
         * Force the controls into 'playing' state
         *
         * @param fireEvent if false (default) no corresponding event will be fired. If true, a
         * 'play' event will be fired if the controls were previously in a paused state.
         * @return {ns.MediaControls}
         */
        setPlaying(fireEvent = false) {
            if (this.isPaused()) {
                // currently paused, toggle to playing
                this._setPlaying(true);
                let buttonOptions = this.options.toolbar.buttonGroup.buttons;
                // while playing, the label is set to the pause label (because that is the action
                // that will happen if the user clicks the button)
                this.$playPause.html(buttonOptions.playPause.label.pause);
                if (fireEvent) {
                    this._firePlayEvent();
                }
            }
            return this;
        }

        /**
         * Force the controls into 'paused' state
         *
         * @param fireEvent if false (default) no corresponding event will be fired. If true, a
         * 'pasue' event will be fired if the controls were previously in a playing state.
         * @return {ns.MediaControls}
         */
        setPaused(fireEvent = false) {
            if (this.isPlaying()) {
                // currently playing, toggle to paused
                this._setPaused(true);
                let buttonOptions = this.options.toolbar.buttonGroup.buttons;
                // while paused, the label is set to the play label (because that is the action
                // that will happen if the user clicks the button)
                this.$playPause.html(buttonOptions.playPause.label.play);
                if (fireEvent) {
                    this._firePauseEvent();
                }
            }
            return this;
        }

        /**
         * Determine if the controls are in a paused state
         *
         * @return {boolean} true if the controls are in a paused state, false otherwise
         */
        isPaused() {
            let dataKey = ns.MediaControls.DATA_IS_PLAYING();
            return this.$playPause.data(dataKey) !== true;
        }

        /**
         * Determine if the controls are in a playing state
         *
         * @return {boolean} true if the controls are in a playing state, false otherwise
         */
        isPlaying() {
            return !this.isPaused();
        }

        /**
         * Creates the DOM elements which make up the media controls, assembles them, and inserts
         * them into the container.
         *
         * @private
         */
        _initialiseGUI() {
            // create DOM elements
            // outer container
            let toolbarOptions = this.options.toolbar;
            let $toolbar = jQuery('<div role="toolbar" aria-label="media controls" style="display:inline-block;" />')
                .addClass(toolbarOptions.klasses.join(' '));

            // button group
            let buttonGroupOptions = toolbarOptions.buttonGroup;
            let $buttonGroup = jQuery('<div role="group" aria-label="media controls" />')
                .addClass(buttonGroupOptions.klasses.join(' '));

            // buttons
            let buttonOptions = buttonGroupOptions.buttons;
            let buttonHtml = '<button></button>';
            this.$skipToFirst = jQuery(buttonHtml)
                .html(buttonOptions.skipToFirst.label)
                .attr('title', buttonOptions.skipToFirst.tooltip)
                .addClass(buttonOptions.skipToFirst.klasses.join(' '));
            this.$skipToPrevious = jQuery(buttonHtml)
                .html(buttonOptions.skipToPrevious.label)
                .attr('title', buttonOptions.skipToNext.tooltip)
                .addClass(buttonOptions.skipToPrevious.klasses.join(' '));
            this.$playPause = jQuery(buttonHtml)
                .html(buttonOptions.playPause.label.play)
                .attr('title', buttonOptions.playPause.tooltip)
                .addClass(buttonOptions.playPause.klasses.join(' '));
            this.$skipToNext = jQuery(buttonHtml)
                .html(buttonOptions.skipToNext.label)
                .attr('title', buttonOptions.skipToNext.tooltip)
                .addClass(buttonOptions.skipToNext.klasses.join(' '));
            this.$skipToLast = jQuery(buttonHtml)
                .html(buttonOptions.skipToLast.label)
                .attr('title', buttonOptions.skipToLast.tooltip)
                .addClass(buttonOptions.skipToLast.klasses.join(' '));


            // assemble DOM elements
            $toolbar.append($buttonGroup);
            $buttonGroup.append(
                this.$skipToFirst, this.$skipToPrevious,
                this.$playPause,
                this.$skipToNext, this.$skipToLast
            );

            // add to container (after first clearing out any existing content)
            this.$container.empty().append($toolbar);

            // make sure we start off in a paused state (button will show play indicator)
            this._setPaused(true);
        }

        /**
         * Initialises event handling for the various buttons when they are clicked
         *
         * @private
         */
        _initialiseEvents() {
            // these buttons just fire events
            this.$skipToFirst.on('click', this._fireSkiptToFirstEvent.bind(this));
            this.$skipToPrevious.on('click', this._fireSkiptToPreviousEvent.bind(this));
            this.$skipToNext.on('click', this._fireSkiptToNextEvent.bind(this));
            this.$skipToLast.on('click', this._fireSkiptToLastEvent.bind(this));
            // the play/pause button also fires events, but which event depends on the current
            // state, so there is a bit of extra handling for this button click provided by
            // the _playPauseClickHandler(...) method
            this.$playPause.on('click', this._playPauseClickHandler.bind(this));
        }

        /**
         * Set the state of the controls to the paused state
         *
         * NOTE: No events are fired if this method is called.
         *
         * @param isPaused if true, ste to the paused state, otherwise set to playing
         * @return {ns.MediaControls}
         * @private
         */
        _setPaused(isPaused) {
            return this._setPlaying(!isPaused);
        }

        /**
         * Set the state of the controls to the playing state
         *
         * NOTE: No events are fired if this method is called.
         *
         * @param isPlaying if true, ste to the paused state, otherwise set to playing
         * @return {ns.MediaControls}
         * @private
         */
        _setPlaying(isPlaying) {
            let dataKey = ns.MediaControls.DATA_IS_PLAYING();
            this.$playPause.data(dataKey, isPlaying);
            return this;
        }

        /**
         * Handler for when the play pause button is clicked - it updates the internal state and
         * fires off an appropriate event
         *
         * @return {ns.MediaControls}
         * @private
         */
        _playPauseClickHandler() {
            if (this.isPaused()) {
                // set the state to playing and fire off the playing event
                return this.setPlaying(true);
            }
            // set the state to paused and fire off the paused event
            return this.setPaused(true);
        }

        /**
         * Utility method to create 'namespaced' event names for the timeline
         *
         * @param eventName the name of the event
         * @return {string} the 'namespaced' event name
         * @private
         */
        _makeEventName(eventName) {
            return this.options.events.namespace + eventName;
        }

        /**
         * Utility method to fire a custom event when skip to first is pressed
         *
         * @return {ns.MediaControls}
         * @private
         */
        _fireSkiptToFirstEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.skipToFirst), {});
        }

        /**
         * Utility method to fire a custom event when skip to previous is pressed
         *
         * @return {ns.MediaControls}
         * @private
         */
        _fireSkiptToPreviousEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.skipToPrevious), {});
        }

        /**
         * Utility method to fire a custom event when play is pressed
         *
         * @return {ns.MediaControls}
         * @private
         */
        _firePlayEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.play), {});
        }

        /**
         * Utility method to fire a custom event when play is pressed
         *
         * @return {ns.MediaControls}
         * @private
         */
        _firePauseEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.pause), {});
        }

        /**
         * Utility method to fire a custom event when skip to next is pressed
         *
         * @return {ns.MediaControls}
         * @private
         */
        _fireSkiptToNextEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.skipToNext), {});
        }

        /**
         * Utility method to fire a custom event when skip to last is pressed
         *
         * @return {ns.MediaControls}
         * @private
         */
        _fireSkiptToLastEvent() {
            return this._fireEvent(this._makeEventName(this.options.events.names.skipToLast), {});
        }

        /**
         * Utility method to fire a custom event
         *
         * @param eventName the name of the event
         * @param eventProperties any properties which should be available from the event
         * @return {ns.Timeline}
         * @private
         */
        _fireEvent(eventName, eventProperties = {}) {
            let event; // The custom event that will be created
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent(eventName, true, true);
            } else {
                event = document.createEventObject();
                event.eventType = eventName;
            }

            event.eventName = eventName;
            event.timeline = this;
            jQuery.extend(event, eventProperties);

            if (document.createEvent) {
                this.container.dispatchEvent(event);
            } else {
                this.container.fireEvent("on" + event.eventType, event);
            }
            return this;
        }

        /**
         * Internal static method to provide the key for data on the widget indicating play/pause
         * status
         *
         * @return {string} the key to obtain data off the DOM element as to whether the controls
         * are in a playing state or not
         * @constructor
         */
        static DATA_IS_PLAYING() {
            return 'is_playing';
        }
    };
}(window.portal, jQuery));

(function(ns, jQuery) {
    /**
     * A table to display anamolies with sorting capabilities
     *
     * Requires DataTables (https://datatables.net/) with the `Select` extension
     *
     * Anomalies are expected to be objects with, at a minimum, the following accessible
     * properties (any other properties are currently ignored):
     *
     *   - start the start timestamp of the anomaly as an epoch time in milliseconds
     *   - end the end timestamp of the anomaly as an epoch time in milliseconds
     *   - duration the duration of the anomaly in milliseconds
     *   For example:
     *       {start:12345678, end:23456789: duration:54321}
     */
    ns.AnomalyTable = class{
        constructor(container, opts={}){
            this.container = container;
            this.$container = $(this.container);

            let defaultOptions = {
                // table size
                size:{height:400},
                // table properties
                table:{
                    // message to show when a search returns no results
                    emptySearch:    'No anomalies to show.',
                    // message to show when the table has no anomalies
                    emptyMessage:   'No anomalies.',
                    // format of the message at the bottom of the table indicating how many
                    // items are being shown
                    showingMessage: 'Showing _START_ to _END_ of _TOTAL_ anomalies',
                    // format of message indicating how many items are currently selected
                    selectMessage:  '%d anomalies selected',
                    // (Bootstrap3) classes to apply to the <table> element for styling purposes
                    klasses:['table', 'table-condensed', 'table-bordered', 'table-hover'],
                    // column options
                    columns: {
                        // column classes
                        headings: {
                            // prefix for column classes
                            klassPrefix: 'anomaly-',
                            // suffixes for column classes
                            camera: {klass: 'camera'},
                            start: {klass: 'start'},
                            end: {klass: 'end'},
                            duration: {klass: 'duration'}
                        },
                        visibility: {
                            camera: true,
                            start: true,
                            end: true,
                            duration: true
                        },
                    },
                    // row options
                    rows:{
                        // function to use to generate row IDs (i.e., the `id` attribute of `<tr>`
                        // elements in the `<table>`
                        rowID:ns.AnomalyTable._defaultRowID,
                        // selection model - one of 'single', 'multi' or 'os' (if you want multiple
                        // selection 'os' is probably the option you are after)
                        selection:'single'
                    }
                },
                // data options
                data:{
                    // data keys for anomaly objects which populate the table
                    keys:{
                        // key to obtain the start value
                        start:'start',
                        // key to obtain the end value
                        end:'end',
                        // key to obtain the duration value
                        duration:'duration',
                        // key to obtain the camera name
                        cameraName:'camera_name',
                    },
                    // data renderers/formatters
                    renderers:{
                        // timestamps
                        cameraName:ns.AnomalyTable._defaultCameraNameRenderer,
                        // timestamps
                        start: ns.AnomalyTable._defaultTimestampRenderer,
                        end: ns.AnomalyTable._defaultTimestampRenderer,
                        // durations
                        duration:ns.AnomalyTable._defaultDurationRenderer
                    }
                },
                // event options
                events:{
                    // event namespacing
                    namespace:'anomaly-table-',
                    // event names
                    names:{
                        // selection event
                        select:'select'
                    }
                }
            };
            this.options = jQuery.extend(true, {}, defaultOptions, opts);

            console.log('portal-ui AnomalyTable options',this.options);

            // sanitize the size options in the case that it's just a numeric value and assume
            // that `px` units are to be used if so.
            let tableSize = this.options.size;
            if(typeof(tableSize.height) === 'number'){
                tableSize.height = tableSize.height+'px';
            }
            if(typeof(tableSize.width) === 'number'){
                tableSize.width = tableSize.width+'px';
            }

            // set up the table
            let tableOptions = this.options.table;
            this.tableKlasses = tableOptions.klasses.join(' ');
            let columnOptions = tableOptions.columns;
            let headingOptions = columnOptions.headings;
            let klassPrefix = headingOptions.klassPrefix || 'anomaly';
            this.cameraColumnKlass = klassPrefix + (headingOptions.camera.klass || 'camera');
            this.startColumnKlass = klassPrefix + (headingOptions.start.klass || 'start');
            this.endColumnKlass = klassPrefix + (headingOptions.end.klass || 'end');
            this.durationColumnKlass = klassPrefix + (headingOptions.duration.klass || 'duration');
            this.cameraColumnTitle = headingOptions.camera.Title || 'Camera';
            this.startColumnTitle = headingOptions.start.Title || 'Start';
            this.endColumnTitle = headingOptions.end.Title || 'End';
            this.durationColumnTitle = headingOptions.duration.Title || 'Duration';
            let $table = this._createTable();

            let dataOptions = this.options.data;
            let dataKeys = dataOptions.keys;
            let dataRenderers = dataOptions.renderers;
            this.cameraDataKey = dataKeys.camera || 'camera';
            this.startDataKey = dataKeys.start || 'start';
            this.endDataKey = dataKeys.end || 'end';
            this.durationDataKey = dataKeys.duration|| 'duration';
            this.groupDataKey = dataKeys.group;

            let rowOptions = tableOptions.rows;

            // set up the DataTable options
            let dataTableOptions = {
                paging:false,
                searching:false,
                scrollY:tableSize.height,
                scrollCollapse:false,
                scroller: true,
                deferRender: true,
                select:{ style: rowOptions.selection },
                language:{
                    emptyTable: tableOptions.emptyMessage,
                    infoEmpty:  tableOptions.emptySearch,
                    info:       tableOptions.showingMessage,
                    select: {
                        rows: {
                            _: tableOptions.selectMessage,
                        }
                    }
                },
                rowId: this.getRowID.bind(this),
                createdRow: function (row, data, dataIndex) {
                    /*
                    if(data.slot !== undefined){
                        $(row).addClass('density'+data.slot);
                    }
                    */
                },
                // column indices - also see _createTable() for generated HTML
                // [0]:camera name   [1]:start   [2]:end   [3]:duration
                // initially order by start, then by end, then by duration, then by camera name
                order: [[1, 'asc'],[2, 'asc'],[3, 'asc'],[0, 'asc']],
                columnDefs: [
                    {
                        // camera column renders camera name
                        targets:[this.cameraColumnKlass], data:this.cameraDataKey,
                        visible:columnOptions.visibility.camera,
                        render: dataRenderers.cameraName.bind(this),
                        createdCell:function(td, cellData, rowData, row, col) {
                            $(td)
                                // tooltip showing whole camera name
                                .attr('title',cellData)
                                // ensure ellipsis truncated camera name to prevent text overflow
                                .css({textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden',maxWidth:'10em'});
                        }
                    },
                    {
                        // start column renders epoch timestamp to human readable date/time
                        targets:[this.startColumnKlass], data:this.startDataKey,
                        visible:columnOptions.visibility.start,
                        render: dataRenderers.start.bind(this)
                    },
                    {
                        // end column renders epoch timestamp to human readable date/time
                        targets:[this.endColumnKlass], data:this.endDataKey,
                        visible:columnOptions.visibility.end,
                        render: dataRenderers.end.bind(this)
                    },
                    {
                        // end column renders milliseconds duration to human friendly duration
                        targets:[this.durationColumnKlass], data:this.durationDataKey,
                        visible:columnOptions.visibility.duration,
                        render: dataRenderers.duration.bind(this)
                    }
                ]
            };
            // only group if a groupKey is defined
            if (this.groupDataKey) {
              dataTableOptions.rowGroup = {
                dataSrc: this.groupDataKey
              }
            }
            // we have to add the table to the DOM before initialising the DataTable functionality
            this.$container.append($table);
            // initialise the DataTable functionality
            this.$anomalyTable = $table.DataTable(dataTableOptions);

            // initialise event handling
            this._initEvents();
        }

        /**
         * Method used to generate DOM IDs for anomaly table rows (used internally)
         *
         * @param anomaly the item from which to generate the row ID
         * @return {*} the row ID
         */
        getRowID(anomaly){
            // delegates to the configured function
            return this.options.table.rows.rowID(anomaly);
        }

        /**
         * Remove all anomalies from the table
         */
        clear(){
            this.$anomalyTable.rows().remove().draw();
        }

        /**
         * Sets the anomalies to be displayed on the table.
         *
         * NOTE: Any anomalies currently displayed on the table will be removed.
         * @param anomalies the anomalies to populate the able with. Anomalies are expected to be
         *        objects with the following accessible properties:
         *         - start the start timestamp of the anomaly as an epoch time in milliseconds
         *         - end the end timestamp of the anomaly as an epoch time in milliseconds
         *         - duration the duration of the anomaly in milliseconds
         *        For example: {start:12345678, end:23456789: duration:54321}
         *        See also the `data` options in the configuration to customise this if required.
         */
        setAnomalies(anomalies){
            this.$anomalyTable.rows().remove().rows.add(anomalies).draw();
        }

        /**
         * Programmatically select an anomaly on the table
         *
         * @param anomalies the anomalies to be selected
         * @param scrollTo if true (default) the table will be scrolled so that the earliest
         * selected anomaly's row is visible. If false, the table will not be scrolled (so the
         * anomaly may not be visible if it is currently scrolled out of view)
         */
        select(anomalies, scrollTo=true){
            this.deselectAll();
            if(anomalies === null || anomalies === undefined || (jQuery.isArray(anomalies) && anomalies.length === 0))
            {
                // null, undefined or empty array was provided - deselect everything and finish
                return;
            }

            if(!jQuery.isArray(anomalies)){
                anomalies = [anomalies];
            } else {
                // sort anomalies chronologically
                anomalies = anomalies.sort(function(a,b){return a.start - b.start;});
            }

            if(anomalies.length > 0){
                for(let idx=0; idx<anomalies.length; idx++){
                    let anomaly = anomalies[idx];
                    let rowID = this.getRowID(anomaly);
                    let row = this.$anomalyTable.row('#'+rowID);
                    row.select();
                }

                if(scrollTo){
                    this.scrollTo(anomalies[0]);
                }
            }
        }

        /**
         * Programmatically scroll the table to a specific anomaly so that it is visible
         *
         * @param anomaly the anomaly to scroll to
         * @param transition if true, the scroll will be a smooth transition, otherwise the scroll
         * will be 'instant' with no transition
         */
        scrollTo(anomaly, transition=true){
            if(anomaly === null) {
                // null was provided
                return;
            }

            let rowID = this.getRowID(anomaly);
            let row = this.$anomalyTable.row('#'+rowID);
            row.node().scrollIntoView({
                behavior:(transition?'smooth':'instant'),
                block:'center'
            });
        }

        /**
         * Deselects all anomalies
         */
        deselectAll(){
            this.$anomalyTable.rows().deselect();
        }

        /**
         * Obtain the selected anomaly, or null if no anomaly is currently selected
         * @return {null} the selected anomaly, or null if no anomaly is currently selected
         */
        getSelected(){
            let selectedRows = this.$anomalyTable.rows({selected: true});
            return selectedRows.data();
        }

        /**
         * Obtain the DataTable instance which supports this table
         * @return {*}
         */
        getDataTable(){
            return this.$anomalyTable;
        }
        /**
         * Internal method used to initialise event handling
         * @private
         */
        _initEvents(){
            // table row selection handling
            this.$anomalyTable.on('select', function (e, dt, type, indexes) {
                if (type === 'row') {
                    let selectedAnomalies = [];
                    for(let idx=0; idx<indexes.length; idx++){
                        let index = indexes[idx];
                        // grab the anomaly from that row
                        let anomaly = this.$anomalyTable.row(index).data();
                        selectedAnomalies.push(anomaly);
                    }
                    this._fireSelectEvent(selectedAnomalies);
                }
            }.bind(this));
        }

        /**
         * Internal method used to create the DOM element structure used for the table
         *
         * @return {jQuery|HTMLElement} the constructed HTML <table> element set up with the
         * required <thead> and <tbody> elements and headings etc.
         * @private
         */
        _createTable(){
            // table element
            let $table = $('<table id="'+this.tableID+'" class="'+this.tableKlasses+'"></table>');

            // table header, with headings for the columns
            let $tableHeader = $('<thead></thead>');
            let $tableHeaderRow = $('<tr></tr>');
            let $tableCameraHeading = $('<th class="'+this.cameraColumnKlass+'">'+this.cameraColumnTitle+'</th>');
            let $tableStartHeading = $('<th class="'+this.startColumnKlass+'">'+this.startColumnTitle+'</th>');
            let $tableEndHeading = $('<th class="'+this.endColumnKlass+'">'+this.endColumnTitle+'</th>');
            let $tableDurationHeading = $('<th class="'+this.durationColumnKlass+'">'+this.durationColumnTitle+'</th>');

            // table body
            let $tableBody = $('<tbody></tbody>');

            // assemble the team!
            $tableHeaderRow.append($tableCameraHeading, $tableStartHeading, $tableEndHeading, $tableDurationHeading);
            $tableHeader.append($tableHeaderRow);
            $table.append($tableHeader, $tableBody);

            return $table;
        }

        /**
         * Internal method to construct class names for the headers/columns of the table
         *
         * @param suffix the suffix for the heading class (which is basically the name of the
         *        column, such as 'start', 'end' or 'duration')
         * @return {string} the class name to use for the table column
         * @private
         */
        _headingClass(suffix){
            return this.table.headings.classPrefix+'-'+suffix;
        }

        /**
         * Internal method used to render anomaly timestamps
         *
         * @param data the data (anomaly) from which to render the timestamp
         * @param type the type of the data
         * @param row the row to which the data belongs
         * @return {*}
         * @private
         */
        _renderCameraName(data, type, row) {
            let renderer = this.options.data.renderers.cameraName;
            return ns.AnomalyTable._customRender(renderer, data, type, row);
        }
        /**
         * Internal method used to render anomaly timestamps
         *
         * @param data the data (anomaly) from which to render the timestamp
         * @param type the type of the data
         * @param row the row to which the data belongs
         * @return {*}
         * @private
         */
        _renderTimestamp(data, type, row) {
            let renderer = this.options.data.renderers.timestamp;
            return ns.AnomalyTable._customRender(renderer, data, type, row);
        }
        /**
         * Internal method used to render anomaly durations
         *
         * @param data the data (anomaly) from which to render the duration
         * @param type the type of the data
         * @param row the row to which the data belongs
         * @return {*}
         * @private
         */
        _renderDuration(data, type, row) {
            let renderer = this.options.data.renderers.duration;
            return ns.AnomalyTable._customRender(renderer, data, type, row);
        }

        /**
         * Utility method to create 'namespaced' event names for the timeline
         *
         * @param eventName the name of the event
         * @return {string} the 'namespaced' event name
         * @private
         */
        _makeEventName(eventName){
            return this.options.events.namespace + eventName;
        }
        /**
         * Utility method to fire a custom event when the table selection changes
         *
         * @param anomalies the anomalies which are selected
         * @return {ns.Timeline}
         * @private
         */
        _fireSelectEvent(anomalies){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.select),
                {anomalies:anomalies}
            );
        }
        /**
         * Utility method to fire a custom event
         *
         * @param eventName the name of the event
         * @param eventProperties any properties which should be available from the event
         * @return {ns.Timeline}
         * @private
         */
        _fireEvent(eventName, eventProperties={}){
            let event; // The custom event that will be created
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent(eventName, true, true);
            } else {
                event = document.createEventObject();
                event.eventType = eventName;
            }

            event.eventName = eventName;
            event.timeline = this;
            jQuery.extend(event, eventProperties);

            if (document.createEvent) {
                this.container.dispatchEvent(event);
            } else {
                this.container.fireEvent("on" + event.eventType, event);
            }
            return this;
        }
        /**
         * Internal method which generates anomaly row IDs in the event that a custom one is not
         * supplied during initialisation
         *
         * @param data the data item from which to generate the row ID
         * @private
         * @static
         */
        static _defaultRowID(data){
            return 'anomaly-'+data.pk;
        }
        /**
         * Internal method which generates camera names in the event that a custom one is not
         * supplied during initialisation
         *
         * @param data
         * @private
         * @static
         */
        static _defaultCameraNameRenderer(data){
            let maxLength = 15;
            if(data.length < maxLength){
                return data;
            }
            let halfLength = Math.round(maxLength/2.0);
            return data.substr(0,halfLength)+'…'+data.substr(data.length-halfLength);
        }
        /**
         * Internal method which generates anomaly timestamps in the event that a custom one is not
         * supplied during initialisation
         *
         * @param data
         * @private
         * @static
         */
        static _defaultTimestampRenderer(data){
            return moment(parseInt(data, 10)).format('HH:mm:ss YYYY/MM/DD');
        }
        /**
         * Internal method which generates anomaly durations in the event that a custom one is not
         * supplied during initialisation
         *
         * @param data
         * @private
         * @static
         */
        static _defaultDurationRenderer(data){
            return portal.DateTimeUtils.humanizedDuration(data, {
                forceFull: true,
                year: {singular: 'yr', plural: 'yrs'},
                week: {singular: 'wk', plural: 'wks'},
                month: {singular: 'mon', plural: 'mon'},
                day: {singular: 'day', plural: 'days'},
                hour: {singular: 'hr', plural: 'hrs'},
                minute: {singular: 'min', plural: 'mins'},
                second: {singular: 'sec', plural: 'secs'}
            });
        }

        /**
         * Internal method used for formatting data on the table
         *
         * @param type
         * @return {*}
         * @static
         */
        static isForDisplayOrFilter(type){
            return (type === 'display' || type === 'filter');
        }

        /**
         * Internal method to determine the kind of renderer required to provide the data in the
         * correct format (for display, filtering, sorting, etc...)
         *
         * @param renderer the renderer function, which takes the `data` parameter as an argument
         *        (refer to the DataTables documentation, or the  _defaultTimestampRenderer() and
         *        _defaultDurationRenderer() for examples)
         * @param data the data to be rendered
         * @param type the tpe of the data (refer to the DataTables documentation)
         * @param row the row in which the data belongs
         * @return {*} the rendered data
         * @private
         * @static
         */
        static _customRender(renderer, data, type, row){
            if(!jQuery.isFunction(renderer)){
                // there's no renderer function - just give back the data
                return data;
            }

            if (ns.AnomalyTable.isForDisplayOrFilter(type)) {
                // If display or filter data is requested, format the value
                return renderer(data);
            }

            // Otherwise the data type requested (`type`) is type detection or sorting
            // data, for which we want to use the original value, so we just need to
            // return that, unaltered
            return data;
        }
    };
}(window.portal, jQuery));

(function(ns, jQuery) {
    /**
     * A slider widget to control video playback speeds, as per the UX spec in GEN2-177
     *
     * Requires noUiSlider (https://refreshless.com/nouislider/)
     */
    ns.PlaybackSpeedSlider = class{
        /**
         * Create a new playback speed control slider
         *
         * @param container the DOM element (usually a `<div>` element) to contain the slider
         * @param playbackRates an array of playback rate specifiers in the form
         *        [
         *           {rate: <float>, label: TEXT},
         *           {rate: <float>, label: TEXT},
         *           ...
         *        ]
         *        For example:
         *        [
         *           {rate: 0.5, label: '½×'},
         *           {rate: 1.0, label: '1×'},
         *           {rate: 2.0, label: '2×'}
         *        ]
         * @param opts other options
         */
        constructor(container, playbackRates, opts={}){
            this.container = container;
            this.$container = $(this.container);

            this.playbackRates = playbackRates;

            let defaultOptions = {
                events:{
                    namespace:'playback-speed-slider-',
                    names:{
                        change:'change'
                    }
                }
            };
            this.options = jQuery.extend({}, defaultOptions, opts);

            // initialise playback rate selector
            let sliderRange = {
                min:0,
                max:this.playbackRates.length-1
            };
            if(this.playbackRates.length>2) {
                let pctStep = (100 / (this.playbackRates.length - 1));
                let pct = pctStep;
                for (let idx = 1; idx < this.playbackRates.length - 1; idx++) {
                    sliderRange[pct + '%'] = idx;
                    pct += pctStep;
                }
            }
            noUiSlider.create(this.container, {
                start: [3],
                snap:true,
                range: sliderRange,
                connect: [false, false],
                tooltips: true,
                format: {
                    to:function(value){
                        // to tooltip label
                        return this.playbackRates[value].label;
                    }.bind(this),
                    from:function(value){ return value; }
                },
                pips: {
                    mode: 'range',
                    density: 100, // prevent 'minor' ticks (pips for 'major' ticks only)
                    format: {
                        to:function(value){
                            // to tick label
                            return this.playbackRates[value].label;
                        }.bind(this),
                        from:function(value){ return value; }
                    },
                }
            });

            // make tick values under slider clickable
            this.$container.find('.noUi-value').each(function(idx, elm){
                $(elm).css({cursor:'pointer'})
                    .on('click', function(evt){
                        let value = Number(evt.target.getAttribute('data-value'));
                        this.container.noUiSlider.set(value);
                    }.bind(this));
            }.bind(this));

            // fire change event on slider value changes
            this.container.noUiSlider.on('update', function(labels, type, values){
                this._fireChangeEvent(values[0]);
            }.bind(this));
        }

        setRate(rateIndex){

        }

        /**
         * Utility method to create 'namespaced' event names for the timeline
         *
         * @param eventName the name of the event
         * @return {string} the 'namespaced' event name
         * @private
         */
        _makeEventName(eventName){
            return this.options.events.namespace + eventName;
        }

        /**
         * Utility method to fire a custom event when the slider value changes
         *
         * @param idx the selectect value index
         * @return
         * @private
         */
        _fireChangeEvent(idx){
            return this._fireEvent(
                this._makeEventName(this.options.events.names.change),
                {index:idx, playbackRate:this.playbackRates[idx]}
            );
        }

        /**
         * Utility method to fire a custom event
         *
         * @param eventName the name of the event
         * @param eventProperties any properties which should be available from the event
         * @return {ns.PlaybackSpeedSlider}
         * @private
         */
        _fireEvent(eventName, eventProperties={}){
            let event; // The custom event that will be created
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent(eventName, true, true);
            } else {
                event = document.createEventObject();
                event.eventType = eventName;
            }

            event.eventName = eventName;
            event.timeline = this;
            jQuery.extend(event, eventProperties);

            if (document.createEvent) {
                this.container.dispatchEvent(event);
            } else {
                this.container.fireEvent("on" + event.eventType, event);
            }
            return this;
        }
    };
}(window.portal, jQuery));

(function() {
    "use strict";

    /**
     * Initialisation of various "common" JavaScript enabled page elements on page load
     */
    $(document).ready(function(){
        // bootstrap tooltips http://getbootstrap.com/javascript/#tooltips
        $('.js-tooltip').tooltip();

        // bootstrap popovers - http://getbootstrap.com/javascript/#popovers
        $('.js-popover').popover();

        // select2 dropdowns
        $('select.js-select2, .js-select2-wrapper > select').select2(
            {minimumResultsForSearch: 20}
        );

        // select2 tags
        $('select.js-select2-tags, .js-select2-tags-wrapper > select').select2(
            {tags: true, tokenSeparators: [',', ' ']}
        );

        // ION range slider - https://github.com/IonDen/ion.rangeSlider
        // $(".js-rangeslider").ionRangeSlider({/*options*/});

        // Bootstrap switch checkbox box plugin - http://bootstrapswitch.com/
        $('input.js-bs-switch').bootstrapSwitch();

        // Bootstrap date time picker plugin
        $('.js-bs-datetimepicker').datetimepicker();

        // date pickers
        $('.js-date-picker').each(function(idx, dateField){
            // date input field
            let $dateField = $(dateField);
            let parentEl = $dateField.parents('.modal');
            let pickerOptions = {locale:{format:'YYYY-MM-DD'}};
            if(parentEl.length > 0) {
                // the following prevents the selector drop downs from disappearing as soon as
                // they are clicked if the  picker field is within a modal
                pickerOptions.parentEl = parentEl.get(0);
            }
            let picker = new window.portal.FieldUtils.DatePicker(dateField, pickerOptions).getPicker();
            // allow any field input group 'addons' to also trigger the picker - see:
            // https://getbootstrap.com/docs/3.3/components/#input-groups
            $dateField.siblings('.input-group-addon')
                .css({cursor: 'pointer'})
                .on('click', function(){picker.show();});
        });

        // file input plugin - http://plugins.krajee.com/file-input
        $('input[type="file"].js-fileinput').fileinput({
            showCaption: false
        });

        // Sidebar functionality
        // Main nav menus show/hide sub-content on click
        let navClick = $('.js-show-child-nav');
        let showChildNav = $('.js-open-nav');
        $(navClick).on('click', function (e) {
            e.preventDefault();
            // slideup siblings nav child menu if any open
            $(this).parent().siblings().find(showChildNav).slideUp(200);
            $(this).parent().siblings().find(navClick).removeClass('nav-open');
            // add class and slide down nav child menu when clicked
            $(this).toggleClass('nav-open');
            $(this).siblings(showChildNav).slideToggle(200);
        });
        // Sidebar width collapse when the window resizes to below a certain width threshold (or is
        // displayed on a mobile device)
        // these values correspond to with Bootstrap's media cutoff thresholds - see the media
        // queries breakpoint section of Bootstrap's _variables.scss source file for full
        // details (more specifically, refer to the definitions for the '$screen-*' family of
        // SCSS variables in this file).
        let bsMediaCutoffs = {
            xs: 480, sm: 768, md: 992, lg: 1200,
        };
        // we use a debounced window resize handler function to avoid "spamming" of events during
        // the resizing process, only updating once the sizing "stablizes".
        let $window = $(window);
        let debouncedWindowResizeHandler = portal.debounce(function() {
            // the width threshold *must* correspond to one of the Bootstrap thresholds, otherwise
            // we end up with (essentially) two competing grid sizing rules which leads to odd
            // visuals due to mismatched threshold trigger points.
            let threshold = (bsMediaCutoffs.md - 1);
            let windowIsNarrow = $window.width() < threshold;
            $('.js-collapsing-sidebar').toggleClass('collapse', windowIsNarrow);
        }, 150);
        // assign the resize handler, and immediately trigger a 'resize' event so that the sizing
        // function gets kicked off once to initialise things once the page is ready.
        $window.on('resize', debouncedWindowResizeHandler).trigger('resize');
    });
})();
