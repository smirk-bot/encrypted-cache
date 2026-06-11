'use strict'
let logLevel = process.env.LOG_LEVEL || 'info';

const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Etc/GMT+5',
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

function getTimeStamp(timestamp = Date.now()) {
  return timestampFormatter.format(new Date(timestamp));
}

module.exports.error = (err)=>{
  console.error(`${getTimeStamp(Date.now())} ERROR [token-cache] ${err}`)
}
module.exports.info = (msg)=>{
  console.log(`${getTimeStamp(Date.now())} INFO [token-cache] ${msg}`)
}
module.exports.debug = (msg)=>{
  if(logLevel == 'debug') console.log(`${getTimeStamp(Date.now())} DEBUG [token-cache] ${msg}`)
}
