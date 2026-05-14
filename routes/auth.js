

import express from 'express'
import { handleLogin } from '../controllers/authController.js'

const router = express.Router()

router.post('/', handleLogin, (req, res) => {
    // console.log(9, Object.keys(res))
    return res
})

export const authRouter = router
