/*global $: false */
'use strict';

$(function () {
  //var firstDiv = $('div:eq(0)');
  var firstDiv = $('div:first');
  firstDiv.data('number', 99);
  $('body').append('<div>Number ' + firstDiv.data('number') + '</div>');
});
