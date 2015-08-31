'use strict';

var moment = require('moment-timezone');
var kebabCase = require('lodash/string/kebabCase');

function validate(payload) {
  var messages = [];

  if (!payload.name) {
    messages.push('Team Name is required');
  }

  if (!payload.facebook) {
    messages.push('Group Facebook page is required');
  }

  if (!payload.contactName) {
    messages.push('Please provide a contact name');
  }

  if (!payload.contactNumber) {
    messages.push('Please provide a contact number');
  }

  if (!payload.photo || !payload.photo.hapi.filename) {
    messages.push('Team photo is required');
  }

  if (!payload.origin) {
    messages.push('"How we met" is required');
  }

  if (!payload.format) {
    messages.push('"What kind of format do you do?" is required');
  }

  return messages;
}

function format(payload) {
  var team = {
    name: {S: payload.name},
    facebook: {S: payload.facebook},
    contactName: {S: payload.contactName},
    contactNumber: {S: payload.contactNumber},
    photo: {S: payload.photo.hapi.filename},
    origin: {S: payload.origin},
    format: {S: payload.format},
    show: {S: 'Thursday Night Throwdown'}
  };

  if (payload.coach) {
    team.coach = {S: payload.coach};
  }

  return team;
}

module.exports = function(teams, s3Stream) {
  return function(request, reply) {
    var validationMessages = validate(request.payload);
    var team;

    if (validationMessages.length) {
      return reply.view('sign-up', {validationMessages: validationMessages});
    }

    team = format(request.payload);

    teams.create(team, function(err) {
      if (err) {
        console.log(err);
        return reply.view('sign-up', {validationMessage: 'Team creation failed'});
      }

      var photoStream = request.payload.photo;

      var teamPhotos = s3Stream.upload({
        Bucket: 'fnf-team-photos',
        Key: kebabCase(team.name.S) + '/' + team.photo
      });

      teamPhotos.on('error', photoFailed);
      teamPhotos.on('uploaded', addToWaitingList);

      photoStream.pipe(teamPhotos);
    });

    function photoFailed(err) {
      console.log(err);
      reply.view('sign-up', {validationMessage: 'Team photo failed to upload'});
    }

    function addToWaitingList() {
      teams.addToWaitingList(team.name.S, 'Thursday Night Throwdown', function(err) {
        if (err) {
          console.log(err);
          return reply.view('sign-up', {validationMessage: 'Failed to add team to waiting list'});
        }

        reply.view('sign-up', {message: 'Sign up Successful! You can now see your team on the waiting list'});
      });
    }
  };
};