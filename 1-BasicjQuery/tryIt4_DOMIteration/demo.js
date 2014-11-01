/*global $: false */
'use strict';

/*
$(function () {
  $('.color').each(function () {
    var colorDiv = $(this);
    colorDiv.nextAll().each(function () {
      var flavorDiv = $(this);
      if (flavorDiv.text().match(/a/)) flavorDiv.css('color', 'blue');
    });
  });
});
*/

function processFlavor(index, elem) {
  var flavorDiv = $(elem);
  //if (flavorDiv.text().match(/a/)) {
  if (/a/.test(flavorDiv.text())) {
    flavorDiv.css('color', 'blue');
  }
}

function processColor(index, elem) {
  $(elem).nextAll().each(processFlavor);
}

function go() {
  $('h1').css({
    backgroundColor: 'yellow',
    color: 'red',
    fontSize: '24pt'
  });

  $('.color').each(processColor);
}

$(go);
