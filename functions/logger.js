const bunyan = require('bunyan');
const fs = require('fs');
const obj = {};

const logFolder = process.env.LOG_FOLDER || './logs';

const logOptions = {
  name: 'makan-buddy',
  streams: [
    {
      level: "info",
      path: `${logFolder}/app.log`
    },
    {
      level: "error",
      path: `${logFolder}/error.log`
    },
    {
      level: "debug",
      stream: process.stdout
    }
  ]
};

if(!fs.existsSync(logFolder)) {
  fs.mkdir(logFolder)
}

if( !obj.log ){
  obj.log = bunyan.createLogger(logOptions);
}
module.exports = obj;
