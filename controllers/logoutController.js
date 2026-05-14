

import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../model/User.js'

export const handleLogout = async (req, res) => {

    /* NB: on client: also delete the accessToken */

    console.log(11, req.cookies)

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) /* no content */
    const refreshToken = cookies.jwt

    /* is refreshToken in db? */
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }

    /* delete refreshToken in db */
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(25, result)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.sendStatus(204)
}
