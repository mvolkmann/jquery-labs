/*global $: false */
'use strict';

$(function () {
  $('.color').each(function () {
    var colorDiv = $(this);
    colorDiv.nextAll().each(function () {
      var flavorDiv = $(this);
      if (/a/.test(flavorDiv.text())) {
        flavorDiv.addClass('highlight');
      }
    });
  });
});
