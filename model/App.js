

import mongoose, { Schema } from 'mongoose'

const appSchema = new Schema({
    shortname: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    urlOrigins: [ String ]
})

export const App = mongoose.model('App', appSchema)
