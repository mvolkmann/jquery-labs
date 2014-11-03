/*global __dirname: true */
'use strict';

var express = require('express');
var OAuth = require('oauth').OAuth;

var accessToken = '16169402-FUMRgqlG7czFu9lJuRt3f21gtD2kwkKoyFI6kjJM8';
var accessTokenSecret = 'YsyixWYjuqfApS3CDsIMR0HMKUqjadS9HY9HkO41V4';

var app = express();
app.use(express.static(__dirname));

function configureOAuth() {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var consumerKey = 'd7NMR3Lp7zQukW1RorWw';
  var consumerSecret = 'yjK5W66F14cNoJwqjJLWU2OrHjMIV4GG3gOB9wFOy0';
  var oAuthVersion = '1.0A';
  var authorizeCallback = null;
  var signatureMethod = 'HMAC-SHA1';

  return new OAuth(
    requestTokenUrl,
    accessTokenUrl,
    consumerKey,
    consumerSecret,
    oAuthVersion,
    authorizeCallback,
    signatureMethod);
}

var oa = configureOAuth();

function getUserData(screenName, cb) {
  var apiUrl = 'https://api.twitter.com/1.1/users/lookup.json';
  apiUrl += '?screen_name=' + screenName;
  oa.get(apiUrl, accessToken, accessTokenSecret, cb);
}

app.get('/twitter/user', function (req, res) {
  var screenName = req.query.screenName;
  getUserData(screenName, function (err, data) {
    if (err) {
      res.status(err.statusCode).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

var PORT = 3000;
app.listen(PORT);
console.log('server running at http://localhost:' + PORT);
