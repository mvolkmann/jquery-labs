(function () {
  /*global $: false, alert: false, document: false, OAuth: false */
  'use strict';

  var deleteButton, descField, flickrUserName, flickrUserNameField, urlField;

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

  // Displays a thumbnail of a given photo
  // under the Flickr photoset buttons.
  function loadFlickrPhoto(photo) {
    var div, img, url;

    url = 'http://farm' + photo.farm +
          '.static.flickr.com/' + photo.server + '/' +
              photo.id + '_' + photo.secret + '.jpg';
    div = $('#photos');
    img = $('<img>');
    img.attr('id', 'p' + photo.id);
    img.attr('src', url);
    img.attr('alt', photo.title);
    img.attr('title', photo.title);
    img.addClass('thumbnail');
    div.append(img);
  }

  // Displays a thumbnail of each photo in the selected Flickr photoset
  // under the Flickr photoset buttons.
  function loadFlickrPhotos() {
    var photoSetId, photoSetName;
    photoSetId = this.id.substring(2); // remove "ps" prefix
    photoSetName = $(this).text();

    // Get all the photos associated with the given photoset id.
    $.getJSON('/photos/' + photoSetId).then(
      function (data) {
        $('#photos').empty();
        Object.keys(data).sort().forEach(function (title) {
          var photo = data[title];
          loadFlickrPhoto(photo);
        });
      });
  }

  // Displays a button for each Flickr photoset
  // associated with the entered Flickr user name.
  function loadFlickrPhotoSets() {
    var div, failureCb, successCb;

    flickrUserName = flickrUserNameField.val();
    if (!flickrUserName) {
      alert('A Flickr user name must be entered.');
      return;
    }

    div = $('#photoSets');

    // Function that will be called if the Flickr user id is found.
    successCb = function (userId) {
      div.empty();
      $.getJSON('/photosets/' + userId).then(
        function (photoSets) {
          var button, name;
          Object.keys(photoSets).forEach(function (name) {
            var id = photoSets[name];
            button = $('<button>').
              attr('id', 'ps' + id).
              text(name).
              addClass('photoSetButton');
            div.append(button);
          });
        });
    };

    // Function that will be called if the Flickr user id is not found.
    failureCb = function () {
      div.empty();
      alert('No Flickr account found for "' + flickrUserName + '".');
    };

    $.get('/userid/' + flickrUserName).done(successCb).fail(failureCb);
  }

  // Populates the URL and description fields
  // with data from the selected Flickr picture.
  function selectFlickrPhoto() {
    descField.val(this.title);
    urlField.val(this.src);
  }

  // Performs page setup, including event handler registration.
  function setup() {
    $('h1').css('color', 'red');

    urlField = $('#url');
    descField = $('#desc');
    flickrUserNameField = $('#flickrUserName');

    $('#add').click(addPhoto);

    deleteButton = $('#delete');
    deleteButton.attr('disabled', true);
    deleteButton.click(deletePhotos);

    $('#getPhotoSets').click(loadFlickrPhotoSets);

    $('#photoTable').on(
      'change', 'input[type="checkbox"]', evaluateCheckboxes);

    $(document).on('click', '.photoSetButton', loadFlickrPhotos);

    $(document).on('click', 'img.thumbnail', selectFlickrPhoto);
  };

  // Registers a function to be called when the document is ready.
  $(setup);
})();
