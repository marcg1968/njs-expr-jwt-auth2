

import mongoose from 'mongoose'
import 'dotenv/config'

const {
    MONGODB_DB,
    MONGODB_HOST,
    MONGODB_PASS,
    MONGODB_USER,
} = process.env

const MONGO_URI = MONGODB_USER && MONGODB_PASS
    ? `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}/${MONGODB_DB}`
    : null
// console.log(22, {MONGO_URI})

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI, {
//             useUnifiedTopology: true,
//             useNewUrlParser: true
//         })
//     } catch (err) {
//         console.error(err)
//     }
// }

mongoose.set('strictQuery', false)

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log(`MongoDB on '${MONGODB_HOST}' as '${MONGODB_USER}' connected`)
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}
