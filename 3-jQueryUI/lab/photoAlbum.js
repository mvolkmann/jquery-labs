'use strict';
/*global $: false, alert: false, document: false */

var pa = {}; // namespace
pa.flickr = {};
pa.flickr.apiKey = '8151c3cb6c3aa591ce2c7c627d476548';
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
  input = $('<input class="date" size="10" type="text"/>');
  input.datepicker();
  td.append(input);
  tr.append(td);

  $('#photoTable').append(tr);
};

pa.changeZ = function (z) {
  pa.rightClicked.css('z-index', z);
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

  pa.arrangeDialog.dialog('close');
  pa.dumpZs();
};

// Deletes all the selected rows in the photo table.
pa.deletePhotos = function () {
  $('#photoTable :checkbox:checked').each(function (index, input) {
    var tr, src;
    tr = $(input).parent().parent();
    src = tr.find('img').attr('src');
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
    function (data) {
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
    function (data) {
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
    var alt, height, img, newImg, src;

    img = $(imgNode);
    alt = img.attr('alt');
    src = img.attr('src');
    height = img.css('height');

    // If layoutArea doesn't already contain this image, add it.
    img = pa.layoutArea.children('img[src="' + src + '"]');
    if (img.size() === 0) {
      newImg = $('<img>', { alt: alt, src: src });
      newImg.data('heightPercentage', pa.layoutPercent);
      newImg.css('height', pa.layoutPercent + '%');
      newImg.css('position', 'absolute');
      pa.highestZ += 1;
      newImg.css('z-index', pa.highestZ);
      newImg.addClass('layout');

      newImg.draggable();
      pa.layoutArea.append(newImg);
    }
  });

  $('#layoutArea').selectable({
    selected: pa.selectedImage
  });
};

// Displays a thumbnail of a given photo
// under the Flickr photoset buttons.
pa.loadFlickrPhoto = function (photo) {
  var div, img, src;

  src = 'http://farm' + photo.farm +
    '.static.flickr.com/' + photo.server + '/' +
    photo.id + '_' + photo.secret + '.jpg';
  div = $('#photos');
  img = $('<img>');
  img.attr('id', 'p' + photo.id);
  img.attr('src', src);
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
    }
  );
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
  var value = $('#scaleSlider').slider('value');
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
    $('#scaleSlider').slider('value', height);
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

  $('body input[type="button"]').button();

  $('.label').addClass('ui-widget');

  $('#scaleSlider').slider({
    change: pa.scaleImages,
    min: 10, // don't let images disappear
    max: 100,
    slide: pa.scaleImages,
    value: pa.layoutPercent
  });

  $('#layoutArea').on('click', 'img', pa.selectedImage);

  pa.lowestZ = 0;
  pa.highestZ = 0;

  pa.setupArrangeDialog();
};

pa.setupArrangeDialog = function () {
  pa.arrangeDialog = $('#arrangeDialog').dialog({
    autoOpen: false, // don't open when created
    modal: true,
    resizable: false,
    width: 200
  });

  $('#layoutArea').on('contextmenu', 'img', function (event) {
    pa.rightClicked = $(this);
    pa.arrangeDialog.dialog(
      'option',
      'position',
      [event.pageX, event.pageY]
    );
    pa.arrangeDialog.dialog('open');
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

// Changes the photo table so the rows
// have alternating background colors.
pa.stripeRows = function () {
  $('#photoTable tr:even').css('background-color', '#dfd');
  $('#photoTable tr:odd').css('background-color', '#ffd');
  pa.evaluateCheckboxes();
};

// Swaps the z-index values of the right-clicked image
// and the image at a given z-index.
pa.swapZ = function (z2) {
  var jq1, jq2, z1;
  jq1 = pa.rightClicked;
  jq2 = pa.getAtZ(z2);
  if (jq1 && jq2) {
    z1 = pa.getZ(jq1);
    jq1.css('z-index', z2);
    jq2.css('z-index', z1);
  }
  pa.dumpZs(); // for debugging
  pa.arrangeDialog.dialog('close');
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
