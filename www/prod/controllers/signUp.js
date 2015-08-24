var moment = require('moment-timezone');

module.exports = function(waitingList) {

  function save(request, reply) {
    var team = request.payload.team;
    var show = 'tnt';
    var date = moment().tz('America/Los_Angeles');

    waitingList.addTeam(team, show, date, function(err) {
      if (err) {
        return reply.view('signUp', {message: 'waiting list entry failed'});
      }
      return reply.redirect('/waiting-list');
    });
  }

  return {
    save: save
  };
};