module.exports.getxml = function(application, req, res){
        
    var fs = require('fs');
    var request = require("request");
    var arrayResult = new Array();

    var specialRequest = request.defaults({
        agentOptions: {
            pfx: fs.readFileSync("Letnis.pfx"),
            passphrase: '*****'
        }
    });

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
        body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:nfed="http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <nfed:nfeDistDFeInteresse>\r\n         <nfed:nfeDadosMsg>\r\n            <distDFeInt versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">\r\n               <tpAmb>2</tpAmb>\r\n               <cUFAutor>35</cUFAutor>\r\n               <CNPJ>08433501000173</CNPJ>\r\n               <distNSU>\r\n                  <ultNSU>000000000000000</ultNSU>\r\n               </distNSU>\r\n            </distDFeInt>\r\n         </nfed:nfeDadosMsg>\r\n      </nfed:nfeDistDFeInteresse>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>'
    };

    specialRequest(options, function (error, response, body) {
        if (error) throw new Error(error);

        var parseString = require('xml2js').parseString;

        parseString(body, function (err, result) {
            application.controllers.trataretornosefaz.trataRetornoSefaz(result, req, res, application, parseString, arrayResult, function(){
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

    })

}