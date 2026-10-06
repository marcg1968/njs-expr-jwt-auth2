// turnstileController

import axios from 'axios'

export const verifyTurnstile = async (req, res) => {
    const { token } = req.body

    console.log(6, { turnstileToken: token })

    // ensure the token exists
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required.' })
    }

    const payload = {
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        // remoteip: req.ip // Optional: User's IP address
    }
    console.log(20, {payload})

    try {
        // validate token with Cloudflare's endpoint
        const response = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            payload,
        )

        const outcome = response.data
        // console.log(30, {outcome})
        console.log(31, outcome['error-codes'])

        // handle the verification result
        if (outcome.success) {
            return res.json({ success: true, message: 'Turnstile verification passed!' })
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Turnstile verification failed.',
                errors: outcome['error-codes'] // Array of error codes from Cloudflare
            })
        }
    }
    catch (err) {
        console.error('Turnstile verification error:', err)
        return res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}
