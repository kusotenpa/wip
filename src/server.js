import Server from './server/index'

import screenRouter from './server/routes/screen'
import controllerRouter from './server/routes/controller'
import * as screenController from './server/controller/screen'
import * as controllerController from './server/controller/controller'

const prepare = server => {
  server.addController('/', screenRouter)
  server.addController('/controller', controllerRouter)

  server.addOscHandler('/tidal', screenController.handleOsc)

  server.addSocketHandler(screenController.handleSocket)
  server.addSocketHandler(controllerController.handleSocket)

  return server.getIoServer()
}

const server = new Server()
prepare(server).listen(process.env.PORT || 3000, err => {
  if (err) {
    console.err(err)
  } else {
    console.info('listen:')
  }
})
