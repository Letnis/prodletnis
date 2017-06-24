module.exports.trataRetornoSefaz = function (retornoSefaz, req, res, app, parseString, arrayResult, callback) {

    var zlib = require('zlib');
    var gzip = zlib.createGzip();
    var x = 0;
    var i = 0;
    var doczip = retornoSefaz["soap:Envelope"]["soap:Body"][0]["nfeDistDFeInteresseResponse"][0]["nfeDistDFeInteresseResult"][0]["retDistDFeInt"][0]["loteDistDFeInt"][0]["docZip"];
    const co = require('co');
    var bufferArray = new Array();
    var stringArray = new Array();

    var async = require('async');

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
        var async3 = require('async');
        async3.eachSeries(stringArray, function (prime, callback3) {

            parseString(prime, function (err, result4) {
                arrayResult.push(result4);
                callback3();
            });

        }, function (err) {
            callback();
        });
    }
}