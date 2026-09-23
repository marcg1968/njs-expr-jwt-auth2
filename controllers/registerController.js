import express from 'express'
import bcrypt from 'bcrypt'
import { randomBytes } from 'node:crypto'

import { User } from '../model/User.js'
import { Group } from '../model/Group.js'
import { App } from '../model/App.js'

/* 
curl -X POST http://localhost:6823/register \
    -H "Content-Type: application/json" \
    -H "Auth-App-Name: react-bubu-tools" \
    -d '{"fname": "marc", "sname": "greyling", "email": "mgreyling@gmail.com"}'
*/
export const handleNewUser = async (req, res) => {
    const { email, fname, sname, mobile } = req.body
    if (!email || !fname || !sname )
        return res.status(400).json({ 'message': 'Username, first name and last name are required.' })

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec()
    if (duplicate) {
        return res.sendStatus(409) // conflict
    }

    console.log(26, `res.locals`, res.locals)
    const { app_name_header } = res.locals

    /* generate a hash to use for setting pw */
    const reset_otp =  randomBytes(48).toString('hex')
    console.log(30, `${reset_otp}`)

    // try {
    //     //encrypt the password
    //     const hashedPwd = await bcrypt.hash(pwd, 10)

    //     //create and store the new user
    //     const result = await User.create({
    //         "username": user,
    //         "password": hashedPwd
    //     })

    //     console.log(result)

    //     res.status(201).json({ 'success': `New user ${user} created!` })
    // }
    // catch (err) {
    //     res.status(500).json({ 'message': err.message })
    // }

    // let dummy_group
    // try {
    //     /* create a dummy group so that there is a "template" for the groups[] attrib */
    //     await App.findOne({ shortname: app_name_header })
    //         .then(async app => {
    //             console.log(56, app)
    //             if (!app) await Promise.reject(new Error(`No app ${app_name_header} found. Aborting group creation ...`))
                
    //             dummy_group = await Group.findOne({ shortname: `dummy_readonly`, })

    //             dummy_group = await Group.create({
    //                 shortname: `dummy_readonly`,
    //                 descrip: `dummy readonly group`,
    //                 apps: [
    //                     app._id,
    //                 ]
    //         })
    //     })
    // }
    // catch (err) {
    // }

    // try {
    //     // create and store the new user
    //     const result = await User.create({
    //         email,
    //         fname,
    //         sname,
    //         mobile,
    //         reset_otp,
    //         groups: [ /* needs to initially only hold a dummy group - user only active once true groups added */
    //             dummy_group._id
    //         ], 
    //     })
    //     console.log(45, result)
    //     res.status(201).json({ 'success': `New user ${email} created!` })
    // }
    // catch (err) {
    //     res.status(500).json({ 'message': err.message })
    // }

    let dummy_group, app
    try {
        /* get app */
        app = await App.findOne({ shortname: app_name_header })
        if (!app) await Promise.reject(new Error(`No app ${app_name_header} found. Aborting group creation ...`))

        /* create a dummy group so that there is a "template" for the groups[] attrib */
        // const result = (await primaryFunction()) ?? (await fallbackFunction());
        dummy_group = (await Group.findOne({ shortname: `dummy_readonly`, })) 
            ?? (await Group.create({
                    shortname: `dummy_readonly`,
                    descrip: `dummy readonly group`,
                    apps: [
                        app._id,
                    ]
            }))

        if (!dummy_group) await Promise.reject(new Error(`Failed on creating dummy readonly group. Aborting group creation ...`))
        const result = await User.create({
            email,
            fname,
            sname,
            mobile,
            reset_otp,
            groups: [ /* needs to initially only hold a dummy group - user only active once true groups added */
                dummy_group._id
            ],
            passwd: '', /* needs to be empty initially */
        })
        console.log(120, result)
        // res.status(201).json({ 'success': `New user ${email} created!` })
        res.status(201).json({
            result: 0,
            email,
            message: `New user ${email} created!`,
        })
    }
    catch (err) {
        res.status(500).json({ 'message': err.message })
    }

}

/* 
curl -X POST http://localhost:6823/register/create_group -H "Content-Type: application/json" -H "Auth-App-Name: react-bubu-tools" \
 -d '{"secret": "youreterriblemuriel", "name": "react-bubu-tools_admin", "descrip": "BuBu Tools Admin"}'
curl -X POST http://localhost:6823/register/create_group -H "Content-Type: application/json"  -H "Auth-App-Name: react-bubu-tools" \
 -d '{"secret": "youreterriblemuriel", "name": "react-bubu-tools_editor", "descrip": "BuBu Tools Editor"}'
*/
export const createGroup = async (req, res) => {
    const { secret, name, descrip } = req.body
    const { app_name_header } = res.locals
    if (!secret || !name || !descrip )
        return res.status(400).json({ 'message': 'Incorrect params' })

    if (secret !== 'youreterriblemuriel')
        return res.status(400).json({ 'message': 'auth wrong' })

    let result, app
    try {

        /* temp: one time create app document */
        // await App.create({
        //     shortname: app_name_header,
        //     descrip: `React App BuBu Tools`,
        //     urlOrigins: [
        //         'localhost:6842',
        //     ]
        // })
    
        await App.findOne({ shortname: app_name_header })
            .then(async app => {
                console.log(56, app)
                if (!app) await Promise.reject(new Error(`No app ${app_name_header} found. Aborting group creation ...`))
                result = await Group.create({
                    shortname: name,
                    descrip,
                    apps: [
                        app._id,
                    ]
            })
        })
        console.log(65, `Group created: `)
        console.log(66, result)
        res.status(201).json({ 'success': `New group ${name} created!` })
    }
    catch (err) {
        console.error(70, err)
        return res.status(500).json({ 'message': err.message })
    }
}