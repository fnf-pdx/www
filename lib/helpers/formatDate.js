var moment = require('moment-timezone');

module.exports = function(date) {
  return moment(date, 'YYYY-M-D H:m:s').format('h:mma on MMMM Do YYYY ');
};