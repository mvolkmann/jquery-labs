(function () {
  /*global $: false, alert: false, document: false, OAuth: false */
  'use strict';

  var arrangeDialog, deleteButton, descField, entry,
    flickrUserName, flickrUserNameField, highestZ, layout, layoutArea,
    lowestZ, photoTable, rightClicked, selectedImage, urlField;
  var layoutPercent = 50;

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
    var img, input, td, tr;

    tr = $('<tr>');
    tr.append('<td><input type="checkbox"/></td>');
    img = $('<img>', {alt: desc, src: url});
    img.addClass('photo');
    td = $('<td>');
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
  }

  function changeZ(z) {
    // TODO: The element that was right-clicked is referred to by rightClicked.
    // TODO: Set the CSS property 'z-index' of that element
    // TODO: to the z value passed in.

    lowestZ = Math.min(lowestZ, z);
    highestZ = Math.max(highestZ, z);

    if (z < 0) {
      // Due to http://bugs.jqueryui.com/ticket/4461 which says
      // nodes with negative z-index values cannot be dragged,
      // make all z-index values positive.
      layoutArea.children().each(function (index, node) {
        var jq = $(node);
        jq.css('z-index', getZ(jq) - z);
      });
      lowestZ -= z;
      highestZ -= z;
    }

    // TODO: Close the dialog referred to by arrangeDialog.

    dumpZs();
  }

  // Deletes all the selected rows in the photo table.
  function deletePhotos() {
    $('#photoTable :checkbox:checked').each(function (index, input) {
      var tr, src;
      tr = $(input).parent().parent();
      src = tr.find('img').attr('src');
      tr.remove();

      // Remove the image from the layoutArea if present.
      layoutArea.children('img[src="' + src + '"]').remove();
    });

    deleteButton.attr('disabled', true);
  }

  // For debugging.
  function dumpZs() {
    layoutArea.children().each(function (index, node) {
      var img = $(node);
      console.log(img.attr('alt') + ' - z=' + getZ(img));
    });
  }

  // Enables/disables the "Delete" button
  // based on whether any rows are selected.
  function evaluateCheckboxes() {
    var checked = $('#photoTable :checkbox:checked');
    deleteButton.attr('disabled', checked.size() === 0);
  }

  // Gets the jQuery-wrapped DOM node in the layout area
  // with a given z-index.
  function getAtZ(z) {
    var jqAtZ;

    layoutArea.children().each(function (index, node) {
      var jq = $(node);
      if (getZ(jq) === z) {
        jqAtZ = jq;
        return false; // to terminate each
      }
    });

    return jqAtZ;
  }

  // Gets the z-index of a jQuery-wrapped DOM node.
  function getZ(jq) {
    return parseInt(jq.css('z-index'), 10);
  }

  // Allows user to drag and resize photos.
  function layoutPhotos() {
    photoTable.find('img').each(function (index, imgNode) {
      var alt, height, img, newImg, src;

      img = $(imgNode);
      alt = img.attr('alt');
      src = img.attr('src');
      height = img.css('height');

      // If layoutArea doesn't already contain this image, add it.
      img = layoutArea.children('img[src="' + src + '"]');
      if (img.size() === 0) {
        newImg = $('<img>', {alt: alt, src: src});
        newImg.data('heightPercentage', layoutPercent);
        newImg.css('height', layoutPercent + '%');
        newImg.css('position', 'absolute');
        highestZ += 1;
        newImg.css('z-index', highestZ);
        newImg.addClass('layout');

        // TODO: Make the image referred to by newImg draggable.

        layoutArea.append(newImg);
      }
    });

    // TODO: Make the layout area selectable.
    // TODO: Set the "filter" option to only allow img elements to be selected.
    $('#layoutArea').selectable({filter: 'img'});
  }

  // Displays a thumbnail of a given photo
  // under the Flickr photoset buttons.
  function loadFlickrPhoto(photo) {
    var div, img, url;

    url = 'http://farm' + photo.farm +
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
              addClass('photoSetButton').
              button(); // make it a jQuery UI button
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

  // Scales the selected images in layout mode.
  function scaleImages() {
    // TODO: Set variable "value" to the value of the slider
    // TODO: with an id of "scaleSlider".
    var value;

    $('.ui-selected').each(function (index, imgNode) {
      var img = $(imgNode);
      img.css('height', value + '%');
      img.data('heightPercentage', value);
    });
  }

  // Populates the URL and description fields
  // with data from the selected Flickr picture.
  function selectFlickrPhoto() {
    descField.val(this.title);
    urlField.val(this.src);
  }

  // Called when an image is clicked in layout mode.
  function selectImage() {
    var height, img = $(this);
    img.toggleClass('ui-selected');

    if (img.hasClass('ui-selected')) {
      // Change the value of the slider to match
      // the height percentage of the clicked image.
      height = img.data('heightPercentage');

      // TODO: Set the value of the slider with id "scaleSlider" to height.
    }
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

    $('#mode').click(toggleMode);
    entry = $('#entry');
    photoTable = $('#photoTable');
    layout = $('#layout');
    layoutArea = $('#layoutArea');
    layout.hide();

    $('#getPhotoSets').click(loadFlickrPhotoSets);

    $('#photoTable').on(
      'change', 'input[type="checkbox"]', evaluateCheckboxes);

    $(document).on('click', '.photoSetButton', loadFlickrPhotos);

    $(document).on('click', 'img.thumbnail', selectFlickrPhoto);

    // TODO: Make all button elements be jQuery UI buttons.

    $('.label').addClass('ui-widget');

    // TODO: Make the div with id "scaleSlider" be a slider.
    // TODO: Configure it so when the user drags the slider,
    // TODO: scaleImages is called (both "slide" and "change" events).
    // TODO: Set the minimum and maximum values to 10 and 100.
    // TODO: Set the initial value to layoutPercent.

    // TODO: Use the "on" method to register a click handler
    // TODO: on any "img" tag that is added to #layoutArea.
    // TODO: When an image is clicked, call selectImage.

    lowestZ = 0;
    highestZ = 0;

    setupArrangeDialog();
  }

  function setupArrangeDialog() {
    // TODO: Set arrangeDialog to a dialog created from
    // TODO: the div with id "arrangeDialog".
    // TODO: Configure it so it doesn't open when created.
    // TODO: Make it modal.
    // TODO: Make it non-resizable.
    // TODO: Set its width to 200.

    $('#layoutArea').on('contextmenu', 'img', function (event) {
      rightClicked = $(this);
      arrangeDialog.dialog(
        'option',
        'position',
        {
          my: 'left top',
          at: 'left+' + event.pageX + ' top+' + event.pageY,
          of: window
        }
      );

      // TODO: Open arrangeDialog.

      return false; // prevent browser context menu from appearing
    });

    $('#back').click(function () {
      changeZ(lowestZ - 1);
    });

    $('#backward').click(function () {
      swapZ(getZ(rightClicked) - 1);
    });

    $('#forward').click(function () {
      swapZ(getZ(rightClicked) + 1);
    });

    $('#front').click(function () {
      changeZ(highestZ + 1);
    });
  }

  // Changes the photo table so the rows
  // have alternating background colors.
  function stripeRows() {
    $('#photoTable tr:even').css('background-color', '#dfd');
    $('#photoTable tr:odd').css('background-color', '#ffd');
    evaluateCheckboxes();
  }

  // Swaps the z-index values of the right-clicked image
  // and the image at a given z-index.
  function swapZ(z2) {
    var jq1, jq2, z1;
    jq1 = rightClicked;
    jq2 = getAtZ(z2);
    if (jq1 && jq2) {
      z1 = getZ(jq1);
      jq1.css('z-index', z2);
      jq2.css('z-index', z1);
    }
    //dumpZs(); // for debugging

    // TODO: Close arrangeDialog.
  }

  // Toggles between data entry and layout mode.
  function toggleMode() {
    var button, buttonText;

    button = $(this);
    buttonText = button.text();

    if (buttonText === 'Layout Mode') {
      entry.hide();
      photoTable.hide();
      layout.show();
      button.text('Entry Mode');
      layoutPhotos();
    } else {
      layout.hide();
      entry.show();
      photoTable.show();
      button.text('Layout Mode');
    }
  }

  // Registers a function to be called when the document is ready.
  $(setup);
})();
