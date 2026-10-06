

import { rateLimit } from 'express-rate-limit'
import { setTimeout } from 'timers/promises'

const config = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    // windowMs: 3 * 60 * 1000, // 3 minutes
    // limit: 10, // limit each IP to 10 requests per windowMs
}

/* define rate limiter middleware */
export const limiter = rateLimit({
    ...config,
    standardHeaders: 'draft-7', // return standard rate limit info headers
    legacyHeaders: false, // disable the deprecated X-RateLimit-* headers
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again later.'
    },
    // handler: (req, res, next, options) =>
	// 	res.status(options.statusCode).send(options.message),
    handler: async (req, res, next, options) => {
        console.log(24, `[${(new Date).toISOString()}] rate limit exceeded from ip ${req.ip}`)
        console.log(25, `-- rateLimit = ${JSON.stringify(req.rateLimit)}`)
        
        await setTimeout(15 * 1000) // sleep for 15000 milliseconds (15 seconds)
        
		return res.status(options.statusCode).send(options.message)
    },
})
