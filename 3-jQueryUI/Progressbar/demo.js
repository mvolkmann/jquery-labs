'use strict';
/*global $: false, clearInterval: false, setInterval: false */

var token;

function updateProgress() {
  var pb = $('#progress'),
    value = pb.progressbar('value') + 1;
  if (value <= 100) {
    pb.progressbar('value', value);
    $('#value').text(value + '%');
  }
  if (value >= 100) {
    clearInterval(token);
  }
}

$(function () {
  $('#progress').progressbar({value: 19});
  token = setInterval(updateProgress, 50); // milliseconds
});
