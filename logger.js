const fs = require('fs');
const util = require('util');
const logfileName = '/logs/full-log.txt';
const logfile = fs.createWriteStream(__dirname + logfileName, {flags : 'a+'});
const log_stdout = process.stdout;
const moment = require('moment')

logger = function(arguments) {
    let time = '[' + moment().format('YYYY:MM:DD h:mm:ss') + '] ';
    let timeInMilliseconds = moment().valueOf();
    logfile.write(time + util.format.apply(null, arguments) + '\n');
    log_stdout.write(time + util.format.apply(null, arguments) + '\n');
};

module.exports = logger;
