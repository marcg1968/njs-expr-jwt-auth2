// const express = require('express');
// const router = express.Router();
// const usersController = require('../../controllers/usersController');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middleware/verifyRoles');

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
