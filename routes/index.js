module.exports = function (application) {
	application.get('/', function (request, response) {
		response.render('index');
	});

};