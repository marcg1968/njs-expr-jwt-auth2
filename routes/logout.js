

import express from 'express'
import { handleLogout } from '../controllers/logoutController.js'

const router = express.Router()

router.post('/', handleLogout)
router.get('/', handleLogout)

export const logoutRouter = router