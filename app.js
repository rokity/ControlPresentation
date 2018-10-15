var http = require('http');
var fs = require('fs');
var robot = require("robotjs");
var QRCode = require('qrcode');
var qrcode = require('qrcode-terminal');

var html = fs.readFileSync('index.html', 'utf8');

var WebSocketServer = require('websocket').server;


console.log('after calling readFile');
//create a server object:
var server = http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(html); //write a response to the client
    res.end(); //end the response
})

server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        add = 'http://' + add + ':8080';
        qrcode.generate(add);
        // QRCode.toDataURL(add, function (err, url) {
        //     console.log(url)
        //   })
    })
});
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        console.log(message)
        robot.keyTap(message.utf8Data)
    });
});