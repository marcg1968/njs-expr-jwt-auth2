

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../model/User.js'
// import { RefreshToken } from '../models/refreshToken.js'


// const handleLogin = async (req, res) => {
export const handleLogin = async (req, res, next) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' })

    // const foundUser = await User.findOne({ username: user }).exec()
    const foundUser = await User.findOne({ email: user }).exec()
    if (!foundUser) return res.sendStatus(401); //Unauthorized

    console.log(13, foundUser)

    /* evaluate password  */
    const match = await bcrypt.compare(pwd, foundUser.password)
    console.log(17, match)
    if (match) {
        // const roles = Object.values(foundUser.roles).filter(Boolean)

        /* create JWTs */
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    // "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            // { expiresIn: '10s' }
            { expiresIn: '90s' }
        )
        const refreshToken = jwt.sign(
            // { "username": foundUser.username },
            { "username": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        /* TODO: use separate collection for refresh tokens */
        /* Saving refreshToken with current user */
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(42, result)
        // console.log(roles)

        console.log(45, { refreshToken, accessToken })

        /* Creates Secure Cookie with refresh token */
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })

        /* Send authorization roles and access token to user */
        // res.json({ roles, accessToken })
        res.json({ accessToken })

    } 
    else {
        res.sendStatus(401)
    }

    console.log(61, `*** MARKER ***`)
    next()
}

// module.exports = { handleLogin }
