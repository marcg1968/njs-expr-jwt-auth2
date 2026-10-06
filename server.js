

import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { connectDB }  from './config/dbConn.js'
import { logger } from './middleware/logEvents.js'
import { corsOptions } from './config/corsOptions.js'
import { authRouter } from './routes/auth.js'
import { rootRouter } from './routes/root.js'
import { credentials } from './middleware/credentials.js'
import { verifyJWT } from './middleware/verifyJWT.js'
import { registerRouter } from './routes/register.js'
import { refreshRouter } from './routes/refresh.js'
import { logoutRouter } from './routes/logout.js'
import { employeesRouter } from './routes/api/employees.js'
import { usersRouter } from './routes/api/users.js'
import { errorHandler } from './middleware/errorHandler.js'
import { catchall } from './middleware/catchall.js'
import { resetPasswdRouter } from './routes/reset.js'
import { turnstileRouter } from './routes/turnstile.js'
import { limiter } from './middleware/rateLimit.js'

const { dirname: __dirname } = import.meta

const PORT = process.env.PORT || 3500

const main = async () => {

    await connectDB()

    const app = express()

    /* custom middleware logger */
    app.use(logger)

    /* handle options credentials check - before CORS! */
    /* and fetch cookies credentials requirement */
    app.use(credentials)

    app.use(cors(corsOptions))

    /* built-in middleware to handle urlencoded form data */
    app.use(express.urlencoded({ extended: false }))

    /* built-in middleware for JSON */
    /* needed to access POST params in JSON content */
    app.use(express.json())

    /* middleware for cookies */
    app.use(cookieParser())

    app.use(limiter)

    /* routes */
    app.use('/', rootRouter)
    app.use('/register', registerRouter)
    app.use('/reset_pw', resetPasswdRouter)
    app.use('/auth', authRouter)
    app.use('/refresh', refreshRouter)
    app.use('/logout', logoutRouter)
    // app.use(verifyJWT) /* ??? necessary ??? */
    app.use('/employees', employeesRouter)
    app.use('/users', usersRouter)
    app.use('/turnstile', turnstileRouter) /* cloudflare */

    /* deliver 404 customised */
    app.all('*', catchall)

    app.use(errorHandler)

    app.listen(PORT, () => console.log(`Express.JS server is active on http://localhost:${PORT}`))
}

main().catch(err => console.log(err))
