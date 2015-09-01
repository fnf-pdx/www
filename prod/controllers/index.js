'use strict';

module.exports = function(schedule) {
  return function(request, reply) {
    return reply.view('index', {});
  };
};