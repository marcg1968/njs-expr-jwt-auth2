

import mongoose, { Schema } from 'mongoose'

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
})

// module.exports = mongoose.model('Employee', employeeSchema)
export const Employee = mongoose.model('Employee', employeeSchema)