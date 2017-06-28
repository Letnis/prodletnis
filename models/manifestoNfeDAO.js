function manifestoNfeDAO(connection) {
    this._connection = connection;
};

manifestoNfeDAO.prototype.gravarDadosXmlNfeConsulta = function (dados, callback) {

    var async = require('async');
    var dadosGravar = [];
    var gravar = [];
    var x = 0;
    var nfe = 57;

    async.eachSeries(dados, function (prime, callback_each) {
        try {
            var chnfe = dados[x]['resNFe']['chNFe'];
            var cnpj  = dados[x]['resNFe']['CNPJ'];
            var nome  = dados[x]['resNFe']['xNome'];
            var ie    = dados[x]['resNFe']['IE'];
            var dhemi = dados[x]['resNFe']['dhEmi'];
            var data  = dhemi[0].substring(0,4) + dhemi[0].substring(5,7) + dhemi[0].substring(8,10);
            var nsu   = dados[x]['resNFe']['nsu'];
            var xml   = dados[x]['resNFe']['xml'];

            dadosGravar.push(["1", "1", chnfe, cnpj, nome, ie, data, nsu, xml]);
            nfe++;

        } catch (err) {
        }

        x++;
        callback_each();
    }, function (err) {
        if (err) { throw err; }
    });

    gravar.push(dadosGravar);
    console.log(gravar);
    var sql = 'insert xmlnfeconsulta (id_empresa, id_filial, chnfe, cnpj, nome, ie, dhemi, nsu, xml) values ?';
    var values = gravar;

    this._connection.query({ sql, values }, callback);


};

module.exports = function () {
    return manifestoNfeDAO;
}