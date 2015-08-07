var moment = require('moment-timezone');

module.exports = function(ddb) {
  var waitingList = require('./waitingList')(ddb);

  function renderForm(request, reply) {
    reply.view('sign-up');
  }

  function saveTeam(request, reply) {
    var teamName = request.payload.name;

    ddb.putItem(
      {
        TableName: 'teams',
        Item: {
          name: {S: teamName}
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          reply.view('sign-up', {message: 'team creation failed'});
          return;
        }
        ddb.putItem(
          {
            TableName: 'waitingList',
            Item: {
              showName: {S: 'Thursday Night Throwdown'},
              signUpDate: {N: moment().tz('America/Los_Angeles').unix().toString()},
              teamName: {S: teamName}
            }
          },
          function(err) {
            if (err) {
              console.log(err);
              reply.view('sign-up', {message: 'waiting list entry failed'});
              return;
            }
            waitingList.list(request, reply);
          }
        );
      }
    );
  }

  return {
    renderForm: renderForm,
    saveTeam: saveTeam
  }
};