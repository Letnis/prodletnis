module.exports.trataRetornoSefaz = function (retornoSefaz, req, res, app, parseString, arrayResult, callback) {

    var zlib = require('zlib');
    var gzip = zlib.createGzip();
    var x = 0;
    var i = 0;
    var doczip = retornoSefaz["soap:Envelope"]["soap:Body"][0]["nfeDistDFeInteresseResponse"][0]["nfeDistDFeInteresseResult"][0]["retDistDFeInt"][0]["loteDistDFeInt"][0]["docZip"];
    const co = require('co');
    var bufferArray = new Array();
    var stringArray = new Array();


    function* execFor() {

        doczip.forEach(function (value, x) {
            var newXml = doczip[x]["_"];
            var xmlResult = null;
            var jsonResult = null;
            var buffer = Buffer.from(newXml, 'base64');

            convXml(buffer, xmlResult);



            i++; //variavel apenas para testes

        });

    };


    function convXml(buffer, xmlResult) {
        zlib.unzip(buffer, (err, buffer) => {
            if (!err) {
                xmlResult = buffer.toString();

                parseString(xmlResult, function (err, result2) {
                    arrayResult.push(result2);
                });

            } else {
                // handle error
                console.log('erro');
            }
        });
    }

    var async = require('async');

    async.eachSeries(doczip, function (prime, callback1) {
        console.log(prime);
        var newXml = doczip[x]["_"];
        var xmlResult = null;
        var jsonResult = null;
        var buffer = Buffer.from(newXml, 'base64');

        bufferArray.push(buffer);
        x++;
        //convXml(buffer, xmlResult);
        callback1();
    }, function (err) {
        if (err) { throw err; }
        console.log('Well done :-)!');
        console.log('buffer array');
        console.log(bufferArray);
        doParse();
    });


    function doParse() {
        console.log('doing parse');
        var async2 = require('async');
        async2.eachSeries(bufferArray, function (prime, callback2) {
            //do something
            console.log('entrou parse');

            zlib.unzip(prime, (err, prime) => {
                if (!err) {
                    stringArray.push(prime.toString());
                    callback2();
                } else {
                    // handle error
                    console.log('erro');
                }
            });

           // console.log(stringArray);

            

        }, function (err) {
            //do something

            console.log('Well done 2 :-)!');
            console.log('imprimindo array 2');
            console.log(stringArray);
            getResultado();            

        });
    }


    function getResultado() {

        console.log('doing GETrESULTADO');
        var async3 = require('async');
        async3.eachSeries(stringArray, function (prime, callback3) {
            //do something
            console.log('entrou get resultado');
            
            parseString(prime, function (err, result4) {
                arrayResult.push(result4);
                callback3();
            });
                    
        }, function (err) {
            //do something

            console.log('Well done 3 :-)!');
            console.log('imprimindo array 3');
            console.log(arrayResult);
            callback();

        });


    }


    //execFor();


    //callback();

    //setTimeout(callback, 100);

}