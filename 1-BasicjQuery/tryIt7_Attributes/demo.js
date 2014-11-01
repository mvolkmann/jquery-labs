/*global $: false */
'use strict';

var CHOICES = ['Dasher1.jpg', 'Dasher2.jpg'];

$(function () {
  $('#switch').click(function () {
    var img = $('#dasher');
    var src = img.attr('src');
    img.attr('src', src === CHOICES[0] ? CHOICES[1] : CHOICES[0]);
  });
});
