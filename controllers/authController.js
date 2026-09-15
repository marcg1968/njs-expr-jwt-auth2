

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import { randomBytes } from 'node:crypto'
import util from 'node:util'
import { User } from '../model/User.js'
import { Group } from '../model/Group.js'
import { App } from '../model/App.js'
import { sendResetPwLink } from '../services/emailService.js'
import { findUserWithGroupsForApp } from './usersController.js'
import { removeNonceAndGenerateResetOTP } from './resetPwController.js'
// import { RefreshToken } from '../models/refreshToken.js'

// const {
//     dirname: __dirname,
//     filename: __filename,
// } = import.meta
const { filename, } = import.meta
const __filename = path.basename(filename)

export const handleLogin = async (req, res, next) => {
    let foundUser
    // const { user, pwd } = req.body
    const { email, pwd } = req.body
    const { origin, host } = req.headers
    const { protocol } = req
    const port = host.includes(':') ? host.split(':')[1] : null
    const expiresIn = '300s'

    // if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' })
    if (!email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' })

    const { app_name_header } = res.locals

    // // const foundUser = await User.findOne({ username: user }).exec()
    // // const foundUser = await User.findOne({ email: user })
    // //     .populate('groups')
    // //     .exec()
    // // const foundUser = await User.findOne({ email: user })
    // const foundUser = await User.findOne({ email })
    //     .populate({
    //         path: 'groups',
    //         // select: 'shortname description',
    //         model: Group,
    //         populate: {
    //             path: 'apps',
    //             // select: 'shortname urlOrigin',
    //             // select: 'shortname',
    //             match: { shortname: `${app_name_header}` },   // <-- filter here
    //             model: App,
    //         }
    //     })

    foundUser = await findUserWithGroupsForApp({ email, app_name_header })
    // console.log(`${__filename}:27`, foundUser)
    console.log(`${__filename}:55`, util.inspect(foundUser, { showHidden: false, depth: null, colors: true }))

    /* if no password AND no reset_otp, remove any nonce and generate new reset_otp */
    /* UP TO HERE !!!!!!!!!!!!!!!!! */

    foundUser = await removeNonceAndGenerateResetOTP({ email })
    console.log(`${__filename}:64`, util.inspect(foundUser, { showHidden: false, depth: null, colors: true }))

    // const reset_otp = randomBytes(48).toString('hex')
    // console.log(60, `${reset_otp}`)
    // foundUser.reset_otp = reset_otp

    /* if no passwd but there is reset_otp => send reset email link */
    /* if no passwd in DB OR pwd: `NEED_TO_RESET` passed in, but there is reset_otp => send reset email link */
    console.log(71, foundUser?.reset_otp, !foundUser?.passwd)
    // if (foundUser?.reset_otp && !foundUser?.passwd) {
    if (foundUser?.reset_otp && !foundUser?.passwd || pwd === `NEED_TO_RESET`) {

        const token = jwt.sign(
            {
                otp: foundUser.reset_otp,
                email: foundUser.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn }
        )

        // console.log(54, { ...foundUser.toObject() })
        await sendResetPwLink({ ...foundUser.toObject(), token, origin }) // { email, fname, sname, reset_otp, origin, protocol }
        return res.json({
            // msg: `sent email for pw reset`
            status: 'pw_reset',
            action: 'email_sent',
            expiresIn, 
        })
    }
    
    // if (!foundUser) return res.sendStatus(401) /* unauthorized */
    if (!foundUser || !foundUser?.passwd) {
        return res.sendStatus(401) /* unauthorized */
    }

    /* evaluate password  */
    const match = await bcrypt.compare(pwd, foundUser.passwd)
    console.log(`${__filename}:26`, `pw match? ${match}`)
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
        console.log(`${__filename}:105`, util.inspect(result, { showHidden: false, depth: null, colors: true }))
        // console.log(roles)

        /* collect group info */
        // const { groups } = foundUser
        const groups = (foundUser?.groups || []).map(({ _id, shortname, descrip }) => ({ _id, shortname, descrip }))

        console.log(112, { refreshToken, accessToken, groups })

        /* Creates Secure Cookie with refresh token */
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })

        /* Send authorization roles and access token to user */
        // res.json({ roles, accessToken })
        res.json({ accessToken, groups })

    } 
    else {
        res.sendStatus(401)
    }

    /* temp hack to create app & group */
    // try {        
    //     const newApp = await App.create({
    //         shortname: 'react-jwt-test2',
    //         description: 'React/Vite Auth App',
    //         urlOrigins: [ 'localhost:5173' ]
    //     })
    //     console.log(`${__filename}:78`, newApp)
    //     console.log(`${__filename}:79`, newApp._id.toString())
    //     // const newGroup = await Group.create({ name: 'Alice' })
    //     const newGroup = await Group.create({
    //         shortname: 'react-jwt-test2_admin',
    //         description: ``,
    //         apps: [
    //             newApp._id
    //         ]
    //     })    
    //     // await newGroup.populate('apps')
    //     console.log(`${__filename}:88`, newGroup)
    //     /* add user to group */
    //     // newGroup.
    //     foundUser.groups.push(newGroup._id)
    //     await foundUser.save()

    //     // doc.myArray.push(newItem);
    //     // await doc.save();
    //     // await doc.populate('myArray'); // In newer Mongoose versions, this updates 'doc' in place

    // }
    // catch (err) {
    //     console.error(`${__filename}:97`, err)
    // }

    /* check if user in group allowed to access the app */
    const {
        'auth-app-name': appNameHeader,
    } = req.headers
    if (appNameHeader) {
        
    }
    else {
        res
            .json({ err: `app name custom header missing` })
            .status(401)
    }

    console.log(`${__filename}:168`, `*** MARKER ***`)
    next()
}
