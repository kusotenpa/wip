import { EventEmitter } from 'events'
import { h } from 'preact'
import render from 'preact-render-to-string'
import { StyleSheetServer } from 'aphrodite'

import Html from '../../universal/components/Html'
import Screen from '../../universal/components/Screen'

const emitter = new EventEmitter()

export function send(req, res, next) {
  const {
    html: markup,
  } = StyleSheetServer.renderStatic(() => render(<Screen />))
  
  res.send(`
    <!doctype html>
    ${render(<Html markup={markup} />)}
  `)
  next()
}

export function handleOsc(msg) {
  const data = msg[ 1 ]
  const name = data.match(/'s',\s'(\w+)'/)[ 1 ]
  emitter.emit('tidal', name)
}

export function handleSocket() {
  this.io.of('/').on('connection', socket => {
    console.log('connect socket: screen')

    emitter.on('tidal', name => {
      socket.emit('tidal', { message: name })
    })
  })
}
