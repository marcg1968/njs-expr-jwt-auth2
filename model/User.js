const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        refreshToken: { type: String }
    },
    {
        timestamps: true, /* automatically adds and manages date fields: createdAt and updatedAt for every document */
    }
)

module.exports = mongoose.model('User', userSchema)
// export const User = mongoose.model('User', userSchema)
