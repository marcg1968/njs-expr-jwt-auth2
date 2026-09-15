

import express from 'express'
import path from 'path'
import {
    handleResetOTP,
    setNewPw,
} from '../controllers/resetPwController.js'

// const { dirname: __dirname } = import.meta

const router = express.Router()

// router.post('/otp/:jwt', handleResetOTP)
router.post('/otp', handleResetOTP)
router.get('/otp', handleResetOTP)
router.post('/new', setNewPw)
router.get('/new', setNewPw)

export const resetPasswdRouter = router
