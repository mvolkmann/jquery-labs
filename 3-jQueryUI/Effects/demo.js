/*global $: false */
'use strict';

function shake() {
  $('#haiku').effect('shake', { direction: 'down'});
}

$(function () {
  $('#shakeButton').click(shake);
});
