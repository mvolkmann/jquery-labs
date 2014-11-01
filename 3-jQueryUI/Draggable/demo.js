'use strict';
/*global $: false */

$(function () {
  $('.box').draggable({ // adds class "ui-draggable"
    containment: 'parent',
    //containment: [200, 200, 600, 400],
    cursor: 'pointer',
    //grid: [20, 20],
    opacity: 0.5,
    snap: true,
    snapTolerance: 10,
    stack: '.box',
    start: function (evt) {
      $('#status').text('Drag of "' + $(evt.target).text() + '" started');
    },
    drag: function (evt, ui) {
      $('#status').text('Drag of "' + $(evt.target).text() +
        '" at ' + ui.position.left + ', ' + ui.position.top);
    },
    stop: function (evt) {
      $('#status').text('Drag of "' + $(evt.target).text() + '" stopped');
    }
  });

  /*
   * Currently elements cannot be both selectable and draggable.
   * See http://bugs.jqueryui.com/ticket/2843.
  $('.box').selectable();
  //$('#outer').selectable({filter: '.box'});
  */

  //$('.box').draggable('option', 'cancel', '#right');
  $('#right').draggable('option', 'cancel', '*');
});
