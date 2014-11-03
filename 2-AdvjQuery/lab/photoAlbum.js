/*global $: false, alert: false, document: false, OAuth: false */
'use strict';

var token = {
  public: '87388cba5de9031f8f7319674ef9a5a6',
  secret: 'e6e1d778d5cf7c08'
};

var oauth = OAuth({
  consumer: token,
  signature_method: 'HMAC-SHA1'
});

var pa = {}; // namespace
pa.flickr = {};
//pa.flickr.apiKey = '8151c3cb6c3aa591ce2c7c627d476548';
pa.flickr.apiKey = '87388cba5de9031f8f7319674ef9a5a6';
pa.flickr.apiURL = 'https://api.flickr.com/services'; // '/rest/';

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

  console.log('photoAlbum.js flickrCall: pa.flickr.apiURL =', pa.flickr.apiURL);
  console.log('photoAlbum.js flickrCall: data =', data);
  //$.getJSON(pa.flickr.apiURL, data, callback);
  $.ajax({
    cache: false,
    data: oauth.authorize(data, token),
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, must-revalidate'
    },
    success: callback,
    url: pa.flickr.apiURL
  });
};

// Gets the names of all the photosets for a given Flickr user id.
pa.getFlickrPhotoSets = function (userId, callback) {
  pa.flickrCall(
    'flickr.photosets.getList',
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
    'flickr.urls.lookupUser',
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
};

// Displays a thumbnail of each photo in the selected Flickr photoset
// under the Flickr photoset buttons.
pa.loadFlickrPhotos = function () {
  var photoSetId, photoSetName;
  photoSetId = this.id.substring(2); // remove "ps" prefix
  photoSetName = $(this).text();

  // Get all the photos associated with the given photoset id.
  pa.flickrCall(
    'flickr.photosets.getPhotos',
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
