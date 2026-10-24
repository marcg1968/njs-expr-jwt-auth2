

import express from 'express'
import path from 'path'
import {
    handleResetOTP,
    setNewPw,
    startPwReset,
} from '../controllers/resetPwController.js'
import { handleInvalidCredentials } from '../controllers/authController.js'

// const { dirname: __dirname } = import.meta

const router = express.Router()

// router.post('/otp/:jwt', handleResetOTP)
router.post('/step1', startPwReset, handleInvalidCredentials) /* step 1: trigger email containing special link to (re)set pw */
router.post('/otp', handleResetOTP)
router.get('/otp', handleResetOTP)
router.post('/new', setNewPw)
router.get('/new', setNewPw)

export const resetPasswdRouter = router
