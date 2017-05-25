import { Router } from 'express'
import * as controller from '../controller/Screen'
const router = new Router()

router.route('/').get(controller.send)

export default router
