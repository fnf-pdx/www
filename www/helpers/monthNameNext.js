var moment = require('moment-timezone');

module.exports = function(month) {
  return moment(month, 'YYYY-MM').add(1, 'months').format('MMMM');
};