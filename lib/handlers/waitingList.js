module.exports = function(waitingList) {
  function list(request, reply) {
    waitingList.getByShow('tnt', function(err, teams) {
      if (err) {
        return reply.view('waitingList', {message: 'failed to get waiting list'});
      }
      reply.view('waitingList', {teams: teams});
    });
  }

  return {
    list: list
  }
};