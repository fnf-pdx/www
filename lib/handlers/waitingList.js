module.exports = function(ddb) {
  function list(request, reply) {
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
          reply.view('waitingList', {message: 'failed to get waiting list'});
          return;
        }
        reply.view('waitingList', {teams: response.Items});
      }
    );
  }

  return {
    list: list
  }
};