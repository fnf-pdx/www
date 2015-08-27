'use strict';

module.exports = function(waitingList) {
  return function(request, reply) {
    var data = require('../../src/data/waiting-list');

    return reply.view('waiting-list', data);
  };
};