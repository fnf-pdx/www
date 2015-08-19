var moment = require('moment-timezone');
var chunk = require('lodash/array/chunk');
var get = require('lodash/object/get');
var filter = require('lodash/collection/filter');

module.exports = function(month, events) {
  var days = [];
  var daysInMonth = moment(month, 'YYYY-MM').daysInMonth();
  var i = 1;

  for (i = 1; i <= daysInMonth; i++) {
    var eventsOnDay = filter(events, function(event) {
      return i == get(event, 'day.N');
    });
    days.push({
      index: i,
      events: eventsOnDay
    });
  }
  days = chunk(days, 7);

  return days;
};
