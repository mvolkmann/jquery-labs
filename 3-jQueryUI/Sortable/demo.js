/*global $: false */
'use strict';

$(function () {
  $('#container').sortable({
    axis: 'y',
    containment: 'parent', //'#container',
    cursor: 'pointer'
  });
});
