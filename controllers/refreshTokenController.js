import express from 'express'
import path from 'path'
// import { fileURLToPath } from 'url'
import util from 'node:util'
import jwt from 'jsonwebtoken'
import { User } from '../model/User.js'
import { findUserWithGroupsForApp } from './usersController.js'

// const __filename = path.basename(fileURLToPath(import.meta.url))
const __filename = path.basename(import.meta.filename)
const __dirname = import.meta.dirname

export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    console.log(6, cookies)
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    const { app_name_header } = res.locals

    /* TODO: parse refreshToken to extract email value */
    let email
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(23, {err, decoded})
            // if (err || foundUser.email !== decoded.username) return res.sendStatus(403)
            ;({ username: email } = decoded)
        }
    )
    // console.log(`${__filename}:27`, `foundUser:`, util.inspect(foundUser, { showHidden: false, depth: null, colors: true }))

    // const foundUser = await User.findOne({ refreshToken }).exec()
    const foundUser = await findUserWithGroupsForApp({ email, app_name_header })
    console.log(`${__filename}:31`, `foundUser:`, util.inspect(foundUser, { showHidden: false, depth: null, colors: true }))

    if (!foundUser) return res.sendStatus(403) // forbidden

    const groups = (foundUser?.groups || []).map(({ _id, shortname, descrip }) => ({ _id, shortname, descrip }))
    console.log(`${__filename}:22`, `groups:`, util.inspect(groups, { showHidden: false, depth: null, colors: true }))

    const accessToken = jwt.sign(
        {
            'UserInfo': {
                username: email,
                email: foundUser.email,
                fname: foundUser.fname,
                sname: foundUser.sname,
                groups,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '90s' }
    )
    // // res.json({ roles, accessToken })
    // res.json({ accessToken })
    res.json({ accessToken, groups })
    
    // /* evaluate jwt */
    // jwt.verify(
    //     refreshToken,
    //     process.env.REFRESH_TOKEN_SECRET,
    //     (err, decoded) => {
    //         console.log(20, {err, decoded})
    //         // if (err || foundUser.username !== decoded.username) return res.sendStatus(403)
    //         if (err || foundUser.email !== decoded.username) return res.sendStatus(403)
    //         // const roles = Object.values(foundUser.roles)
    //         const accessToken = jwt.sign(
    //             {
    //                 "UserInfo": {
    //                     "username": decoded.username,
    //                     // "roles": roles,
    //                     groups,
    //                 }
    //             },
    //             process.env.ACCESS_TOKEN_SECRET,
    //             { expiresIn: '90s' }
    //         )
    //         // // res.json({ roles, accessToken })
    //         // res.json({ accessToken })
    //         res.json({ accessToken, groups })
    //     }
    // )
    
}
