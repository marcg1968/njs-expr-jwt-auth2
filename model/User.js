

import mongoose, { Schema } from 'mongoose'
import { Group } from './Group.js'

// const userSchema = new Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     roles: {
//         User: {
//             type: Number,
//             default: 2001
//         },
//         Editor: Number,
//         Admin: Number
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     refreshToken: String
// });

// // const userSchema = new mongoose.Schema(
// const userSchema = new Schema(
//     {
//         username: { type: String, required: true, unique: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//         refreshToken: { type: String },
//         groups: [{
//             type: Schema.Types.ObjectId,
//             // ref: 'Group', // References the 'Group' model
//             ref: Group, // References the 'Group' model
//             default: undefined,
//         }]
//     },
//     {
//         timestamps: true, /* automatically adds and manages date fields: createdAt and updatedAt for every document */
//     }
// )

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        fname: { type: String, required: true, unique: false },
        sname: { type: String, required: true, unique: false },
        passwd: { type: String, required: false },
        reset_otp: { type: String, required: false },
        nonce: { type: String, required: false }, /* used in reset pw verif processs */
        refreshToken: { type: String },
        groups: [{
            type: Schema.Types.ObjectId,
            ref: Group, // references the 'Group' model
            default: undefined,
        }]
    },
    {
        timestamps: true, /* automatically adds and manages date fields: createdAt and updatedAt for every document */
    }
)

export const User = mongoose.model('User', userSchema)
