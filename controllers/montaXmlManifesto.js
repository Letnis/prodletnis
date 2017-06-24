module.exports.montaXmlManifesto = function (application, req, res) {

    var chnfe  = req.body.chnfe;
    var cnpj   = req.body.cnpj;
    var evento = req.body.evento;
    var id     = 'ID' + evento + chnfe + '01';

    var base_xml = '<envEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00"><idLote>8</idLote><evento versao="1.00"><infEvento Id="' + id + '"><cOrgao>91</cOrgao><tpAmb>2</tpAmb><CNPJ>' + cnpj + '</CNPJ><chNFe>' + chnfe + '</chNFe><dhEvento>2017-06-14T13:25:57-03:00</dhEvento><tpEvento>' + evento + '</tpEvento><nSeqEvento>1</nSeqEvento><verEvento>1.00</verEvento><detEvento versao="1.00"><descEvento>Ciencia da Operacao</descEvento></detEvento></infEvento></evento></envEvento>';


    //res.send(base_xml);

    var retorno = preparaXmlEnvioJava(base_xml);

    function preparaXmlEnvioJava(xml){
        var base64 = new Buffer(xml).toString('base64')
        //res.send(base64);
                                                                                                                                                                                                                                                                                                            
        var base_xml_para_java = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jav="http://javaXmlSigner.letnisup.com.br/">\r\n   <soapenv:Header>\r\n      <jav:senha>****</jav:senha>\r\n      <jav:certificado>/home/letnis/xmlSefaz/Letnis.pfx</jav:certificado>\r\n   </soapenv:Header>\r\n   <soapenv:Body>\r\n      <jav:assinaXmlManifesto>\r\n         <!--Optional:-->\r\n         <arg2>'+base64+'</arg2>\r\n      </jav:assinaXmlManifesto>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>'

        //res.send(base_xml_para_java);

        return base_xml_para_java;

    }

    return retorno;

}


module.exports.montaXmlManifestoSefaz = function(application, req, res, xml){
    var new_xml = xml.slice(38);
    var body_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rec="http://www.portalfiscal.inf.br/nfe/wsdl/RecepcaoEvento">\r\n   <soapenv:Header>\r\n      <rec:nfeCabecMsg>\r\n         <!--Optional:-->\r\n         <rec:versaoDados>1.00</rec:versaoDados>\r\n         <!--Optional:-->\r\n         <rec:cUF>35</rec:cUF>\r\n      </rec:nfeCabecMsg>\r\n   </soapenv:Header>\r\n   <soapenv:Body>\r\n      <rec:nfeDadosMsg>\r\n'+new_xml+'\r\n      </rec:nfeDadosMsg>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>';

    return body_xml;


}