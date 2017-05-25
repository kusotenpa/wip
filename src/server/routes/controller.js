import { Router } from 'express'
import * as controller from '../controller/Controller'
const router = new Router()

router.route('/').get(controller.send)

export default router
