var moment = require('moment-timezone');

module.exports = function(ddb) {

  function addTeam(team, show, date, cb) {
    ddb.putItem(
      {
        TableName: 'waitingList',
        Item: {
          show: {S: show},
          date: {S: date.format('YYYY-MM-DD HH:mm:ss')},
          team: {S: team}
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

  function deleteTeam(team, cb) {
    ddb.deleteItem(
      {
        TableName: 'waitingList',
        Key: {team: {S: team}}
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

  function getByShow(show, cb) {
    ddb.query(
      {
        TableName: 'waitingList',
        KeyConditionExpression: '#H = :value',
        ExpressionAttributeNames: {'#H': 'show'},
        ExpressionAttributeValues: {':value': {S: show} },
        IndexName: 'getByShow'
      },
      function(err, response) {
        if (err) {
          console.log(err);
          return err;
        }
        return cb(null, response.Items);
      }
    );
  }

  return {
    addTeam: addTeam,
    deleteTeam: deleteTeam,
    getByShow: getByShow
  };
};