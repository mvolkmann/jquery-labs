/*global $: false, alert: false */
'use strict';

var pa = {}; // namespace
pa.flickr = {};
pa.flickr.apiKey = // TODO: Put your Flickr API key here as a string.
pa.flickr.apiURL = 'http://api.flickr.com/services/rest/';
pa.layoutPercent = 50;

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
  var img, input, td, tr;

  tr = $('<tr>');

  tr.append('<td><input type="checkbox"/></td>');

  td = $('<td>');
  img = $('<img>', { src: url });
  img.addClass('photo');
  td.append(img);
  tr.append(td);

  tr.append('<td>' + desc + '</td>');

  td = $('<td>');

  // TODO: Set input to the result of using the $ function to construct
  // TODO: an input tag with size "10", and type "text".

  // TODO: Use a jQuery UI function to turn the input tag into a date picker.

  td.append(input);
  tr.append(td);

  $('#photoTable').append(tr);
};

pa.changeZ = function (z) {
  // TODO: The element that was right-clicked is referred to by pa.rightClicked.
  // TODO: Set the CSS property 'z-index' of that element
  // TODO: to the z value passed in.

  pa.lowestZ = Math.min(pa.lowestZ, z);
  pa.highestZ = Math.max(pa.highestZ, z);

  if (z < 0) {
    // Due to http://bugs.jqueryui.com/ticket/4461 which says
    // nodes with negative z-index values cannot be dragged,
    // make all z-index values positive.
    pa.layoutArea.children().each(function (index, node) {
      var jq = $(node);
      jq.css('z-index', pa.getZ(jq) - z);
    });
    pa.lowestZ -= z;
    pa.highestZ -= z;
  }

  // TODO: Close the dialog referred to by pa.arrangeDialog.

  pa.dumpZs();
};

// Deletes all the selected rows in the photo table.
pa.deletePhotos = function () {
  $('#photoTable :checkbox:checked').each(function (index, input) {
    var tr, src;
    tr = $(input).parent().parent();
    src = tr.find('img').attr('src');
    console.log('deleted ' + src);
    tr.remove();

    // Remove the image from the layoutArea if present.
    pa.layoutArea.children('img[src="' + src + '"]').remove();
  });

  pa.deleteButton.attr('disabled', true);
};

// Writes all the properties of a given object
// to the console for debugging.
pa.dump = function (title, obj) {
  var prop;
  console.log(title);
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      console.log('  ' + prop + ' = ' + obj[prop]);
    }
  }
};

// For debugging.
pa.dumpZs = function () {
  pa.layoutArea.children().each(function (index, node) {
    var img = $(node);
    console.log(img.attr('alt') + ' - z=' + pa.getZ(img));
  });
};

// Enables/disables the "Delete" button
// based on whether any rows are selected.
pa.evaluateCheckboxes = function () {
  var checked = $('#photoTable :checkbox:checked');
  pa.deleteButton.button(checked.size() === 0 ? 'disable' : 'enable');
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

  $.getJSON(pa.flickr.apiURL, data, callback);
};

// Gets the jQuery-wrapped DOM node in the layout area
// with a given z-index.
pa.getAtZ = function (z) {
  var jqAtZ;

  pa.layoutArea.children().each(function (index, node) {
    var jq = $(node);
    if (pa.getZ(jq) === z) {
      jqAtZ = jq;
      return false; // to terminate each
    }
  });

  return jqAtZ;
};

// Gets the names of all the photosets for a given Flickr user id.
pa.getFlickrPhotoSets = function (userId, callback) {
  pa.flickrCall(
    'flickr.photosets.getList',
    { user_id: userId },
    function (data, textStatus) {
      data.photosets.photoset.forEach(function (photoset) {
        callback(photoset);
      });
    }
  );
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
    function (data, textStatus) {
      if (data.stat === 'ok') {
        success(data.user.id);
      } else {
        failure();
      }
    }
  );
};

// Gets the z-index of a jQuery-wrapped DOM node.
pa.getZ = function (jq) {
  return parseInt(jq.css('z-index'), 10);
};

// Allows user to drag and resize photos.
pa.layoutPhotos = function () {
  pa.photoTable.find('img').each(function (index, imgNode) {
    var alt, height, img, imgs, newImg, src;

    img = $(imgNode);
    alt = img.attr('alt');
    src = img.attr('src');
    height = img.css('height');

    // If layoutArea doesn't already contain this image, add it.
    imgs = pa.layoutArea.children('img[src="' + src + '"]');
    if (imgs.size() === 0) {
      newImg = $('<img>', { alt: alt, src: src });
      newImg.data('heightPercentage', pa.layoutPercent);
      newImg.css('height', '50%');
      newImg.css('position', 'absolute');
      pa.highestZ += 1;
      newImg.css('z-index', pa.highestZ);
      newImg.addClass('layout');

      // TODO: Make the image referred to by newImg draggable.

      pa.layoutArea.append(newImg);
    }
  });

  // TODO: Make the layout area selectable.
  // TODO: Set the "selected" option to call pa.selectedImage
  // TODO: when an image is selected.
};

// Displays a thumbnail of a given photo
// under the Flickr photoset buttons.
pa.loadFlickrPhoto = function (photo) {
  var div, img, src;

  src = 'http://farm' + photo.farm +
    '.static.flickr.com/' + photo.server + '/' +
    photo.id + '_' + photo.secret + '.jpg';
  div = $('#photos');
  img = $('<img>', {
    id: 'p' + photo.id,
    src: url,
    alt: photo.title,
    title: photo.title
  });
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
      button.button();
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

// Scales the selected images in layout mode.
pa.scaleImages = function () {
  // TODO: Set variable "value" to the value of the slider
  // TODO: with an id of "scaleSlider".
  var value;

  $('.ui-selected').each(function (index, imgNode) {
    var img = $(imgNode);
    img.css('height', value + '%');
    img.data('heightPercentage', value);
  });
};

// Populates the URL and description fields
// with data from the selected Flickr picture.
pa.selectFlickrPhoto = function () {
  pa.descField.val(this.title);
  pa.urlField.val(this.src);
};

// Called when an image is clicked in layout mode.
pa.selectedImage = function () {
  var height, img = $(this);
  img.toggleClass('ui-selected');

  if (img.hasClass('ui-selected')) {
    // Change the value of the slider to match
    // the height percentage of the clicked image.
    height = img.data('heightPercentage');
    // TODO: Set the value of the slider with id "scaleSlider" to height.
  }
};

// Performs page setup, including event handler registration.
pa.setup = function () {
  pa.urlField = $('#url');
  pa.descField = $('#desc');
  pa.flickrUserNameField = $('#flickrUserName');

  $('#add').click(pa.addPhoto);

  pa.deleteButton = $('#delete');
  pa.deleteButton.attr('disabled', true);
  pa.deleteButton.click(pa.deletePhotos);

  $('#mode').click(pa.toggleMode);
  pa.entry = $('#entry');
  pa.photoTable = $('#photoTable');
  pa.layout = $('#layout');
  pa.layoutArea = $('#layoutArea');
  pa.layout.hide();

  $('#getPhotoSets').click(pa.loadFlickrPhotoSets);

  $('#photoTable').on(
    'change', 'input[type="checkbox"]', pa.evaluateCheckboxes);

  $(document).on('click', '.photoSetButton', pa.loadFlickrPhotos);

  $(document).on('click', 'img.thumbnail', pa.selectFlickrPhoto);

  // TODO: Make all input tags with a type of "button" be jQuery UI buttons.

  $('.label').addClass('ui-widget');

  // TODO: Make all elements inside the div with id "layoutArea" be selectable.

  // TODO: Make the div with id "scaleSlider" be a slider.
  // TODO: Configure it so when the user drags the slider,
  // TODO: pa.scaleImages is called (both "slide" and "change" events).
  // TODO: Set the minimum and maximum values to 10 and 100.
  // TODO: Set the initial value to pa.layoutPercent.

  // TODO: Use the "on" method to register a click handler
  // TODO: on any "img" tag that is added to #layoutArea.
  // TODO: When an image is clicked, call pa.selectedImage.
  // Deselect all images if the layout area is clicked.

  // TODO: Setup event handling so any img element
  // TODO: added to the div with id "layoutArea" triggers
  // TODO: a call to pa.selectedImage when it is clicked.
  // TODO: Hint: Use the on method, with a selector argument.

  pa.lowestZ = 0;
  pa.highestZ = 0;

  pa.setupArrangeDialog();
};

pa.setupArrangeDialog = function () {
  // TODO: Set pa.arrangeDialog to a dialog created from
  // TODO: the div with id "arrangeDialog".
  // TODO: Configure it so it doesn't open when create.
  // TODO: Make it modal.
  // TODO: Make it non-resizable.
  // TODO: Set its width to 200.

  $('#layoutArea').on('contextmenu', 'img', function (event) {
    pa.rightClicked = $(this);

    // TODO: Set the position of pa.arrangeDialog to event.pageX, event.pageY.

    // TODO: Open pa.arrangeDialog.

    return false; // prevent browser context menu from appearing
  });

  $('#back').click(function () {
    pa.changeZ(pa.lowestZ - 1);
  });

  $('#backward').click(function () {
    pa.swapZ(pa.getZ(pa.rightClicked) - 1);
  });

  $('#forward').click(function () {
    pa.swapZ(pa.getZ(pa.rightClicked) + 1);
  });

  $('#front').click(function () {
    pa.changeZ(pa.highestZ + 1);
  });
};

// Swaps the z-index values of the right-clicked image
// and the image at a given z-index.
pa.swapZ = function (z2) {
  var jq1, jq2;
  jq1 = pa.rightClicked;
  jq2 = pa.getAtZ(z2);
  if (jq1 && jq2) {
    var z1 = pa.getZ(jq1);
    jq1.css('z-index', z2);
    jq2.css('z-index', z1);
  }
  pa.dumpZs(); // for debugging

  // TODO: Close pa.arrangeDialog.
};

// Toggles between data entry and layout mode.
pa.toggleMode = function () {
  var button, buttonText;

  button = $(this);
  buttonText = button.val();

  if (buttonText === 'Layout Mode') {
    pa.entry.hide();
    pa.photoTable.hide();
    pa.layout.show();
    button.val('Entry Mode');
    pa.layoutPhotos();
  } else {
    pa.layout.hide();
    pa.entry.show();
    pa.photoTable.show();
    button.val('Layout Mode');
  }
};

// Registers a function to be called when the document is ready.
$(pa.setup);
