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
    img = $('<img>', { src: url });
    img.addClass('photo');
    td = $('<td>');
    td.append(img);
    tr.append(td);
    tr.append('<td>' + desc + '</td>');

    td = $('<td>');
    input = $('<input class="date" size="10" type="text"/>');
    input.datepicker();
    td.append(input);
    tr.append(td);

    $('#photoTable').append(tr);
  }

  function changeZ(z) {
    rightClicked.css('z-index', z);
    lowestZ = Math.min(pa.lowestZ, z);
    highestZ = Math.max(pa.highestZ, z);

    if (z < 0) {
      // Due to http://bugs.jqueryui.com/ticket/4461 which says
      // nodes with negative z-index values cannot be dragged,
      // make all z-index values positive.
      layoutArea.children().each(function (index, node) {
        var jq = $(node);
        jq.css('z-index', pa.getZ(jq) - z);
      });
      lowestZ -= z;
      highestZ -= z;
    }

    arrangeDialog.dialog('close');
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
      console.log(img.attr('alt') + ' - z=' + pa.getZ(img));
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

    pa.layoutArea.children().each(function (index, node) {
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
        newImg = $('<img>', { alt: alt, src: src });
        newImg.data('heightPercentage', layoutPercent);
        newImg.css('height', layoutPercent + '%');
        newImg.css('position', 'absolute');
        highestZ += 1;
        newImg.css('z-index', pa.highestZ);
        newImg.addClass('layout');

        newImg.draggable();
        layoutArea.append(newImg);
      }
    });

    $('#layoutArea').selectable({selected: selectedImage});
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
            button = $('<button>');
            button.attr('id', 'ps' + id);
            button.attr('type', 'button');
            button.text(name);
            button.addClass('photoSetButton');
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
    var value = $('#scaleSlider').slider('value');
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
      $('#scaleSlider').slider('value', height);
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

    $('#mode').click(pa.toggleMode);
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

    $('body input[type="button"]').button();

    $('.label').addClass('ui-widget');

    $('#scaleSlider').slider({
      change: pa.scaleImages,
      min: 10, // don't let images disappear
      max: 100,
      slide: pa.scaleImages,
      value: pa.layoutPercent
    });

    $('#layoutArea').on('click', 'img', selectImage);

    lowestZ = 0;
    highestZ = 0;

    setupArrangeDialog();
  }

  function setupArrangeDialog() {
    arrangeDialog = $('#arrangeDialog').dialog({
      autoOpen: false, // don't open when created
      modal: true,
      resizable: false,
      width: 200
    });

    $('#layoutArea').on('contextmenu', 'img', function (event) {
      rightClicked = $(this);
      arrangeDialog.dialog(
        'option',
        'position',
        [event.pageX, event.pageY]
      );
      arrangeDialog.dialog('open');
      return false; // prevent browser context menu from appearing
    });

    $('#back').click(function () {
      changeZ(lowestZ - 1);
    });

    $('#backward').click(function () {
      swapZ(getZ(rightClicked) - 1);
    });

    $('#forward').click(function () {
      swapZ(getZ(pa.rightClicked) + 1);
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
    dumpZs(); // for debugging
    arrangeDialog.dialog('close');
  }

  // Toggles between data entry and layout mode.
  function toggleMode() {
    var button, buttonText;

    button = $(this);
    buttonText = button.val();

    if (buttonText === 'Layout Mode') {
      entry.hide();
      photoTable.hide();
      layout.show();
      button.val('Entry Mode');
      layoutPhotos();
    } else {
      layout.hide();
      entry.show();
      photoTable.show();
      button.val('Layout Mode');
    }
  }

  // Registers a function to be called when the document is ready.
  $(setup);
})();
