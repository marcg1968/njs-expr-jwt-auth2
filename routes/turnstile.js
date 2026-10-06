// 

import express from 'express'
import {
    verifyTurnstile,
} from '../controllers/turnstileController.js'

const router = express.Router()

router.post('/verify', verifyTurnstile)

export const turnstileRouter = router
