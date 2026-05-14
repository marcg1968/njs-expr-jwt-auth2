// const { logEvents } = require('./logEvents')

import { logEvents } from './logEvents.js'

export const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    console.error(5, err.stack)
    res.status(500).send(err.message)
}
