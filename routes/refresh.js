
// router.get('/', refreshTokenController.handleRefreshToken)

import express from 'express'
import path from 'path'
import { handleRefreshToken } from '../controllers/refreshTokenController.js'

// const { dirname: __dirname } = import.meta

const router = express.Router()

router.get('/', handleRefreshToken)
router.post('/', handleRefreshToken)

export const refreshRouter = router
