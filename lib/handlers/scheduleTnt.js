module.exports = function(db) {
  function renderForm(request, reply) {
    reply.view('schedule-tnt');
  }

  function saveEvent(request, reply) {
    reply.view('schedule-tnt');
  }

  return {
    renderForm: renderForm,
    saveEvent: saveEvent
  }
};