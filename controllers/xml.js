module.exports.getxml = function (application, req, res) {
    //este serviço espera no body a senha do certificado, cnpj, uf e caminho do certificado
    var fs = require('fs');
    var request = require("request");
    var arrayResult = new Array();

    var specialRequest = request.defaults({
        agentOptions: {
            pfx: fs.readFileSync(req.query.path_certificado),
            passphrase: req.query.senha
        }
    });

    var body = application.controllers.montaXmlManifesto.montaXmlGetNotas(application, req, res);

    var options = {
        method: 'POST',
        url: 'https://hom.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx',
        qs: { WSDL: '' },
        headers:
        {
            'postman-token': '07c55f99-6ec2-7a2b-7ef4-c326e20d69e4',
            'cache-control': 'no-cache',
            'content-type': 'text/xml'
        },
        body: body
    };

    specialRequest(options, function (error, response, body) {
        if (error) throw new Error(error);
        var parseString = require('xml2js').parseString;
        //console.log(body);
        parseString(body, function (err, result) {
            application.controllers.trataretornosefaz.trataRetornoSefaz(result, req, res, application, parseString, arrayResult, function () {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
                res.setHeader('Access-Control-Allow-Credentials', true); // If needed	
                var myJsonString = JSON.stringify(arrayResult);
                var connection = application.config.dbConnection();
                var xmlDAO = new application.models.manifestoNfeDAO(connection);
                xmlDAO.gravarDadosXmlNfeConsulta(arrayResult, function (error, result) {
                    if (error) {
                        console.log(error);
                        res.json({ msg: 'Erro ao inserir dados',
                                   detalhes: error});
                    } else {
                        res.json({ msg: 'Dados inseridos com sucesso',
                                  detaçjes: result });
                    }
                })

            });
        })

    })

}