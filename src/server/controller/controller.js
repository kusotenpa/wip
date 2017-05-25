import { h } from 'preact'
import render from 'preact-render-to-string'
import { StyleSheetServer } from 'aphrodite'

import Html from '../../universal/components/Html'
import Controller from '../../universal/components/Controller'

export function send(req, res, next) {
  const {
    html: markup,
  } = StyleSheetServer.renderStatic(() => render(<Controller />))

  res.send(`
    <!doctype html>
    ${render(<Html markup={markup} />)}
  `)
  next()
}

export function handleSocket() {
  this.io.of('/controller').on('connection', socket => {
    console.log('connect socket: controller')

    socket.on('midi', data => {
      this.io.emit('midi', data)
    })
  })
}
