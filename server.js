const http = require('http')
const debug = require('debug')('node-angular')
const app = require('./backend/app')

const normalizePort = val => {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}
const onError = err => {
  if (err.syscall !== "listen") {
    throw err
  }
  const bind = typeof addr === "string" ? "pipe" + addr : "port" + port
  switch (err.code) {
    case "EACCESS":
      console.log(bind + " requires elevated privilege");
      process.exit(1)
      break
    case "EADDRINUSE":
      console.log(bind + "is already in use");
      process.exit(1)
      break
    default:
      throw err
  }
};

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === "string" ? "pipe" + addr : "port" + port
  debug("Listening on " + bind)
};
const port = normalizePort(process.env.PORT || "3000")
app.set("port", port)
const server = http.createServer(app)
server.on("error", onError)
server.on("listening", onListening)
server.listen(port)
