function manifestoNfeDAO(connection) {
    this._connection = connection;
};

manifestoNfeDAO.prototype.gravarDadosXmlNfeConsulta = function (application, dados, callback) {

    var async = require('async');
    var dadosGravar = [];
    var gravar = [];
    var x = 0;
    var arrayNsu = [];

    async.eachSeries(dados, function (prime, callback_each) {
        try {
            var chnfe = dados[x]['resNFe']['chNFe'];
            var cnpj = dados[x]['resNFe']['CNPJ'];
            var nome = dados[x]['resNFe']['xNome'];
            var ie = dados[x]['resNFe']['IE'];
            var dhemi = dados[x]['resNFe']['dhEmi'];
            var data = dhemi[0].substring(0, 4) + dhemi[0].substring(5, 7) + dhemi[0].substring(8, 10);
            var nsu = dados[x]['resNFe']['nsu'];
            var xml = dados[x]['resNFe']['xml'];


            dadosGravar.push(["1", "1", chnfe, cnpj, nome, ie, data, nsu, xml]);
            //arrayNsu.push(["1", "1", nsu]); //vetor para fazer atualização da tabela de NSU's

        } catch (err) {
            console.log(err);
        }

        x++;
        callback_each();
    }, function (err) {
        if (err) { throw err; }
    });

    x--;

    arrayNsu.push([dadosGravar[x][0], dadosGravar[x][1], dadosGravar[x][7]]); //array para atualizar tabela de NSU

    gravar.push(dadosGravar);
    var sql = 'replace into xmlnfeconsulta (id_empresa, id_filial, chnfe, cnpj, nome, ie, dhemi, nsu, xml) values ?';

    //var sql = 'insert xmlnfeconsulta (id_empresa, id_filial, chnfe, cnpj, nome, ie, dhemi, nsu, xml) values ?';
    var values = gravar;

    this._connection.query({ sql, values }, function (error, result) {
        if (error) {
            return;
        } else {
            var connection = this._connection;
            var xmlDAO = new application.models.manifestoNfeDAO(connection);
            xmlDAO.atualizarNsuManifestoNfe(arrayNsu, callback);
        }
    });

};

manifestoNfeDAO.prototype.atualizarNsuManifestoNfe = function (dados, callback) {

    var sql = 'replace into manifestonfensu (id_empresa, id_filial, nsu) values ?';

    var values = [dados];
    this._connection.query({ sql, values }, callback);
}

module.exports = function () {
    return manifestoNfeDAO;
}