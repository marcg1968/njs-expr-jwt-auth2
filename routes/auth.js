

const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// router.post('/', authController.handleLogin)
router.post('/', authController.handleLogin, (req, res) => {
    console.log(9, Object.keys(res))
    return res
})

module.exports = router
