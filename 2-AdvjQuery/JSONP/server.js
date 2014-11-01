'use strict';
var express = require('express');
var app = express();

// Serve static files in the current directory.
app.use(express.static(__dirname));

var PORT = 3000;
app.listen(PORT);
console.log('listening on port', PORT);
