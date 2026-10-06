

import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { promises as fsPromises } from 'fs'

const { dirname: __dirname } = import.meta
const __filename = path.basename(import.meta.filename)

export const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date, 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    /* rotate monthly */
    const [ _file, _ext ] = logName.split('.')
    // const logFilename = `${_file}_${format(new Date, 'yyyyMM')}.${_ext ?? 'log'}`
    const logFilename = `${_file}_${format(new Date, 'MM')}.${_ext ?? 'log'}`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        // await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFilename), logItem)
    } 
    catch (err) {
        console.error(22, err)
    }
}

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`)
    next()
}
