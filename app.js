var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    qs = require('querystring');

var AUTO_URL = 'https://creator.zoho.com/api/xml/app/view/ExportAuto?authtoken=48c1c4922e5a47c65e093cd90614dc86',
    DROM_REF_URL = 'http://www.drom.ru/cached_files/autoload/files/ref.xml';

function getXML(url, callback){
    var req = (url.indexOf('https') !== -1 ? https : http).get(url, function(res) {

        var xml = '';
        res.on('data', function(chunk) {
            xml += chunk;
        });

        res.on('end', function() {
            callback(xml);
        });

    });

    req.on('error', function(err) {
        callback(err);
    });
}

function getAndSaveXML(url, filename, callback){
    getXML(url, function(xml){
        saveXML(xml, filename);
        callback();
    })
}

function saveXML(xml, filename){
    fs.writeFileSync('www/' + filename, xml);
}

var contentTypesByExtension = {
    '.xml': "text/xml",
    '.html': "text/html",
    '.css': "text/css",
    '.js': "text/javascript"
};

exports.handler = function (request, response) {

    function requestHandler(){
        var uri = url.parse(request.url).pathname,
            filename = path.join(__dirname, 'www', uri);

        fs.exists(filename, function (exists) {
            console.log(request.url);

            if (!exists) {
                filename = path.join(__dirname, 'www', '/index.html');
            }
            else if (fs.statSync(filename).isDirectory()) {
                if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            }

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                var headers = {};
                var contentType = contentTypesByExtension[path.extname(filename)];
                if (contentType) headers["Content-Type"] = contentType;
                response.writeHead(200, headers);
                response.write(file, "binary");
                response.end();
            });
        });
    }

    if(request.url === '/cars'){
        getAndSaveXML(AUTO_URL, 'cars.xml', function(){
            var headers = {};
            var contentType = contentTypesByExtension['.html'];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write('success');
            response.end();
        });
    }
    else if (request.url === '/dromref'){
        getXML(DROM_REF_URL, function(xml){
            var headers = {};
            var contentType = contentTypesByExtension[path.extname('ref.xml')];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(xml, "binary");
            response.end();
        });
    }
    else if (request.url === '/dromsave'){
        if (request.method == 'POST') {
            var body = '';
            request.on('data', function (data) {
                body += data;

                if (body.length > 1e6)
                    request.connection.destroy();
            });
            request.on('end', function () {
                var content = '<?xml version="1.0" encoding="UTF-8" ?>' + body;
                saveXML(content, 'conversion/drom/bulls.xml');
                var headers = {};
                var contentType = contentTypesByExtension[path.extname('res.html')];
                if (contentType) headers["Content-Type"] = contentType;
                response.writeHead(200, headers);
                response.write('success', "binary");
                response.end();
            });
        }
    }
    else{
        requestHandler();
    }
};

