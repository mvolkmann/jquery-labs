/*global $: false */
'use strict';

function positionDroppables() {
  $('#foodTarget').position({
    my: 'right top', at: 'right top', of: '#container'
  });

  $('#sportTarget').position({
    my: 'right bottom', at: 'right bottom', of: '#container'
  });
}

function drop(evt, ui) {
  var draggable, droppable, text;
  draggable = $(ui.draggable);
  droppable = $(this);
  text = draggable.text();

  droppable.html(droppable.html() + '<br/>' + text);
  draggable.remove();
}

$(function () {
  positionDroppables();

  var container = $('#container');

  $('.food, .sport').addClass('item');

  var options = {
    containment: 'parent',
    cursor: 'pointer',
    revert: 'invalid', // return to original location if not dropped on an acceptable Droppable
    stack: '.item' // drag above these
  };
  $('.food, .sport').draggable(options);


  $('.bucket').droppable({
    activeClass: 'compatibleTarget',
    drop: drop,
    hoverClass: 'overTarget',
    tolerance: 'fit'
  });

  $('#foodTarget').droppable('option', 'accept', '.food');
  $('#sportTarget').droppable('option', 'accept', '.sport');
});
