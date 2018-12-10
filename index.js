var http = require('http');
var fs = require('fs');
var robot = require("robotjs");
var qrcode = require('qrcode-terminal');
var network = require('network');

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

    network.get_private_ip(function (err, ip) {
        add = 'http://' + ip + ':8080';
        qrcode.generate(add);
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


var getLocalIPs = function () {

    var script =
        "ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'"
    exec(script, function (error, stdout, sterr) {
        console.log('stdout: ' + stdout);
    });
};