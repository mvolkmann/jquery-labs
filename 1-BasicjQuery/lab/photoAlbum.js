(function () {
  /*global $: false, alert: false */
  'use strict';

  var deleteButton, descField, urlField;

  // Adds a row to the photo table for the entered URL and description.
  function addPhoto() {
    var desc, url;

    url = urlField.val();
    desc = descField.val();
    if (url && desc) {
      addPhotoRow(desc, url);
    } else {
      alert("URL and description are required.");
    }
  }

  // Adds a row to the photo table for the given URL and description.
  function addPhotoRow(desc, url) {
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
  }

  // Deletes all the selected rows in the photo table.
  function deletePhotos() {
    $('#photoTable :checkbox:checked').parent().parent().remove();
    deleteButton.attr('disabled', true);
  }

  // Enables/disables the "Delete" button
  // based on whether any rows are selected.
  function evaluateCheckboxes() {
    var checked = $('#photoTable :checkbox:checked');
    deleteButton.attr('disabled', checked.size() === 0);
  }

  // Performs page setup, including event handler registration.
  function setup() {
    $('h1').css('color', 'red');

    urlField = $('#url');
    descField = $('#desc');

    $('#add').click(addPhoto);

    deleteButton = $('#delete');
    deleteButton.attr('disabled', true);
    deleteButton.click(deletePhotos);

    $('#photoTable').on('change', ':checkbox', evaluateCheckboxes);
  }

  $(setup);
})();
