import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = path.basename(fileURLToPath(import.meta.url))

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    console.log(7, `${__filename}:`, authHeader)
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
    const token = authHeader.split(' ')[1]
    console.log(7, `${__filename}:`, token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next()
        }
    )
}
