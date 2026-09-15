

import path from 'path'
import { allowedOrigins } from '../config/allowedOrigins.js'
import { fileURLToPath } from 'url'

// const { filename, } = import.meta
// const __filename = path.basename(filename)
const __filename = path.basename(fileURLToPath(import.meta.url))

export const credentials = (req, res, next) => {
    // const origin = req.headers.origin
    const {
        origin,
        'auth-app-name': appNameHeader,
    } = req.headers
    // const appNameHeader = req.get('Auth-App-Name')
    console.log(`${__filename}:16`, { appNameHeader })
    res.locals.app_name_header = appNameHeader

    if (allowedOrigins.includes(origin)) {
        console.log(9, { origin })
        res.header('Access-Control-Allow-Credentials', true)
    }
    next()
}
