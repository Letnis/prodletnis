module.exports = function(application){
	application.post('/enviaEvento', function(request, response){
		application.controllers.recepcaoevento.enviaEvento(application, request, response);
	});
};