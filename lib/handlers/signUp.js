var moment = require('moment-timezone');

module.exports = function(ddb) {

  function save(request, reply) {
    ddb.putItem(
      {
        TableName: 'waitingList',
        Item: {
          show: {S: 'tnt'},
          date: {N: moment().tz('America/Los_Angeles').unix().toString()},
          team: {S: request.payload.team}
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          reply.view('signUp', {message: 'waiting list entry failed'});
          return;
        }
        reply.redirect('/waiting-list');
      }
    );
  }

  return {
    save: save
  }
};