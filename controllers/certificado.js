module.exports.converteCert = function (application, req, res) {
    console.log('converte cert');

    var os = require('os');
    if (os.platform() == 'win32') {
        var chilkat = require('chilkat_node6_win32');
    } else if (os.platform() == 'linux') {
        if (os.arch() == 'arm') {
            var chilkat = require('chilkat_node6_arm');
        } else if (os.arch() == 'x86') {
            var chilkat = require('chilkat_node6_linux32');
        } else {
            var chilkat = require('chilkat_node6_linux64');
        }
    } else if (os.platform() == 'darwin') {
        var chilkat = require('chilkat_node6_macosx');
    }

    var strPem = null;



    function chilkatExample() {

        var pfx = new chilkat.Pfx();

        var success = pfx.LoadPfxFile(req.query.path_certificado, req.query.senha);
        if (success !== true) {
            console.log(pfx.LastErrorText);
            return;
        }

        //  If extendedAttrs is true, then extended properties (Bag Attributes and Key Attributes) are included in the output.
        var extendedAttrs = false;
        //  Set noKeys = true to omit private keys from the output.
        var noKeys = false;
        //  Set noCerts = true to omit certificates from the output.
        var noCerts = false;
        //  Set noCaCerts = true to omit CA certificates from the output.
        var noCaCerts = false;
        //  The encrypt algorithm can be "des3", "aes128", "aes192", or "aes256"
        var encryptAlg = "aes128";
        var pemPassword = req.query.senha;

        strPem = pfx.ToPemEx(extendedAttrs, noKeys, noCerts, noCaCerts, encryptAlg, pemPassword);
        return strPem;

    }

    return chilkatExample();
}


module.exports.verificaValidade = function (application, req, res) {
    var pem = require('pem');
    var strPem = null;
    pem.config({
        pathOpenSSL: 'C:\\OpenSSL-Win64\\bin\\openssl.exe'
    });


    var getPem = new Promise((resolve, reject) => {
        resolve(strPem = application.controllers.certificado.converteCert(application, req, res));
    });

    getPem.then(() => {
        pem.readCertificateInfo(strPem, function (err, cert) {
            var d = new Date(cert.validity.end);
            //data de validade
            var data = (d.getDate() + '' + d.getMonth() + '' + d.getFullYear());


            res.send(data);
            return (data);
        })
    });


}

module.exports.verificaSenha = function (application, req, res) {
    var validacao = null;
    var fs = require('fs');
    var pem = require('pem');
    pem.config({
        pathOpenSSL: 'C:\\OpenSSL-Win64\\bin\\openssl.exe'
    });
    var pfx = fs.readFileSync(req.query.path_certificado);
    pem.readPkcs12(req.query.path_certificado, { p12Password: req.query.senha }, function (err, cert) {
        if (err) {
            validacao = 'erro';
        } else {
            validacao = 'sucesso';
        }
        res.send(validacao);
        return validacao;
    })

}