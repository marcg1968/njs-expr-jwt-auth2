

import path from 'path'
import { allowedOrigins } from '../config/allowedOrigins.js'

const { filename, } = import.meta
const __filename = path.basename(filename)

export const credentials = (req, res, next) => {
    // const origin = req.headers.origin
    const {
        origin,
        'auth-app-name': appNameHeader,
    } = req.headers
    // const appNameHeader = req.get('Auth-App-Name')
    console.log(`${__filename}:11`, { appNameHeader })

    if (allowedOrigins.includes(origin)) {
        console.log(9, { origin })
        res.header('Access-Control-Allow-Credentials', true)
    }
    next()
}
