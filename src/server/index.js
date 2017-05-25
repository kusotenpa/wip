import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'

import Socket from './socket'
import osc from './osc'
import { STAT_DIR } from './config/paths'

export default class Server {

  constructor() {
    const app = this.app = express()
    const socket = this.socket = new Socket(app)
    this.ioServer = socket.getIoServer()
    this.oscServer = osc.getOscServer()

    app.disable('x-powered-by')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(compression())
    app.use('/stat', express.static(STAT_DIR))
    app.use(express.static('public'))
  }

  addHandler(handler) {
    handler.apply(this.getExpressApp())
  }

  addController(endpoint, controller) {
    const app = this.getExpressApp()
    app.use(endpoint, controller)
  }

  addOscHandler(msg, cb) {
    const oscServer = this.getOscServer()
    oscServer.on(msg, cb)
  }

  addSocketHandler(handler) {
    handler.apply(this.socket)
  }

  getExpressApp() {
    return this.app
  }

  getIoServer() {
    return this.ioServer
  }

  getOscServer() {
    return this.oscServer
  }
}
