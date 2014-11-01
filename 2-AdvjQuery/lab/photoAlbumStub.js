/*global $: false, alert: false */
'use strict';

// TODO: Browse http://www.flickr.com/services/api/
// TODO: to see a summary of methods in the Flickr API.

var pa = {}; // namespace
pa.flickr = {};
pa.flickr.apiKey = // TODO: Put your Flickr API key here as a string.

// TODO: Browse http://www.flickr.com/services/api/request.rest.html
// TODO: to find the proper URL prefix for Flickr API REST requests.
pa.flickr.apiURL = // TODO: Put URL prefix here up to the ? as a string.
// TODO: The URL above should end in /, not ?.

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

// Writes all the properties of a given object
// to the console for debugging.
pa.dump = function (title, obj) {
  console.log(title);
  var prop;
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      console.log('  ' + prop + ' = ' + obj[prop]);
    }
  }
};

// Enables/disables the "Delete" button
// based on whether any rows are selected.
pa.evaluateCheckboxes = function () {
  var checked = $('#photoTable :checkbox:checked');
  pa.deleteButton.attr('disabled', checked.size() === 0);
};

// Makes an Ajax call to a given Flickr API method.
// "data" is an object that holds the data to be passed to the method.
// Some default data is supplied such as
// the api key and response format ("json").
// "callback" is the function to be invoked
// with the response JSON object.
pa.flickrCall = function (method, data, callback) {
  // Add to data that was passed in.
  data.api_key = pa.flickr.apiKey;
  data.format = 'json';
  data.method = method;
  data.nojsoncallback = 1;

  // TODO: Use $.getJSON to invoke the Flickr REST-based service.
  // TODO: Pass it the Flickr API URL (defined near the top as
  // pa.flickr.apiURL), the data, and the callback function.
};

// Gets the names of all the photosets for a given Flickr user id.
pa.getFlickrPhotoSets = function (userId, callback) {
  pa.flickrCall(
    // TODO: Pass the name of the Flickr method that returns
    // TODO: the photosets for a given user id.
    { user_id: userId },
    function (data) {
      data.photosets.photoset.forEach(function (photoset) {
        callback(photoset);
      });
    });
};

// Gets the user id for a given Flicr user name.
// "success" is the function to be invoked with the user id
// if the lookup is successful.
// "failure" is the function to be invoked if the lookup fails.
pa.getFlickrUserId = function (flickrUserName, success, failure) {
  var photostreamURL =
    'http://www.flickr.com/photos/' + flickrUserName + '/';
  pa.flickrCall(
    // TODO: Pass the name of the Flickr method that returns
    // TODO: information about a given Flickr user name.
    { url: photostreamURL },
    function (data) {
      if (data.stat === 'ok') {
        success(data.user.id);
      } else {
        failure();
      }
    });
};

// Displays a thumbnail of a given photo
// under the Flickr photoset buttons.
pa.loadFlickrPhoto = function (photo) {
  var div, img, url;

  // TODO: Set url to the Flickr URL of the given photo
  // TODO: using the first "Photo Source URL" form described at
  // TODO: http://www.flickr.com/services/api/misc.urls.html.
  div = $('#photos');
  img = $('<img>');
  img.attr('id', 'p' + photo.id);
  img.attr('src', url);
  img.attr('alt', photo.title);
  img.attr('title', photo.title);
  img.addClass('thumbnail');
  div.append(img);
};

// Displays a thumbnail of each photo in the selected Flickr photoset
// under the Flickr photoset buttons.
pa.loadFlickrPhotos = function () {
  var photoSetId, photoSetName;
  photoSetId = this.id.substring(2); // remove "ps" prefix
  photoSetName = $(this).text();

  // Get all the photos associated with the given photoset id.
  pa.flickrCall(
    // TODO: Pass the name of the Flickr method that returns
    // TODO: information about all the photos in a given photoset.
    { photoset_id: photoSetId },
    function (data) {
      $('#photos').empty();
      data.photoset.photo.forEach(function (photo) {
        pa.loadFlickrPhoto(photo);
      });
    });
};

// Displays a button for each Flickr photoset
// associated with the entered Flickr user name.
pa.loadFlickrPhotoSets = function () {
  var div, failureCB, flickrUserName, successCB;

  flickrUserName = pa.flickrUserNameField.val();
  if (!flickrUserName) {
    alert('A Flickr user name must be entered.');
    return;
  }

  div = $('#photoSets');

  // Function that will be called if the Flickr user id is found.
  successCB = function (flickrUserId) {
    div.empty();
    pa.getFlickrPhotoSets(flickrUserId, function (photoSet) {
      var button, name;
      name = photoSet.title._content;
      button = $('<button>');
      button.attr('id', 'ps' + photoSet.id);
      button.attr('type', 'button');
      button.text(name);
      button.addClass('photoSetButton');
      div.append(button);
    });
  };

  // Function that will be called if the Flickr user id is not found.
  failureCB = function () {
    div.empty();
    alert('No Flickr account found for "' + flickrUserName + '".');
  };

  pa.getFlickrUserId(flickrUserName, successCB, failureCB);
};

// Populates the URL and description fields
// with data from the selected Flickr picture.
pa.selectFlickrPhoto = function () {
  pa.descField.val(this.title);
  pa.urlField.val(this.src);
};

// Performs page setup, including event handler registration.
pa.setup = function () {
  $('h1').css('color', 'red');

  pa.urlField = $('#url');
  pa.descField = $('#desc');
  pa.flickrUserNameField = $('#flickrUserName');

  $('#add').click(pa.addPhoto);

  pa.deleteButton = $('#delete');
  pa.deleteButton.attr('disabled', true);
  pa.deleteButton.click(pa.deletePhotos);

  $('#getPhotoSets').click(pa.loadFlickrPhotoSets);

  $('#photoTable').on(
    'change', 'input[type="checkbox"]', pa.evaluateCheckboxes);

  $(document).on('click', '.photoSetButton', pa.loadFlickrPhotos);

  $(document).on('click', 'img.thumbnail', pa.selectFlickrPhoto);
};

// Registers a function to be called when the document is ready.
$(pa.setup);
