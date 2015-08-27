'use strict';

module.exports = function(schedule) {
  return function(request, reply) {
    var data = require('../../src/data/index');

    return reply.view('index', data);
  };
};