var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var api = require('./api/api.js')
const port = 4201;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(api);

console.log("Server is listening on port ", port);
app.listen(port);