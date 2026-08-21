

import mongoose, { Schema } from 'mongoose'
import { App } from './App.js'

const groupSchema = new Schema({
    shortname: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
        unique: true,
    },
    apps: [{
        type: Schema.Types.ObjectId,
        ref: App, // References the 'Group' model
        default: undefined,
    }],
})

export const Group = mongoose.model('Group', groupSchema)
