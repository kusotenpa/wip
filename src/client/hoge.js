import { render } from 'preact'
import route from '../universal/routes'

const app = document.getElementById('app')
const router = route()
render(router, app, app.firstElementChild)
