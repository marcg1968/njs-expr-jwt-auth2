

import fs from 'fs'
import { User } from '../model/User.js'
import { Group } from '../model/Group.js'
import { App } from '../model/App.js'

export const getAllUsers = async (req, res) => {
    // const users = await User.find()
    const users = await User.find().select('-passwd')
    if (!users) return res.status(204).json({ 'message': 'No users found' })
    res.json(users)
}

export const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'User ID required' })
    const user = await User.findOne({ _id: req.body.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` })
    }
    const result = await user.deleteOne({ _id: req.body.id })
    res.json(result)
}

export const getUser = async (req, res) => {
    // if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' })
    const { email, } = req.body
    if (!email)
        return res.status(400).json({ 'message': 'email is required.' })

    // const user = await User.findOne({ email }).exec()
    const user = await User.findOne({ email }) .select('-passwd').exec()
    if (!user) {
        return res.status(204).json({ 'message': `User email ${email} not found` })
    }
    res.json(user)
}

/* routine to get single user and associated group(s)/app(s) */
export const findUserWithGroupsForApp = async ({ email, app_name_header }) => {

    return await User.findOne({ email })
        .populate({
            path: 'groups',
            // select: 'shortname description',
            model: Group,
            populate: {
                path: 'apps',
                // select: 'shortname urlOrigin',
                // select: 'shortname',
                match: { shortname: `${app_name_header}` },   // <-- filter here
                model: App,
            }
        })

}

export const updateUser = async (req, res) => {
    const { app_name_header } = res.locals

    const { email, fname, sname, groups, } = req.body
    if (!email)
        return res.status(400).json({ 'message': 'email is required.' })

    const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { reset_otp: null, nonce: null, fname, sname, groups } },
        { new: true }
    )
    console.log(70, updatedUser)
    res.json({...updateUser})
}

export const getUserGroups = async (req, res) => {
    const { app_name_header } = res.locals

    const groups = await Group.find()
        .select('-apps')
            .populate({
                path: 'apps',
                match: { shortname: `${app_name_header}` },   // <-- filter here
                model: App,
            })
    return res.json({ groups })
}

