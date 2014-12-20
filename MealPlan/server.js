/*global __dirname: true */
'use strict';

var express = require('express');
var fs = require('fs');
var SUCCESS = 200, BAD_REQUEST = 400;

var app = express();
app.use(express.static(__dirname));

// Used for item autocomplete.
app.get('/possible-items', function (req, res) {
  var path = __dirname + '/mealplan.json';

  fs.readFile(path, 'utf8', function (err, content) {
    var items, data, header, matches = [], re, statusCode;

    if (err) {
      data = path + ' not found';
      statusCode = BAD_REQUEST;
    } else {
      // Get the items that contain the given term.
      //console.log('term = "' + parsed.query.term + '"');
      re = new RegExp(req.query.term, 'i'); // ignore case
      items = JSON.parse(content);
      items.forEach(function (item) {
        if (re.test(item)) {
          matches.push(item);
        }
      });

      data = req.query.callback + '(' + JSON.stringify(matches) + ')';
      statusCode = SUCCESS;
    }

    res.status(statusCode).send(data);
  });
});

var PORT = 3000;
app.listen(PORT, function () {
  console.log('server running at http://localhost:' + PORT);
});
