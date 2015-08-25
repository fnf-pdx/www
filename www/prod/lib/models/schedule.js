module.exports = function(ddb) {

  function addEvent(show, date, team1, team2, cb) {
    ddb.putItem(
      {
        TableName: 'events',
        Item: {
          date: {S: date.format('YYYY-MM-DD')},
          team1: {S: team1},
          team2: {S: team2},
          show: {S: show}
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          return cb(err);
        }
        return cb(null);
      }
    );
  }

  function getShowsForMonth(show, month, cb) {
    ddb.query(
      {
        TableName: 'events',
        KeyConditionExpression: '#hash = :show and begins_with(#range, :date)',
        ExpressionAttributeNames: {
          '#hash': 'show',
          '#range': 'date'
        },
        ExpressionAttributeValues: {
          ':show': {S: show},
          ':date': {S: month}
        }
      },
      function(err, response) {
        if (err) {
          console.log(err);
          return cb(err);
        }
        cb(null, response.Items);
      }
    );
  }

  return {
    addEvent: addEvent,
    getShowsForMonth: getShowsForMonth
  }
};