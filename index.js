const pino = require('pino')
const readline = require('readline')
// Initiate the PinoJS logger library,adding prettify
global.logger = pino({ prettyPrint: { colorize: true } })
// Http-Server module /lib/http-server.js
let httpServer = require(`./lib/http-server.js`)
// WebSocket-Server module /lib/websocket-server.js
let websocketServer = require(`./lib/websocket-server.js`)
// GUI for select the network interface
const selectorNetwork = require('./lib/choose-network-interface.js')
// Init readline interface for prompt question and get input data
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
// Ask question about port of the server,
// http and websocket server are using the same port

rl.question('Which port do you want to use for the server ? (8080) :', (port) => {
  port = port.length > 0 ? port : 8080
  selectorNetwork(rl, (networkSelected) => {
    // Start HTTP-Server and WebSocket-Server
    httpServer.start(port, networkSelected['ip_address'])
    websocketServer.start(httpServer.server)
  })
})
