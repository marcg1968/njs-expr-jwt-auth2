

import mongoose from 'mongoose'
import 'dotenv/config'

const {
    MONGODB_DB,
    MONGODB_HOST,
    MONGODB_PASS,
    MONGODB_USER,
} = process.env

/* NB: this is not working!!! */
// const MOBILE_PROVIDER_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@ac-8rwfdak-shard-00-00.koazls1.mongodb.net:27017,ac-8rwfdak-shard-00-01.koazls1.mongodb.net:27017,ac-8rwfdak-shard-00-02.koazls1.mongodb.net:27017/?ssl=true&replicaSet=atlas-11zhog-shard-0&authSource=admin&appName=Cluster01`
const MOBILE_PROVIDER_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@ac-8rwfdak-shard-00-00.koazls1.mongodb.net:27017,ac-8rwfdak-shard-00-01.koazls1.mongodb.net:27017,ac-8rwfdak-shard-00-02.koazls1.mongodb.net:27017/?ssl=true&replicaSet=atlas-11zhog-shard-0&authSource=admin&appName=Cluster01`

let IS_MOBILE = false
// IS_MOBILE = true

const MONGO_URI = MONGODB_USER && MONGODB_PASS
    ? IS_MOBILE
        ? MOBILE_PROVIDER_URI
        : `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}/${MONGODB_DB}`
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
    }
    catch (err) {
        console.error(44, err.message)
        process.exit(1)
    }
}
