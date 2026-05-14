

import express from 'express'
import ROLES_LIST from '../../config/roles_list.js'
import verifyRoles from '../../middleware/verifyRoles.js'
import {
    deleteUser,
    getAllUsers,
    getUser,
} from '../../controllers/usersController.js'

const router = express.Router()

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteUser)

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), getUser)

export const usersRouter = router
