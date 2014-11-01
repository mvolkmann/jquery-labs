/*global __dirname: true */
'use strict';

// This is an HTTP service that returns a JSON array
// of artist name strings from the file artists.json
// that contain a given "term" (passed as a query parameter).
// The JSON array is returned using JSONP.

var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    PORT = 3000,
    BAD_REQUEST = 400,
    SUCCESS = 200;

http.createServer(function (req, res) {
  var parsed, path;

  // The true argument causes query parameters to be parsed.
  parsed = url.parse(req.url, true);
  path = __dirname + '/artists.json';

  fs.readFile(path, 'utf8', function (err, content) {
    var artists, data, header, matches = [], re, statusCode;

    if (err) {
      data = path + ' not found';
      statusCode = BAD_REQUEST;
    } else {
      // Get the artist names that contain the given term.
      //console.log('term = "' + parsed.query.term + '"');
      re = new RegExp(parsed.query.term, 'i'); // ignore case
      artists = JSON.parse(content);
      artists.forEach(function (artist) {
        if (re.test(artist)) {
          matches.push(artist);
        }
      });

      data = parsed.query.callback + '(' + JSON.stringify(matches) + ')';
      statusCode = SUCCESS;
    }

    //header = { 'Content-Type': 'application/json' }; // when $.ajax dataType is 'json'
    header = { 'Content-Type': 'text/javascript' }; // when $.ajax dataType is 'jsonp'
    res.writeHead(statusCode, header);
    //console.log('data = "' + data + '"');
    res.end(data);
  });
}).listen(PORT);

console.log('Server running at http://localhost:' + PORT);
console.log('Open index.html from file system.');
