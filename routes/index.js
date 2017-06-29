module.exports = function(application){
	application.get('/', function(request, response){
        res.render("../views/index.html");
	});
};