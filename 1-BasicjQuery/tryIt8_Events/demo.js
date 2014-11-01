/*global $: false */

var addButton, artistField, cdField;

function addCD() {
  var tr = $('<tr><td>' + artistField.val() +
    '</td><td>' + cdField.val() + '</td></tr>');
  $('#music').append(tr);
}

function evaluateChange() {
  var disable = !artistField.val() || !cdField.val();
  addButton.attr('disabled', disable);
}

$(function () {
  addButton = $('#add');
  artistField = $('#artist');
  cdField = $('#cd');

  addButton.attr('disabled', true);
  artistField.change(evaluateChange);
  cdField.change(evaluateChange);
  addButton.click(addCD);

  $('#music').on('click', 'td:first-child', function () {
    artistField.val($(this).text());
  });

  $('#music').on('click', 'td:last-child', function () {
    cdField.val($(this).text());
  });
});
