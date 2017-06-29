module.exports = function (application) {

	var path = require('path');

	application.get('/', function (request, response) {
		response.render('index');
	});
};