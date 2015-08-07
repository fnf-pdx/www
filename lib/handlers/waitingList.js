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
          reply.view('waiting-list', {message: 'failed to get waiting list'});
          return;
        }
        console.log(response.Items);
        reply.view('waiting-list', {teams: response.Items});
      }
    );
  }

  return {
    list: list
  }
};