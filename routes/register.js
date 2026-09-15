

import express from 'express'
import path from 'path'
import {
    handleNewUser,
    createGroup,
} from '../controllers/registerController.js'

// const { dirname: __dirname } = import.meta

const router = express.Router()

router.post('/', handleNewUser)

router.post('/create_group', createGroup)

export const registerRouter = router
