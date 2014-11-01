/*global $: false */

$(function () {
  $('#meals').accordion({
    active: 1, // Lunch
    animated: 'bounceslide',
    autoHeight: false,
    event: 'mouseover'
  });
});
