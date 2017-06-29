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

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './views');
/* configurar o middleware express.static */
app.use(express.static('./react'));


consign().include('routes')
    .then('controllers')
    .then('models')
	.then('config/dbConnection.js')     
	.into(app);

module.exports = app;