/**
 * @namespace Log
 * @description A small logging library for JavaScript.
 */
var Log = {
    /**
     * Log level type definition
     * @memberOf! Log
     * @typedef {Object} LogLevel
     * @property {number} level level indicating log severity
     * @property {string} name identifying name for this level of logging
     */

    /**
     * @property LEVELS {LogLevel} a level of logging
     */
    LEVELS: {
        TRACE: {level: 0, name: 'TRACE'},
        DEBUG: {level: 1, name: 'DEBUG'},
        INFO: {level: 2, name: 'INFO'},
        WARN: {level: 3, name: 'WARN'},
        ERROR: {level: 4, name: 'ERROR'},
        FATAL: {level: 5, name: 'FATAL'}
    },

    /**
     * Returns calling info for the function doing the logging.
     *
     * @param {number} [callerOffset=0] an offset adjustment to the
     line in the error stack. This is useful for adjustments for functions
     logging on the behalf of other functions, for example, PK.Assert.*
     functions.
     * @return {String} stack trace line corresponding to the function
     calling the log function
     */
    getCallerInfo: function (callerOffset) {
        try {
            throw Error('')
        } catch (err) {
            var caller_line = err.stack.split("\n")[5 + (callerOffset
                ? callerOffset : 0)];
            var index = caller_line.indexOf("at ");
            var clean = caller_line.slice(index + 2, caller_line.length);
            return clean;
        }
    },

    /**
     * Logs a message to the window.console if one exists for the browser.
     * The message is logged if the provided logLevel is higher than the
     * current Log.logLevel.
     *
     * @param { {level:number, name:String} } logLevel the log level to log at
     * @param {String} [msg=''] the message to log
     * @param {number} [callerOffset=0] an offset adjustment to the
     line in the error stack. This is useful for adjustments for functions
     logging on the behalf of other functions, for example, PK.Assert.*
     functions.
     *
     * @return {undefined}
     */
    log: function (logLevel, msg, callerOffset) {
        if (Log.logLevel === null || Log.logLevel.level === null) {
            //setting the logLevel to null effectively turns off logging
            return;
        }

        if (window.console && msg && logLevel && logLevel.level &&
            (logLevel.level >= Log.logLevel.level)) {
            var now = new Date();
            window.console.log(logLevel.name + ' [' +
                now.toUTCString() + '] --> ' +
                Log.getCallerInfo(callerOffset) + (msg ? '\n\t --> ' + msg :
                    ''));
        }
    },

    msg: function (msg) {
        var $output = $('#log4js');
        if ($output && $output.length) {
            $output.html(msg)
                .removeClass('fadeOutUp')
                .addClass('animated zoomIn');

            setTimeout(function () {
                $output.removeClass('zoomIn')
                    .addClass('fadeOutUp');
            }, 2000);
        }
    },

    /** Logs a Log.LEVELS.TRACE message.
     *
     * @param {String} [msg=''] the msg to log
     */
    trace: function (msg) {
        Log.log(Log.LEVELS.TRACE, (msg ? msg : ''));
    },

    /** Logs a Log.LEVELS.DEBUG message.
     *
     * @param {String} [msg=''] the msg to log
     */
    debug: function (msg) {
        Log.log(Log.LEVELS.DEBUG, (msg ? msg : ''));
    },

    /** Logs a Log.LEVELS.ERROR message.
     *
     * @param {String} [msg=''] the msg to log
     */
    error: function (msg) {
        Log.log(Log.LEVELS.ERROR, (msg ? msg : ''));
    },

    /**
     * Logs a Log.LEVELS.FATAL message.
     *
     * @param {String} [msg=''] the msg to log
     * @param {boolean} [throwEx=false] forces an exception to be
     thrown, if true
     * @param {String} [exPrefix=''] a prefix to prepend to the
     exception, if one is thrown
     */
    fatal: function (msg, throwEx, exPrefix) {
        var message = msg ? msg : '';

        Log.log(Log.LEVELS.FATAL, message);
        if (throwEx) {
            throw new Error((exPrefix ? exPrefix + ': ' : '') + message);
        }
    },

    /** Logs a Log.LEVELS.INFO message.
     *
     * @param {String} [msg=''] the msg to log
     * @param {boolean} [toScreen=false] flag indicating whether or not to display this message to the user as well
     */
    info: function (msg, toScreen) {
        msg = msg || '';

        Log.log(Log.LEVELS.INFO, msg);
        (toScreen || false) && Log.msg(msg);
    },

    /**
     *
     * @return {boolean} true if the current Log.logLevel is set
     to Log.LEVELS.DEBUG
     */
    isDebugEnabled: function () {
        if (!Log.logLevel || !Log.logLevel.level) {
            return false;
        }

        return (Log.logLevel.level == Log.LEVELS.DEBUG.level);
    },

    /** Logs a Log.LEVELS.WARN message.
     *
     * @param {String} [msg=''] the msg to log
     */
    warn: function (msg) {
        Log.log(Log.LEVELS.WARN, (msg ? msg : ''));
    },

    //setting the default logLevel like this allows us to do it before
    //Log is defined, otherwise we would use Log.LEVELS.ERROR
    logLevel: {level: 4, name: 'ERROR'}
};