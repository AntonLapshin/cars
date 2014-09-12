var http = require('http'),
    app = require('./app'),
    port = Number(process.env.PORT || 8081);

http.createServer(app.handler).listen(port);

console.log('Penalty http: ' + port);

