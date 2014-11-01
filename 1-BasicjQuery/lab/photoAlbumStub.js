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

  // TODO: Create new table row with three columns.
  // TODO: The 1st column is a checkbox.
  // TODO: The 2nd column is an image tag that uses the URL for the src attr.
  // TODO: The 3rd column is the description.

  $('#photoTable').append(tr);
};

// Deletes all the selected rows in the photo table.
pa.deletePhotos = function () {
  // TODO: For each checkbox in the photo table that is checked ...
  // TODO: get its grandparent which is its table row and remove it.

  // TODO: Disable the "Delete" button.
};

// Enables/disables the "Delete" button
// based on whether any rows are selected.
pa.evaluateCheckboxes = function () {
  // TODO: Get all the checkboxes that are checked.
  // TODO: Enable/disable the "Delete" button based on
  // TODO: the size of that collection.
};

// Performs page setup, including event handler registration.
pa.setup = function () {
  // TODO: Set the font color of the heading to red.  Normally this would
  // TODO: be done in CSS, but do it from JavaScript in order to learn how.

  pa.urlField = $('#url');
  pa.descField = $('#desc');

  // TODO: Register the addPhoto function to be called
  // TODO: when the "Add" button is clicked.

  pa.deleteButton = $('#delete');
  pa.deleteButton.attr('disabled', true);

  // TODO: Register the deletePhotos function to be called
  // TODO: when the "Delete" button is clicked.

  // TODO: Register the evaluateCheckboxes function to be called
  // TODO: when any checkbox in the photo table is changed.
  // TODO: This needs to work for newly added rows!
};

$(pa.setup);
