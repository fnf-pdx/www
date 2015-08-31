'use strict';

var Hapi = require('hapi');
var Good = require('good');

var models = require('fnf-models');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var ddb = new AWS.DynamoDB();
var events = models.events(ddb);
var teams = models.teams(ddb);

var s3 = new AWS.S3();
var s3Stream = require('s3-upload-stream')(s3);

var indexController = require('./controllers/index')(events);
var signUpController = require('./controllers/signUp')(teams, s3Stream);
var waitingListController = require('./controllers/waitingList')(teams);

var version = require('./../package').version;

var server = new Hapi.Server();
server.connection({ port: 3000 });

var swig = require('swig');
swig.setDefaults({ cache: false });

server.views({
  isCached: false,
  path: '../src/html',
  engines: {
    html: swig
  }
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
    view: 'sign-up'
  }
});

server.route({
  method: 'POST',
  path: '/sign-up',
  config: {
    payload:{
      maxBytes: 209715200,
      output: 'stream',
      parse: true
    },
    handler: signUpController
  }
});

server.route({
  method: 'GET',
  path: '/waiting-list',
  handler: waitingListController
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
