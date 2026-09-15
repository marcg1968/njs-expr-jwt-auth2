

import mongoose, { Schema } from 'mongoose'
import { App } from './App.js'

const groupSchema = new Schema({
    shortname: {
        type: String,
        required: true,
        unique: true,
    },
    descrip: {
        type: String,
        required: false,
        unique: false,
    },
    apps: [{
        type: Schema.Types.ObjectId,
        ref: App, // References the 'App' model
        default: undefined,
    }],
})

export const Group = mongoose.model('Group', groupSchema)
