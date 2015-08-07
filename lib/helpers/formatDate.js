var moment = require('moment-timezone');

module.exports = function(timestamp) {
  return moment(timestamp, 'X').tz('America/Los_Angeles').format('MMMM D, YYYY h:mma');
};