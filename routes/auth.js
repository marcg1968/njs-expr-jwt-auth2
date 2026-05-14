

import express from 'express'
import { handleLogin } from '../controllers/authController.js'

const router = express.Router()

// // router.post('/', authController.handleLogin)
// router.post('/', authController.handleLogin, (req, res) => {
router.post('/', handleLogin, (req, res) => {
    console.log(9, Object.keys(res))
    return res
})

// module.exports = router
export const authRouter = router
