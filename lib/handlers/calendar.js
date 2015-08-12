var moment = require('moment-timezone');
var filter = require('lodash/collection/filter');
var get = require('lodash/object/get');
var chunk = require('lodash/array/chunk');

module.exports = function(ddb) {

  function render(request, reply) {
    var date = moment().tz('America/Los_Angeles');

    function makeWeeksInMonth(events) {
      var days = [];
      var daysInMonth = date.daysInMonth();
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
      console.log(days);

      return days;
    }

    ddb.query(
      {
        TableName: 'events',
        KeyConditionExpression: '#H = :value',
        ExpressionAttributeNames: {'#H': 'yearMonth'},
        ExpressionAttributeValues: {':value': {S: date.format('YYYY-MM')} }
      },
      function(err, response) {
        if (err) {
          console.log(err);
          reply.view('calendar', {message: 'failed to get events list'});
          return;
        }
        reply.view('calendar', {month: date.format('MMMM'), weeksInMonth: makeWeeksInMonth(response.Items)});
      }
    );
  }

  return {
    render: render
  }
};