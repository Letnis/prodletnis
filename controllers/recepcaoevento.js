module.exports.enviaEvento = function (application, req, res) {

    var fs             = require('fs');
    var request        = require("request");
    var arrayResult    = new Array();
    var specialRequest = request.defaults({});
    var xml            = null;
    var dadosxml       = null;
    var xml2js         = require('xml2js');
    var newjson        = null;

    //FUNÇÃO QUE IRÁ ENVIAR O XML ASSINADO PARA O SEFAZ
    function envia_sefaz(xml) {

        //esse é o body oficial:
        var body_xml = application.controllers.montaXmlManifesto.montaXmlManifestoSefaz(application, req, res, xml);
        var requestsefaz = require("request");
        var specialRequest = requestsefaz.defaults({
            agentOptions: {
                pfx: fs.readFileSync(req.body.path_certificado),
                passphrase: req.body.senha
            }
        });

        var options = {
            method: 'POST',
            url: 'https://hom.nfe.fazenda.gov.br/RecepcaoEvento/RecepcaoEvento.asmx',
            headers:
            {
                'postman-token': '6ada22cf-0e6c-6698-087d-d90ce7d226e3',
                'cache-control': 'no-cache',
                'content-type': 'text/xml'
            },
            body: body_xml
        };

        specialRequest(options, function (error, response, body) {
            if (error) throw new Error(error);

            var parser = xml2js.Parser();

            parser.parseString(body, function (err, data) {
                res.send(data);
            })
        });

    }


    //função que le o xml de retorno, pega a tag que tem a base64 e converte ela para XML novamente
    function converte_base_64_xml(base64) {
        var parser = xml2js.Parser();

        parser.parseString(base64, function (err, data) {
            dadosxml = data['S:Envelope']['S:Body'][0]['ns2:assinaXmlManifestoResponse'][0]['return'][0];
            xml = Buffer.from(dadosxml, 'base64');
            //variavel xml contém o xml assinado para ser enviado ao sefaz            
        })

    }

    //CHAMA A ROTINA EM JAVA QUE IRÁ ASSINAR O XML:
    var new_body = null;

    //MONTA O XML QUE IRÁ PARA O JAVA:
    var get_xml = new Promise((resolve, reject) => {
        resolve(new_body = application.controllers.montaXmlManifesto.montaXmlManifesto(application, req, res));
    });

    //APÓS O XML SER MONTADO, CHAMA O SERVIÇO JAVA QUE ASSINA O XML
    get_xml.then(() => {

        var options = {
            method: 'POST',
            url: 'http://localhost:3000/signXmlManifesto',
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'text/xml'
            },                                                                                                                                                                                                                              //C:\\Users\\muril\\Google Drive\\WK_NODE\\Letnis.pfx
            body: new_body
        };

        //APÓS A CHAMADA DO SERVIÇO, É EXECUTA A FUNÇÃO QUE PEGA O XML ASSINADO E O ENVIA PARA O SEFAZ
        specialRequest(options, function (error, response, body) {
            if (error) throw new Error(error);
            var exec = new Promise((resolve, reject) => {
                resolve(converte_base_64_xml(body));
            });

            exec.then(() => {
                envia_sefaz(xml);
            });

        });

    });

}