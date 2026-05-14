// const express = require('express');
// const router = express.Router();
// const path = require('path');

// router.get('^/$|/index(.html)?', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
// });

// module.exports = router;

import express from 'express'
import path from 'path'

const { dirname: __dirname } = import.meta

const router = express.Router()

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

export const rootRouter = router
