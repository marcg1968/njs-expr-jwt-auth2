import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const {
    MONGODB_DB,
    MONGODB_HOST,
    MONGODB_PASS,
    MONGODB_USER,
} = process.env
const MONGO_URI = MONGODB_USER && MONGODB_PASS
    ? `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}/${MONGODB_DB}`
    : null

export const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGO_URI)
        await mongoose.connect(MONGO_URI)
        console.log('MongoDB connected')
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}
