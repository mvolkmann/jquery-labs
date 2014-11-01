/*global $: false, alert: false */
'use strict';

var pa = {};

// Adds a row to the photo table for the entered URL and description.
pa.addPhoto = function () {
  var desc, url;

  url = pa.urlField.val();
  desc = pa.descField.val();
  if (url && desc) {
    pa.addPhotoRow(desc, url);
  } else {
    alert("URL and description are required.");
  }
};

// Adds a row to the photo table for the given URL and description.
pa.addPhotoRow = function (desc, url) {
  var img, td, tr;

  tr = $('<tr>');
  tr.append('<td><input type="checkbox"/></td>');
  img = $('<img>', { src: url });
  img.addClass('photo');
  td = $('<td>');
  td.append(img);
  tr.append(td);
  tr.append('<td>' + desc + '</td>');
  $('#photoTable').append(tr);
};

// Deletes all the selected rows in the photo table.
pa.deletePhotos = function () {
  $('#photoTable :checkbox:checked').parent().parent().remove();
  pa.deleteButton.attr('disabled', true);
};

// Enables/disables the "Delete" button
// based on whether any rows are selected.
pa.evaluateCheckboxes = function () {
  var checked = $('#photoTable :checkbox:checked');
  pa.deleteButton.attr('disabled', checked.size() === 0);
};

// Performs page setup, including event handler registration.
pa.setup = function () {
  $('h1').css('color', 'red');

  pa.urlField = $('#url');
  pa.descField = $('#desc');

  $('#add').click(pa.addPhoto);

  pa.deleteButton = $('#delete');
  pa.deleteButton.attr('disabled', true);
  pa.deleteButton.click(pa.deletePhotos);

  $('#photoTable').on('change', ':checkbox', pa.evaluateCheckboxes);
};

$(pa.setup);
