var Hapi = require('hapi');
var Good = require('good');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var db = new AWS.DynamoDB();

var signUp = require('./lib/handlers/signUp')(db);
var waitingList = require('./lib/handlers/waitingList')(db);
var schedule = require('./lib/handlers/schedule')(db);

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
  helpersPath: 'lib/helpers',
  partialsPath: 'views/partials'
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
  path: '/assets/{param*}',
  handler: {
    directory: {
      path: 'assets'
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
  handler: {
    view: 'signUp'
  }
});

server.route({
  method: 'POST',
  path: '/sign-up',
  handler: signUp.save
});

server.route({
  method: 'GET',
  path: '/waiting-list',
  handler: waitingList.list
});

server.route({
  method: 'GET',
  path: '/schedule',
  handler: {
    view: 'scheduleLanding'
  }
});

server.route({
  method: 'GET',
  path: '/schedule/{showName}',
  handler: schedule.form
});

server.route({
  method: 'POST',
  path: '/schedule/{showName}',
  handler: schedule.save
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
