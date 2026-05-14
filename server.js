

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

    /* routes */
    app.use('/', rootRouter)
    app.use('/register', registerRouter)
    app.use('/auth', authRouter)
    app.use('/refresh', refreshRouter)
    app.use('/logout', logoutRouter)
    app.use(verifyJWT)
    app.use('/employees', employeesRouter)
    app.use('/users', usersRouter)

    // app.all('*', (req, res) => {
    //     res.status(404)
    //     if (req.accepts('html')) {
    //         res.sendFile(path.join(__dirname, 'views', '404.html'))
    //     } else if (req.accepts('json')) {
    //         res.json({ "error": "404 Not Found" })
    //     } else {
    //         res.type('txt').send("404 Not Found")
    //     }
    // })

    app.all('*', catchall)

    app.use(errorHandler)

    app.listen(PORT, () => console.log(`Express.JS server is active on http://localhost:${PORT}`))
}

main().catch(err => console.log(err))
