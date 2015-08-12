var moment = require('moment-timezone');
var assign = require('lodash/object/assign');

module.exports = function(ddb) {
  function form(request, reply, templateVars) {
    ddb.query(
      {
        TableName: 'waitingList',
        KeyConditionExpression: '#H = :value',
        ExpressionAttributeNames: {'#H': 'show'},
        ExpressionAttributeValues: {':value': {S: 'tnt'} },
        IndexName: 'getByShow'
      },
      function(err, response) {
        if (err) {
          console.log(err);
          reply.view('scheduleForm', {message: 'failed to get waiting list'});
          return;
        }

        templateVars = assign(
          {
            teams: response.Items,
            date: moment().tz('America/Los_Angeles').format('YYYY-MM-DD')
          },
          templateVars
        );

        reply.view('scheduleForm', templateVars);
      }
    );
  }

  function save(request, reply) {
    var date = moment(request.payload.date, 'America/Los_Angeles');

    ddb.putItem(
      {
        TableName: 'events',
        Item: {
          yearMonth: {S: date.format('YYYY-MM')},
          day: {N: date.format('D')},
          team1: {S: request.payload.team1},
          team2: {S: request.payload.team2},
          show: {S: 'tnt'}
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          reply.view('signUp', {message: 'waiting list entry failed'});
          return;
        }

        form(request, reply, {status: 'success', message: 'event created'});
      }
    );
  }

  return {
    form: form,
    save: save
  }
};