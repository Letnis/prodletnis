module.exports = function(application){
	application.get('/getTodosXml', function(request, response){
		application.controllers.xml.getxml(application, request, response);
	});

};