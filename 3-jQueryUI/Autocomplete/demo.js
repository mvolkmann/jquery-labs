/*global $: false */
'use strict';

function getArtists(req, callback) {
  /*
  $.ajax({
    url: 'http://localhost:3000',
    dataType: 'jsonp',
    data: {
      term: req.term
    },
    success: callback
  });
  */
  $.get('http://localhost:3000', {term: req.term}, callback, 'jsonp');
}

$(function () {
  var sports = [
    'Baseball', 'Basketball', 'Cycling', 'Football',
    'Golf', 'Hockey', 'Tennis', 'Running', 'Swimming'
  ];
  $("#sportField").autocomplete({
    source: sports
  });

  $("#artistField").autocomplete({
    source: getArtists
  });
});
