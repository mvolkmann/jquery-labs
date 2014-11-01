'use strict';
/*global __dirname: true */

var app,
    express = require('express'),
    PORT = 3000,
    SUCCESS = 200;

app = express();
app.use(express.static(__dirname));

app.get('/greet', function (req, res) {
  var header, firstName, lastName;

  // The true parameter causes query parameters to be parsed.
  firstName = req.query.firstName;
  lastName = req.query.lastName;
  console.log('received ' + firstName + ' ' + lastName);

  header = {'Content-Type': 'text/plain'};
  res.writeHead(SUCCESS, header);
  res.end('Hello, ' + firstName + ' ' + lastName + '!');
});

app.listen(PORT);
console.log('server running at http://localhost:' + PORT);
