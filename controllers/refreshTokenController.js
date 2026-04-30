const User = require('../model/User')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    console.log(6, cookies)
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken }).exec()
    console.log(11, foundUser)

    if (!foundUser) return res.sendStatus(403) //Forbidden 
    
    /* evaluate jwt */
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(20, {err, decoded})
            // if (err || foundUser.username !== decoded.username) return res.sendStatus(403)
            if (err || foundUser.email !== decoded.username) return res.sendStatus(403)
            // const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        // "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '90s' }
            )
            // res.json({ roles, accessToken })
            res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }
