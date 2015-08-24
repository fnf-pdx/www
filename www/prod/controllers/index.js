'use strict';

module.exports = function(schedule) {
  return function(request, reply) {
    var data = {
      "intro": {
        "team1": {
          "name": "Biz Caj",
          "pic": "/img/biz-caj.jpg"
        },
        "team2": {
          "name": "Fit to Print",
          "pic": "/img/fit-to-print.jpg"
        }
      },
      "schedule": {
        "fnf": {
          "name": "Friday Night Fights",
          "shows": [
            {
              "team1": "ADD Hawk",
              "team2": "Balrog",
              "date": "Fri 14 Jan, 9:30pm"
            },
            {
              "team1": "He Said She Said",
              "team2": "J-Names",
              "date": "Fri 26 Jan, 9:30pm"
            },
            {
              "team1": "Five Finger Discount",
              "team2": "Katie",
              "date": "Fri 2 Feb, 9:30pm"
            }
          ]
        },
        "tnt": {
          "name": "Thursday Night Throwdown",
          "shows": [
            {
              "team1": "French Dukes",
              "team2": "Bleeding Thumb",
              "date": "Fri 14 Jan, 9:30pm"
            },
            {
              "team1": "Twisted Mr",
              "team2": "Horny Burrito",
              "date": "Fri 26 Jan, 9:30pm"
            },
            {
              "team1": "The Big Loud What!?",
              "team2": "Narcoleprosy",
              "date": "Fri 2 Feb, 9:30pm"
            }
          ]
        }
      }
    };

    reply.view('index', data);
  };
};