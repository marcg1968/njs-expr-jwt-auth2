// const employeesController = require('../../controllers/employeesController');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middleware/verifyRoles');

import express from 'express'
import {
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
} from '../../controllers/employeesController.js'
import ROLES_LIST from '../../config/roles_list.js'
import verifyRoles from '../../middleware/verifyRoles.js'
// import { handleNewUser } from '../controllers/registerController.js'

// const { dirname: __dirname } = import.meta

const router = express.Router()

router.route('/')
    // .get(employeesController.getAllEmployees)
    // .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    // .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    // .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee)

router.route('/:id')
    .get(getEmployee)

export const employeesRouter = router
