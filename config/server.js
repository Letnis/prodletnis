var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var request = require('request'),
    fs = require('fs'),
    async = require('async');
    var consign = require('consign');



// ****************** Middle Ware *******************
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

consign().include('routes')
    .then('controllers')
	.into(app);

module.exports = app;