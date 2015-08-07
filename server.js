var Hapi = require('hapi');
var Good = require('good');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var db = new AWS.DynamoDB();

var signupHandler = require('./lib/handlers/signUp')(db);
var waitingListHandler = require('./lib/handlers/waitingList')(db);
var scheduleTnt = require('./lib/handlers/scheduleTnt')(db);
var scheduleFnf = require('./lib/handlers/scheduleFnf')(db);

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.views({
  isCached: false, //dev mode
  engines: {
    html: require('handlebars')
  },
  layout: true,
  path: 'views',
  layoutPath: 'views/layout',
  helpersPath: 'views/helpers'
});

server.route({
  method: 'GET',
  path: '/bower_components/{param*}',
  handler: {
    directory: {
      path: 'bower_components'
    }
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: {
    view: 'index'
  }
});

server.route({
  method: 'GET',
  path: '/sign-up',
  handler: signupHandler.renderForm
});

server.route({
  method: 'POST',
  path: '/sign-up',
  handler: signupHandler.saveTeam
});

server.route({
  method: 'GET',
  path: '/waiting-list',
  handler: waitingListHandler.list
});

server.route({
  method: 'GET',
  path: '/schedule-tnt',
  handler: scheduleTnt.renderForm
});

server.route({
  method: 'POST',
  path: '/schedule-Tnt',
  handler: scheduleTnt.saveEvent
});

server.route({
  method: 'GET',
  path: '/schedule-fnf',
  handler: scheduleFnf.renderForm
});

server.route({
  method: 'POST',
  path: '/schedule-fnf',
  handler: scheduleFnf.saveEvent
});

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, function (err) {
  if (err) {
    throw err;
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});