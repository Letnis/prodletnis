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

    var body = null;
    var connection = application.config.dbConnection();
    var xmlDAO = new application.models.manifestoNfeDAO(connection);

    //busca a filial a partir do cnpj informado
    xmlDAO.getFilialporCnpj(application, req.query.cnpj, function (err, result) {

        //busca o ultimo nsu para essa filial
        xmlDAO.getUltimoNsuManifestoNfe(application, result[0].id_filial, function (err, result) {

            //monta o body do xml com a informação do ultimo nsu
            body = application.controllers.montaXmlManifesto.montaXmlGetNotas(application, req, res, result[0].nsu);

            //monta a chamada do web service
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


            //chama o webservice
            specialRequest(options, function (error, response, body) {
                if (error) throw new Error(error);
                var parseString = require('xml2js').parseString;


                parseString(body, function (err, result) {
                    application.controllers.trataretornosefaz.trataRetornoSefaz(result, req, res, application, parseString, arrayResult, function () {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
                        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
                        res.setHeader('Access-Control-Allow-Credentials', true); // If needed	
                        var myJsonString = JSON.stringify(arrayResult);
                        var connection = application.config.dbConnection();
                        var xmlDAO = new application.models.manifestoNfeDAO(connection);

                        //grava os dados dos XML retornados pelo SEFAZ 
                        xmlDAO.gravarDadosXmlNfeConsulta(application, arrayResult, function (error, result) {
                            if (error) {
                                console.log(error);
                                res.json({
                                    msg: 'Erro ao inserir dados',
                                    detalhes: error
                                });
                            } else {
                                res.json({
                                    msg: 'Dados inseridos com sucesso',
                                    detaçjes: result
                                });
                            }
                        })

                    });
                })

            })

        })
    })














}