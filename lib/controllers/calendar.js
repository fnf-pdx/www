var moment = require('moment-timezone');
var addEventsToMonth = require('../../www/templates/helpers/addEventsToMonth'); // TODO move util/hydrateMonth into helper

module.exports = function(schedule) {

  function render(request, reply) {
    var month = request.params.month;

    if (!month) {
      moment().tz('America/Los_Angeles').format('YYYY-MM');
    }

    schedule.getShowsForMonth('tnt', month, function(err, events) {
      if (err) {
        return reply.view('calendar', {message: 'failed to get events list'});
      }
      return reply.view('calendar', {month: {date: month, weeks: addEventsToMonth(month, events)}});
    });
  }

  return {
    render: render
  }
};