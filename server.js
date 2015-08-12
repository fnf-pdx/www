var Hapi = require('hapi');
var Good = require('good');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var db = new AWS.DynamoDB();

var signUp = require('./lib/handlers/signUp')(db);
var waitingList = require('./lib/handlers/waitingList')(db);
var schedule = require('./lib/handlers/schedule')(db);
var calendar = require('./lib/handlers/calendar')(db);

var version = require('./package').version;

var viewsBasePath = 'views-raw';

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.views({
  isCached: false, //dev mode
  engines: {
    html: require('handlebars')
  },
  layout: true,
  path: viewsBasePath,
  layoutPath: viewsBasePath + '/layout',
  helpersPath:  'lib/helpers',
  partialsPath: viewsBasePath + '/partials'
});

server.route({
  method: 'GET',
  path: '/healthcheck',
  handler: function(request, reply) {
    reply({ status: 'ok', version: version });
  }
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
  path: '/schedule/tnt',
  handler: schedule.form
});

server.route({
  method: 'POST',
  path: '/schedule/tnt',
  handler: schedule.save
});

server.route({
  method: ['GET', 'POST'],
  path: '/calendar',
  handler: calendar.render
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
