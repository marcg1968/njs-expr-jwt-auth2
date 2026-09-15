

import fs from 'fs'
import { User } from '../model/User.js'
import { Group } from '../model/Group.js'
import { App } from '../model/App.js'

export const getAllUsers = async (req, res) => {
    const users = await User.find()
    if (!users) return res.status(204).json({ 'message': 'No users found' })
    res.json(users)
}

export const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.body.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` })
    }
    const result = await user.deleteOne({ _id: req.body.id })
    res.json(result)
}

export const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.params.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` })
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