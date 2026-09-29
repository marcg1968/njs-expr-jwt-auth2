

import express from 'express'
import ROLES_LIST from '../../config/roles_list.js'
import verifyRoles from '../../middleware/verifyRoles.js'
import {
    deleteUser,
    getAllUsers,
    getUser,
    getUserGroups,
    updateUser,
} from '../../controllers/usersController.js'

const router = express.Router()

// console.log(14, ROLES_LIST)

// router.route('/')
//     .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
//     .delete(verifyRoles(ROLES_LIST.Admin), deleteUser)

// router.route('/:id')
//     .get(verifyRoles(ROLES_LIST.Admin), getUser)

// router.post('/', (req, res) => {
//     const cookies = req.cookies
//     console.log(26, cookies)
//     res.json({ foo: 'd' })
// })

router.post('/all', getAllUsers)
router.get('/all', getAllUsers)
router.post('/single', getUser)
router.post('/groups', getUserGroups)
router.put('/update', updateUser)

export const usersRouter = router
