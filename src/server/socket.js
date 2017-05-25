import http from 'http'
import { EventEmitter } from 'events'
import socketIo from 'socket.io'

export default class Socket extends EventEmitter {
  constructor(app) {
    super()

    const server = this.server = http.createServer(app)
    const io = this.io = socketIo(server)

    io.set('transports', [ 'websocket' ])
  }

  getIoServer() {
    return this.server
  }
}
