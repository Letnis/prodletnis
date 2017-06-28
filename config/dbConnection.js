var mysql = require('mysql');

var connMySQL = function(){
	//console.log('Conexao com BD foi estabelecida');
	return mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '1234',
		database : 'letnis',
		multipleStatements: true
	});
};

module.exports = function(){
	//console.log('autoload carregou bd');
	return connMySQL;	
};

	