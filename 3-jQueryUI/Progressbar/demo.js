'use strict';
/*global $: false, clearInterval: false, setInterval: false */

var pb, token, valueDiv;

function updateProgress() {
  var value = pb.progressbar('value') + 1;
  if (value <= 100) {
    pb.progressbar('value', value);
    valueDiv.text(value + '%');
  }
  if (value >= 100) {
    clearInterval(token);
  }
}

$(function () {
  pb = $('#progress');
  valueDiv = $('#value');

  pb.progressbar({value: 19});
  token = setInterval(updateProgress, 50); // milliseconds
});
