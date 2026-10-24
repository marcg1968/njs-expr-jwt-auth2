

import express from 'express'
import {
    handleInvalidCredentials,
    // handleLogin,
    handleLogin2,
} from '../controllers/authController.js'

const router = express.Router()

// router.post('/', handleLogin, (req, res) => {
//     console.log(9, Object.keys(res))
//     return res
// })
router.post(
    '/',
    handleLogin2,
    handleInvalidCredentials,
)

export const authRouter = router
