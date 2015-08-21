var moment = require('moment-timezone');

module.exports = function(month) {
  return moment(month, 'YYYY-MM').subtract(1, 'months').format('MMMM');
};