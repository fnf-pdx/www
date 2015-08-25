'use strict';

var Hapi = require('hapi');
var Good = require('good');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var ddb = new AWS.DynamoDB();

var waitingList = require('./../.././models/waitingList')(ddb);
var schedule = require('./../.././models/schedule')(ddb);

var indexController = require('./controllers/index')(schedule);
var signUpController = require('./controllers/signUp')(waitingList);
var waitingListController = require('./controllers/waitingList')(waitingList);

var version = require('./../package').version;

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.views({
  isCached: false, //dev mode
  engines: {
    html: require('swig')
  },
  path: './'
});

server.route({
  method: 'GET',
  path: '/health-check',
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
  path: '/img/{param*}',
  handler: {
    directory: {
      path: 'img'
    }
  }
});

server.route({
  method: 'GET',
  path: '/css/{param*}',
  handler: {
    directory: {
      path: 'css'
    }
  }
});

server.route({
  method: 'GET',
  path: '/js/{param*}',
  handler: {
    directory: {
      path: 'js'
    }
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: indexController
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
  handler: signUpController.save
});

server.route({
  method: 'GET',
  path: '/waiting-list',
  handler: waitingListController.list
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
