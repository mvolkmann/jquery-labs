/*global $: false, alert: false */
'use strict';

function handleSuccess(arr) {
  var obj = arr[0];
  var url = obj.profile_background_image_url;
  $('body').css('background-image', 'url(' + url + ')');
  $('#name').text(obj.name);
  $('#location').text(obj.location);
  $('#homepage').attr('href', obj.url);
  $('#homepage').text(obj.url);
  $('#description').text(obj.description);
  $('#photo').attr('src', obj.profile_image_url);

  $('*').css('cursor', 'default');
}

function handleError(res) {
  alert(res.statusText);
}

function lookup() { 
  $('*').css('cursor', 'wait');

  var username = $('#screenName').val();
  $.getJSON('/twitter/user', {screenName: username}).
    then(handleSuccess, handleError);
}

$(function () {
  $('#lookup').click(lookup);
});
