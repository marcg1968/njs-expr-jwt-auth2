const mongoose = require('mongoose')

const {
    MONGODB_DB,
    MONGODB_HOST,
    MONGODB_PASS,
    MONGODB_USER,
} = process.env
const MONGO_URI = MONGODB_USER && MONGODB_PASS
    ? `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}/${MONGODB_DB}`
    : null

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (err) {
        console.error(err)
    }
}

module.exports = connectDB
