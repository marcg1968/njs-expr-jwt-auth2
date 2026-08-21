

import { allowedOrigins } from './allowedOrigins.js'

export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } 
        else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

const corsOptionsDelegate = async (req, callback) => {
    let corsOptions
    const origin = req.header('Origin')

    try {
        const allowed = await isOriginAllowed(origin)
        if (allowed) {
            // Origin is in the database; allow it
            corsOptions = { origin: true }
        } 
        else {
            // Origin not found; disable CORS for this request
            corsOptions = { origin: false }
        }
    }
    catch (err) {
        callback(new Error('Internal Server Error during CORS check'))
        return
    }
    callback(null, corsOptions);
}

// // Apply dynamic CORS to all routes
// app.use(cors(corsOptionsDelegate));