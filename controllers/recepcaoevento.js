module.exports.enviaEvento = function (application, req, res) {

    var fs = require('fs');
    var request = require("request");
    var arrayResult = new Array();

    var specialRequest = request.defaults({});



    var xml = null;
    var dadosxml = null;
    var xml2js = require('xml2js');
    var newjson = null;

    //FUNÇÃO QUE IRÁ ENVIAR O XML ASSINADO PARA O SEFAZ
    function envia_sefaz(xml) {

        //body utilizado no período de testes:
        var body_testes = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rec="http://www.portalfiscal.inf.br/nfe/wsdl/RecepcaoEvento">\r\n   <soapenv:Header>\r\n      <rec:nfeCabecMsg>\r\n         <!--Optional:-->\r\n         <rec:versaoDados>1.00</rec:versaoDados>\r\n         <!--Optional:-->\r\n         <rec:cUF>35</rec:cUF>\r\n      </rec:nfeCabecMsg>\r\n   </soapenv:Header>\r\n   <soapenv:Body>\r\n      <rec:nfeDadosMsg>\r\n<envEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00"><idLote>8</idLote><evento versao="1.00"><infEvento Id="ID2102103517066050012100136855000000268399167894669001"><cOrgao>91</cOrgao><tpAmb>2</tpAmb><CNPJ>08433501000173</CNPJ><chNFe>35170660500121001368550000002683991678946690</chNFe><dhEvento>2017-06-14T13:25:57-03:00</dhEvento><tpEvento>210210</tpEvento><nSeqEvento>1</nSeqEvento><verEvento>1.00</verEvento><detEvento versao="1.00"><descEvento>Ciencia da Operacao</descEvento></detEvento></infEvento><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><Reference URI="#ID2102103517066050012100136855000000268399167894669001"><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>9CyaOeEreAoNtcy/4KT+nlnokAc=</DigestValue></Reference></SignedInfo><SignatureValue>VFZVBKVMXrG2h3PmKgZqhnbyEHlAKzufiTr7GOUSY7/xNiTx4+BmWhTf95/RyF2OeIJOrrhuQyoF0L3EeatV4O4vKe0amRHHR/p0O7lcSucTFsQ4QxgRSop7FOKgVOX9SJEWD3trApee9KZyJGjJHT/9assIoD1Ixpukemxu/Sf48AztpPQE4ckTtwuA/TUJnbC9CvRsWAABA5phZ7u0RQy4vbgWIzJGnG2WDMwM0fxZTv/RvRS3e7viQD0QJKkrWrjHp9gW51jQKUzIXIR3wvUooglZ/U64B3+BzhgHQmBNCw5VbKvVcxQf8NNh+6BbQ3T+fZrETYkzhwkEKIK4Mw==</SignatureValue><KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature></evento></envEvento>\r\n      </rec:nfeDadosMsg>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>';


        //esse é o body oficial:
        var body_xml = application.controllers.montaXmlManifesto.montaXmlManifestoSefaz(application, req, res, xml);
        var requestsefaz = require("request");
        var specialRequest = requestsefaz.defaults({
            agentOptions: {
                pfx: fs.readFileSync("Letnis.pfx"),
                passphrase: '*****'
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
    //var new_body = application.controllers.montaXmlManifesto.montaXmlManifesto(application, req, res);

    var new_body = null;

    var get_xml = new Promise((resolve, reject) => {
        resolve(new_body = application.controllers.montaXmlManifesto.montaXmlManifesto(application, req, res));
    });

    get_xml.then(() => {

        //old_body contem a string que utilizamos em testes:
        var old_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jav="http://javaXmlSigner.letnisup.com.br/">\r\n   <soapenv:Header>\r\n      <jav:senha>*****</jav:senha>\r\n      <jav:certificado>/home/letnis/xmlSefaz/Letnis.pfx</jav:certificado>\r\n   </soapenv:Header>\r\n   <soapenv:Body>\r\n      <jav:assinaXmlManifesto>\r\n         <!--Optional:-->\r\n         <arg2>PGVudkV2ZW50byB4bWxucz0iaHR0cDovL3d3dy5wb3J0YWxmaXNjYWwuaW5mLmJyL25mZSIgdmVyc2FvPSIxLjAwIj48aWRMb3RlPjg8L2lkTG90ZT48ZXZlbnRvIHZlcnNhbz0iMS4wMCI+PGluZkV2ZW50byBJZD0iSUQyMTAyMTAzNTE3MDY2MDUwMDEyMTAwMTM2ODU1MDAwMDAwMjY4Mzk5MTY3ODk0NjY5MDAxIj48Y09yZ2FvPjkxPC9jT3JnYW8+PHRwQW1iPjI8L3RwQW1iPjxDTlBKPjA4NDMzNTAxMDAwMTczPC9DTlBKPjxjaE5GZT4zNTE3MDY2MDUwMDEyMTAwMTM2ODU1MDAwMDAwMjY4Mzk5MTY3ODk0NjY5MDwvY2hORmU+PGRoRXZlbnRvPjIwMTctMDYtMTRUMTM6MjU6NTctMDM6MDA8L2RoRXZlbnRvPjx0cEV2ZW50bz4yMTAyMTA8L3RwRXZlbnRvPjxuU2VxRXZlbnRvPjE8L25TZXFFdmVudG8+PHZlckV2ZW50bz4xLjAwPC92ZXJFdmVudG8+PGRldEV2ZW50byB2ZXJzYW89IjEuMDAiPjxkZXNjRXZlbnRvPkNpZW5jaWEgZGEgT3BlcmFjYW88L2Rlc2NFdmVudG8+PC9kZXRFdmVudG8+PC9pbmZFdmVudG8+PC9ldmVudG8+PC9lbnZFdmVudG8+</arg2>\r\n      </jav:assinaXmlManifesto>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>'


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