module.exports = function(db) {
  function form(request, reply) {
    reply.view('schedule-form');
  }

  function save(request, reply) {
    reply.view('schedule-form');
  }

  return {
    form: form,
    save: save
  }
};