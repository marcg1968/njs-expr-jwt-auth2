import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
// import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'
import cors from 'cors'
// import { headers } from './headers.js'
import { authRouter } from './routes/auth.js'
import { connectDB } from './config/db.js'
import { profileRouter } from './routes/profile.js'

const {
    PORT = 6294,
    STAGE = 'development',
} = process.env

let corsOptions = {}

const main = async () => {
    const app = express()

    app.use(cors(corsOptions))

    // app.use(cookieParser())

    /* needed to access POST params in JSON content */
    app.use(express.json())

    // // app.use('/static', express.static('public'))
    // app.use('/static', static)

    // app.use('/', router)

    app.use('/api/auth', authRouter)
    app.use('/api/profile', profileRouter)
    // app.use(headers)

    await connectDB()

    app.listen(PORT, () => console.log(`Express.JS server is active on http://localhost:${PORT}`))
}

main().catch(err => console.log(err))
