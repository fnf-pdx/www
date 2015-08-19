var moment = require('moment-timezone');
var assign = require('lodash/object/assign');

module.exports = function(waitingList, events) {

  function form(request, reply, templateVars) {
    waitingList.getByShow('tnt', function(err, teams) {
      if (err) {
        reply.view('scheduleForm', {message: 'failed to get waiting list'});
        return;
      }

      templateVars = assign(
        {
          teams: teams,
          today: moment().tz('America/Los_Angeles').format('YYYY-MM-DD')
        },
        templateVars
      );

      reply.view('scheduleForm', templateVars);
    });
  }

  function save(request, reply) {
    var date = moment(request.payload.date, 'America/Los_Angeles');
    var team1 = request.payload.team1;
    var team2 = request.payload.team2;

    events.addEvent('tnt', date, team1, team2, function (err) {
      if (err) {
        return form(request, reply, {status: 'failed', message: 'waiting list entry failed'});
      }

      waitingList.deleteTeam(team1, function (err) {
        if (err) {
          return form(request, reply, {status: 'failed', message: 'failed to remove ' + team1 + ' from waiting list'});
        }

        waitingList.deleteTeam(team2, function (err) {
          if (err) {
            return form(request, reply, {
              status: 'failed',
              message: 'failed to remove ' + team2 + ' from waiting list'
            });
          }

          return form(request, reply, {status: 'success', message: 'event created'});
        });
      });
    });
  }

  return {
    form: form,
    save: save
  }
};