

import express from 'express'
import path from 'path'
import { handleNewUser } from '../controllers/registerController.js'

// const { dirname: __dirname } = import.meta

const router = express.Router()

router.post('/', handleNewUser)

export const registerRouter = router
