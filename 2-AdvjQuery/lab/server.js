/*global __dirname: true */
'use strict';

var express = require('express');
var OAuth = require('OAuth').OAuth;
var qs = require('querystring');

var app = express();
app.use(express.static(__dirname));

var apiKey = '0a18bc68c81a99b40b43bf6b098c7cca';
var flickrUrl = 'https://api.flickr.com/services/rest';

function configureOAuth() {
  var prefix = 'http://www.flickr.com/services/oauth/';
  var requestTokenUrl = prefix + 'request_token';
  var accessTokenUrl = prefix + 'access_token';
  var consumerKey = '87388cba5de9031f8f7319674ef9a5a6';
  var consumerSecret = 'e6e1d778d5cf7c08';
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

function getPhotoSets(cb) {
  var data = {
    api_key: apiKey,
    format: 'json',
    method: 'flickr.photosets.getList',
    nojsoncallback: 1,
    user_id: '61878924@N06'
  };

  var apiUrl = flickrUrl + '?' + qs.stringify(data);
  var accessToken = null;
  var accessTokenSecret = null;
  oa.get(apiUrl, accessToken, accessTokenSecret, function (err, data) {
    if (err) {
      cb(err);
    } else {
      var data = JSON.parse(data);
      var psArr = data.photosets.photoset;
      var names = psArr.map(function (ps) { return ps.title._content; });
      cb(null, names);
    }
  });
}

app.get('/photosets', function (req, res) {
  getPhotoSets(function (err, data) {
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
