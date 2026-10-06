

import path from 'path'
import { allowedOrigins } from '../config/allowedOrigins.js'

const __filename = path.basename(import.meta.filename)

export const credentials = (req, res, next) => {
    const {
        origin,
        'auth-app-name': appNameHeader,
    } = req.headers
    // console.log(15, `[${__filename}]`, { appNameHeader })
    res.locals.app_name_header = appNameHeader

    if (!allowedOrigins.includes(origin)) {
        console.warn(17, `[${__filename}]`, `origin ${origin} missing from allowedOrigins`)
    }
    
    if (allowedOrigins.includes(origin)) {
        // console.log(20, `[${__filename}]`, { origin })
        res.header('Access-Control-Allow-Credentials', true)
    }

    next()
}
