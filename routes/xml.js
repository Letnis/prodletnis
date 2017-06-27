module.exports = function(application){
	application.get('/getTodosXml', function(request, response){
		application.controllers.xml.getxml(application, request, response);
	});


	application.get('/verificaValidade', function(request, response){
		application.controllers.certificado.verificaValidade(application, request, response);
	});

	application.get('/verificaSenha', function(request, response){
		application.controllers.certificado.verificaSenha(application, request, response);
	});


	application.get('/servicos/buscaCte', function(request, response){
		application.controllers.cte.buscaCte(application, request, response);
	})

};