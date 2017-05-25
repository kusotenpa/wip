import { EventEmitter } from 'events'
import osc from 'node-osc'

const IP = '127.0.0.1'
const PORT = 9999

class Osc extends EventEmitter {
  constructor() {
    super()
    this.server = new osc.Server(PORT, IP)
  }

  getOscServer() {
    return this.server
  }
}

export default new Osc()
