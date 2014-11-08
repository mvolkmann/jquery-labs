/*global __dirname: true */
'use strict';

var express = require('express');
var OAuth = require('OAuth').OAuth;
var qs = require('querystring');

var app = express();
app.use(express.static(__dirname));

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

function flickrCall(method, args, cb) {
  args.api_key = '0a18bc68c81a99b40b43bf6b098c7cca';
  args.format = 'json';
  args.method = method;
  args.nojsoncallback = 1;

  var apiUrl = 'https://api.flickr.com/services/rest?' + qs.stringify(args);
  var accessToken = null;
  var accessTokenSecret = null;
  oa.get(apiUrl, accessToken, accessTokenSecret, function (err, data) {
    if (err) {
      cb(err);
    } else {
      data = JSON.parse(data);
      cb(null, data);
    }
  });
}

function getPhotos(photoSetId, cb) {
  var args = {photoset_id: photoSetId};
  flickrCall('flickr.photosets.getPhotos', args, function (err, data) {
    if (err) return cb(err);

    var map = {};
    data.photoset.photo.forEach(function (photo) {
      map[photo.title] = photo;
    });
    cb(null, map);
  });
}

function getPhotoSets(userId, cb) {
  var args = {user_id: userId};
  flickrCall('flickr.photosets.getList', args, function (err, data) {
    if (err) return cb(err);

    var map = {};
    data.photosets.photoset.forEach(function (ps) {
      map[ps.title._content] = ps.id;
    });
    cb(null, map);
  });
}

function getUserId(username, cb) {
  var args = {url: 'https://www.flickr.com/photos/' + username};
  flickrCall('flickr.urls.lookupUser', args, function (err, data) {
    if (err) return cb(err);

    cb(null, data.user ? data.user.id : null);
  });
}

function handleResponse(res, err, data) {
  if (err) {
    res.status(err.statusCode).send(err);
  } else if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send();
  }
}

/**
 * ex. GET http://locallhost:3000/photos/{photo-set-id}
 */
app.get('/photos/:photoSetId', function (req, res) {
  var photoSetId = req.params.photoSetId;
  getPhotos(photoSetId, handleResponse.bind(null, res));
});

/**
 * ex. GET http://locallhost:3000/photosets?userid=61878924@N06
 */
app.get('/photosets/:userId', function (req, res) {
  var userId = req.params.userId;
  getPhotoSets(userId, handleResponse.bind(null, res));
});

/**
 * ex. GET http://locallhost:3000/userid?username=mark_volkmann
 */
app.get('/userid/:username', function (req, res) {
  var username = req.params.username;
  getUserId(username, handleResponse.bind(null, res));
});

var PORT = 3000;
app.listen(PORT);
console.log('server running at http://localhost:' + PORT);
