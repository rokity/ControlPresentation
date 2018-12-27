const http = require('http')
const fs = require('fs')
const qrcode = require('qrcode-terminal')
const network = require('network')

// Get the source of Control Page
const html = fs.readFileSync('index.html', 'utf8')
/**
 * Create a HTTP server object
 * It's the response to every HTTP Request
 * of this server.
*/
let server = http.createServer((req, res) => {
  // Set HTTP Status Code
  res.writeHead(200, { 'Content-Type': 'text/html' })
  // write the html response
  res.write(html)
  // close the HTTP Connection
  res.end()
})
/**
 * Catch the case if the server is already in use or started.
 */
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    global.logger.fatal(`
      ERROR: Address in use
      Maybe there are some service 
      that actually working in the same port.
      Check it and re-launch the app.  `)
  }
  process.exit(0)
})
/**
 * @param {Number} port-Number
 * Port of the web server.
 * Launch the HTTP Server .
 * Get the private IP of the host.
 * Generate the QR Code from the url of the http-server and show it.
 */
exports.start = (port, hostname) => {
  server.listen(port, hostname, function () {
    global.logger.info(` Server is listening on http://${hostname}:${port} `)
    network.get_private_ip(function (err, ip) {
      if (err) global.logger.error('get_private_ip', err)
      const privateAddress = `http://${ip}:${port}`
      qrcode.generate(privateAddress)
    })
  })
}
/**
 * @property {object} server - it's the http-server object. it's native http object.
 */
exports.server = server
