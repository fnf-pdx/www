var Hapi = require('hapi');
var Good = require('good');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var ddb = new AWS.DynamoDB();

var waitingList = require('./../lib/data/waitingList')(ddb);
var schedule = require('./../lib/data/schedule')(ddb);

var tntSignUp = require('./../lib/handlers/signUp')(waitingList);
var tntWaitingList = require('./../lib/handlers/waitingList')(waitingList);
var scheduleHandler  = require('./../lib/handlers/schedule')(waitingList, schedule);
var calendar = require('./../lib/handlers/calendar')(schedule);

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
  handler: tntSignUp.save
});

server.route({
  method: 'GET',
  path: '/waiting-list',
  handler: tntWaitingList.list
});

server.route({
  method: 'GET',
  path: '/schedule/tnt',
  handler: scheduleHandler.form
});

server.route({
  method: 'POST',
  path: '/schedule/tnt',
  handler: scheduleHandler.save
});

server.route({
  method: ['GET', 'POST'],
  path: '/calendar/{month}',
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
