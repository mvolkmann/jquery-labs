/*global $: false, alert: false */
'use strict';

//var key = 'd7NMR3Lp7zQukW1RorWw';
//var secret = 'yjK5W66F14cNoJwqjJLWU2OrHjMIV4GG3gOB9wFOy0';

// This was obtained by running
// node twitterBearerToken.js | pbcopy
var bearerToken = 'AAAAAAAAAAAAAAAAAAAAAIjwQAAAAAAAv9%2BIrrfYxndwTQZnkKlROIt8XdE%3DZIjxDgt9wkQ2JtY9IpMh4czsO5IFwCpUUHS1Kyng';

function processResponse(arr, textStatus) {
  var obj, url;

  if (textStatus && textStatus !== 'success') {
    alert('processResponse: textStatus = ' + textStatus);
  } else {
    obj = arr[0];
    //alert('obj = ' + JSON.stringify(obj));

    url = obj.profile_background_image_url;
    $('body').css('background-image', 'url(' + url + ')');
    $('#name').text(obj.name);
    $('#location').text(obj.location);
    $('#homepage').attr('href', obj.url);
    $('#homepage').text(obj.url);
    $('#description').text(obj.description);
    $('#photo').attr('src', obj.profile_image_url);
  }

  $('*').css('cursor', 'default');
}

function lookup() { 
  var url, username;

  $('*').css('cursor', 'wait');
  username = $('#username').val();
  url = 'https://api.twitter.com/1.1/users/lookup.json?screen_name=' + username;
  //url += '&callback=?';
  //$.getJSON(url, processResponse);
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    headers: {
      //accepts: 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + bearerToken
    },
    success: function (data) {
      console.log('data =', data);
    },
    error: function (err) {
      alert('Error: ' + JSON.stringify(err));
    }
  });
}

$(function () {
  // Get Twitter "bearer token".
  //var token = btoa(encodeURI(key) + ':' + encodeURI(secret));
  //console.log('token =', token);
  /*
  $.ajax({
    type: 'POST',
    url: 'http://api.twitter.com/oauth/token', 
    headers: {Authorization: 'Basic ' + token},
    data: 'grant_type=client_credentials',
    success: function (data) {
      console.log('data =', data);
      alert('Ready!');
    },
    error: function (err) {
      alert('Error!\n' + JSON.stringify(err));
    }
  });
  */

  $('#lookup').click(lookup);
});
