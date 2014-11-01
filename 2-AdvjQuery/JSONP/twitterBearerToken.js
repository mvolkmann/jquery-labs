'use strict';

// This demonstrates getting the OAuth bearer token
// for a Twitter consumer key an consumer secret.
// To run it,
// - npm install -g request
// - node twitterBearerToken.js

var request = require('request');

var consumerKey = 'd7NMR3Lp7zQukW1RorWw';
var consumerSecret = 'yjK5W66F14cNoJwqjJLWU2OrHjMIV4GG3gOB9wFOy0';
var encSecret =
  new Buffer(consumerKey + ':' + consumerSecret).toString('base64');
var oauthOptions = {
  url: 'https://api.twitter.com/oauth2/token',
  headers: {Authorization: 'Basic ' + encSecret},
  body: 'grant_type=client_credentials'
};
// See https://github.com/mikeal/request for other options
// for dealing with "OAuth Signing".
 
request.post(oauthOptions, function(err, res, body) {
  var obj = JSON.parse(body);
  var bearerToken = obj.access_token;
  console.log('bearerToken =', bearerToken);

  var username = 'mark_volkmann';
  var options = {
    url: 'https://api.twitter.com/1.1/users/lookup.json?screen_name=' + username,
    headers: {Authorization: 'Bearer ' + bearerToken},
    json: true
  };
  request.get(options, function (err, res, data) {
    if (err) throw err;
    var obj = data[0];
    console.log('Name:', obj.name);
    console.log('Location:', obj.location);
    console.log('Home Page URL:', obj.url);
    console.log('Photo URL:', obj.profile_image_url);
    console.log('Background URL:', obj.profile_background_image_url);
  });
});
