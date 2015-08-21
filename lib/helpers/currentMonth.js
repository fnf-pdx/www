var moment = require('moment-timezone');

module.exports = function(month) {
  if (month) {
    return month;
  }
  return moment().tz('America/Los_Angeles').format('YYYY-MM');
};