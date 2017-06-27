module.exports.buscaCte = function (application, req, res) {
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

    //var body = application.controllers.montaXmlManifesto.montaXmlGetNotas(application, req, res);

    var options = {
        method: 'POST',
        url: 'https://hom1.cte.fazenda.gov.br/CTeDistribuicaoDFe/CTeDistribuicaoDFe.asmx',
        qs: { WSDL: '' },
        rejectUnauthorized: false,
        headers:
        {
            'postman-token': '07c55f99-6ec2-7a2b-7ef4-c326e20d69e4',
            'cache-control': 'no-cache',
            'content-type': 'text/xml'
        },
        body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cted="http://www.portalfiscal.inf.br/cte/wsdl/CTeDistribuicaoDFe">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <cted:cteDistDFeInteresse>\r\n         <!--Optional:-->\r\n         <cted:cteDadosMsg>\r\n               <distDFeInt versao="1.00" xmlns="http://www.portalfiscal.inf.br/cte">\r\n               <tpAmb>2</tpAmb>  \r\n               <cUFAutor>35</cUFAutor>\r\n               <CNPJ>08433501000173</CNPJ> \r\n              <!-- 03571044000160 08433501000173 -->\r\n               \t<distNSU>\r\n               \t\t<ultNSU>000000000000000</ultNSU>\r\n               \t</distNSU>\r\n               </distDFeInt>\r\n         </cted:cteDadosMsg>\r\n      </cted:cteDistDFeInteresse>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>'
    };

    specialRequest(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.send(body);
        /*
        var parseString = require('xml2js').parseString;

        parseString(body, function (err, result) {
            application.controllers.trataretornosefaz.trataRetornoSefaz(result, req, res, application, parseString, arrayResult, function () {
                console.log('resultado');
                console.log(arrayResult);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
                res.setHeader('Access-Control-Allow-Credentials', true); // If needed	
                var myJsonString = JSON.stringify(arrayResult);
                //res.send(arrayResult);
                res.send(myJsonString);
            });
        })
        */
    })

}