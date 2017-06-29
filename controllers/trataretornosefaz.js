module.exports.trataRetornoSefaz = function (retornoSefaz, req, res, app, parseString, arrayResult, callback) {

    var zlib = require('zlib');
    var gzip = zlib.createGzip();
    var x = 0;
    var i = 0;
    var doczip = null;
    const co = require('co');
    var bufferArray = new Array();
    var stringArray = new Array();

    var async = require('async');

    try {
        doczip = retornoSefaz["soap:Envelope"]["soap:Body"][0]["nfeDistDFeInteresseResponse"][0]["nfeDistDFeInteresseResult"][0]["retDistDFeInt"][0]["loteDistDFeInt"][0]["docZip"];
    } catch (err) {

        try{
            res.json(retornoSefaz["soap:Envelope"]["soap:Body"][0]["nfeDistDFeInteresseResponse"][0]["nfeDistDFeInteresseResult"][0]["retDistDFeInt"][0]['xMotivo']);
        }catch (err){
            res.json({msg: 'Erro desconhecido'});
        }
        
        return;
    }
    async.eachSeries(doczip, function (prime, callback1) {

        var newXml = doczip[x]["_"];
        var xmlResult = null;
        var jsonResult = null;
        var buffer = Buffer.from(newXml, 'base64');

        bufferArray.push(buffer);
        x++;
        callback1();
    }, function (err) {
        if (err) { throw err; }
        doParse();
    });


    function doParse() {
        var async2 = require('async');
        async2.eachSeries(bufferArray, function (prime, callback2) {

            zlib.unzip(prime, (err, prime) => {
                if (!err) {
                    //console.log(prime.toString());
                    stringArray.push(prime.toString());
                    callback2();
                } else {
                    console.log('erro');
                }
            });

        }, function (err) {
            getResultado();
        });
    }


    function getResultado() {
        var x = 0;
        var async3 = require('async');
        async3.eachSeries(stringArray, function (prime, callback3) {

            parseString(prime, function (err, result4) {
                try {
                    //console.log(stringArray[x]);
                    result4['resNFe'].nsu = doczip[x]['$']['NSU'];
                    var xml64 = new Buffer(stringArray[x]).toString('base64');
                    result4['resNFe'].xml = xml64;
                    x++;
                    arrayResult.push(result4);
                    callback3();
                } catch (err) {
                    x++;
                    callback3();
                }

            });

        }, function (err) {
            callback();
        });
    }
}