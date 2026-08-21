

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

// const userSchema = new mongoose.Schema(
const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        refreshToken: { type: String },
        groups: [{
            type: Schema.Types.ObjectId,
            // ref: 'Group', // References the 'Group' model
            ref: Group, // References the 'Group' model
            default: undefined,
        }]
    },
    {
        timestamps: true, /* automatically adds and manages date fields: createdAt and updatedAt for every document */
    }
)

export const User = mongoose.model('User', userSchema)
