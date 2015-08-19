var moment = require('moment-timezone');

module.exports = function(month) {
    return moment(month, 'YYYY-MM').format('MMMM');
};