module.exports = function(ddb) {
  function list(request, reply) {
    ddb.query(
      {
        TableName: 'waitingList',
        KeyConditionExpression: 'showName = :hashval',
        ExpressionAttributeValues: {
          ':hashval': {
            S: 'Thursday Night Throwdown'
          }
        }
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