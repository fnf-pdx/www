'use strict';

module.exports = function(teams) {
  return function(request, reply) {
    teams.getWaitingList('Thursday Night Throwdown', function(err, teams) {
      if (err) {
        console.log(err);
        return reply.view('waiting-list', {message: 'Could not retrieve waiting list'});
      }

      reply.view('waiting-list', {teams: teams});
    });
  };
};