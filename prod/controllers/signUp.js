'use strict';

var moment = require('moment-timezone');

module.exports = function(waitingList) {
  return function(request, reply) {
    return reply.view('sign-up');
  };
};