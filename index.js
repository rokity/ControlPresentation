const http = require('http');
const fs = require('fs');
const robot = require("robotjs");
const qrcode = require('qrcode-terminal');
const network = require('network');
const pino = require('pino');
const WebSocketServer = require('websocket').server;
// Get the source of Control Page
const html = fs.readFileSync('index.html', 'utf8');
//Initiate the PinoJS logger library,adding prettify
const logger = pino({ prettyPrint: { colorize: true } });
/** 
 * Create a HTTP server object
 * It's the response to every HTTP Request 
 * of this server.
*/
let server = http.createServer((req,res) => {
    //Set HTTP Status Code
    res.writeHead(200, { 'Content-Type': 'text/html' });
    //write the html response
    res.write(html);
    //close the HTTP Connection
    res.end();
})
/**
 * Catch the case if the server is already in use or started.
 */
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        logger.fatal(`
      ERROR: Address in use
      Maybe there are some service 
      that actually working in the same port.
      Check it and re-launch the app.  `);
    }
    process.exit(0);
});
/**
 * Launch the HTTP Server .
 * Get the private IP of the host.
 * Generate the QR Code from the url of the http-server and show it.
 */
server.listen(8080, function () {
    logger.info(' Server is listening on port 8080 ');
    network.get_private_ip(function (err, ip) {
        const private_address = `http://${ip}:8080`;
        qrcode.generate(private_address);
    })
});
/**
 * Create the WebSocket Server from HTTP Server.
 * The autoaccept property is disabled because 
 * it's more secure for production enivronment.
 */
let wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
/**
 * Event for managing the WebSocket Request.
 * Accept the request and on a new message 
 * write on the console the message.
 * Call RobotJS library which trigger 
 * the left/right/up/down button event.
 * The message could be 'left'|'right'|'up'|'down'.
 */
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        logger.info(message);
        robot.keyTap(message.utf8Data);
    });
});
