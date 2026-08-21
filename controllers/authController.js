

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import { User } from '../model/User.js'
import { Group } from '../model/Group.js'
import { App } from '../model/App.js'
// import { RefreshToken } from '../models/refreshToken.js'

// const {
//     dirname: __dirname,
//     filename: __filename,
// } = import.meta
const { filename, } = import.meta
const __filename = path.basename(filename)

export const handleLogin = async (req, res, next) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' })

    // const foundUser = await User.findOne({ username: user }).exec()
    const foundUser = await User.findOne({ email: user }).exec()
    console.log(`${__filename}:20`, foundUser)
    
    if (!foundUser) return res.sendStatus(401) /* unauthorized */

    /* evaluate password  */
    const match = await bcrypt.compare(pwd, foundUser.password)
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
        console.log(`${__filename}:53`, result)
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

    /* temp hack to create app & group */
    /*  */
    try {        
        const newApp = await App.create({
            shortname: 'react-jwt-test2',
            description: 'React/Vite Auth App',
            urlOrigins: [ 'localhost:5173' ]
        })
        console.log(`${__filename}:78`, newApp)
        console.log(`${__filename}:79`, newApp._id.toString())
        // const newGroup = await Group.create({ name: 'Alice' })
        const newGroup = await Group.create({
            shortname: 'react-jwt-test2_admin',
            description: ``,
            apps: [
                newApp._id
            ]
        })    
        // await newGroup.populate('apps')
        console.log(`${__filename}:88`, newGroup)
        /* add user to group */
        // newGroup.
        foundUser.groups.push(newGroup._id)
        await foundUser.save()

        // doc.myArray.push(newItem);
        // await doc.save();
        // await doc.populate('myArray'); // In newer Mongoose versions, this updates 'doc' in place

    }
    catch (err) {
        console.error(`${__filename}:97`, err)
    }

    /* check if user in group allowed to access the app */
    const {
        origin,
        'auth-app-name': appNameHeader,
    } = req.headers
    if (appNameHeader) {
        
}
    else {
        res
            .json({ err: `app name custom header missing` })
            .status(401)
    }


    console.log(`${__filename}:70`, `*** MARKER ***`)
    next()
}
