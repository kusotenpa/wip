import { h } from 'preact'
import Router from 'preact-router'

import Screen from './components/Screen'
import Controller from './components/Controller'

const route = () => {
  return (
    <Router>
      <Screen path='/' />
      <Controller path='/controller' />
    </Router>
  )
}

export default route
