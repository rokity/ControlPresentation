const WebSocketServer = require('websocket').server
const robot = require('robotjs')
let wsServer
/**
 * @param {object} server - the native http-server object ,that is already created and launched.
 */
exports.start = (server) => {
  /**
     * Create the WebSocket Server from HTTP Server.
     * The autoaccept property is disabled because
     * it's more secure for production enivronment.
     */
  wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  })
  /**
     * Event for managing the WebSocket Request.
     * Accept the request and on a new message
     * write on the console the message.
     * Call RobotJS library which trigger
     * the left/right/up/down button event.
     * The message could be 'left'|'right'|'up'|'down'.
     */
  wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin)
    connection.on('message', function (message) {
      global.logger.info(message)
      robot.keyTap(message.utf8Data)
    })
  })
}
/**
 * @property {object} server - the websocket-server object. it's not native.
 */
exports.server = wsServer
