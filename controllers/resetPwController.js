
import bcrypt from 'bcrypt'
import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import path from 'path'
import util from 'node:util'
import ms from 'ms'
import { User } from '../model/User.js'
import { Group } from '../model/Group.js'
import { App } from '../model/App.js'
import { sendResetPwLink } from '../services/emailService.js'

const __filename = path.basename(import.meta.filename)

const expiresIn = '300s'

const encryptPw = async pwd => await bcrypt.hash(pwd, 10)

const generateNone = () => {
    const timestamp = Date.now().toString(16)

    // generate 8 bytes of random data for uniqueness
    const randBytes = randomBytes(16).toString('hex')

    // combine them to form the nonce
    return `${timestamp}-${randBytes}`
}

const findUserWithOTP = async ({ email, otp, app_name_header }) => {

    console.log(24, `looking for user with email ${email} and otp ${otp} ... `)
    const user = await User.findOne({ email, reset_otp: otp })
        .populate({
            path: 'groups',
            model: Group,
            populate: {
                path: 'apps',
                match: { shortname: `${app_name_header}` },   // <-- filter here
                model: App,
            }
        })
    console.log(34, user)
    if (!user) return null

    // /* if user found, reset OTP */
    // /* generate a hash to use for setting pw */
    // const new_reset_otp =  randomBytes(48).toString('hex')
    // console.log(38, `${new_reset_otp}`)

    const nonce = generateNone()
    
    // await User.updateOne({ email, otp }, { otp: reset_otp: new_reset_otp })
    const updatedUser = await User.findOneAndUpdate(
        { email },
        // { $set: { reset_otp: new_reset_otp } },
        { $set: { reset_otp: '', nonce } },
        { new: true }
    )
    console.log(51, updatedUser)

    return updatedUser
}

/* remove any nonce and generate new reset_otp */
export const removeNonceAndGenerateResetOTP = async ({ email }) => {
    const nonce = generateNone()
    const reset_otp = randomBytes(48).toString('hex')
    const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { reset_otp, nonce } },
        { new: true }
    )
    console.log(67, updatedUser)
    return updatedUser
}

export const handleResetOTP = async (req, res) => {

    const { jwt: jwtToken } = req.body
    const { origin, host } = req.headers

    const { app_name_header } = res.locals
    console.log(62, app_name_header, jwtToken)

    /* 
    decoded: {
        otp: 'ef8a9800cd9b934db5b799043fb08b6fb4e1c8bd15e4518d08226fa072c27f9965dcdca66f4f0e6ea8a29d71bdc84d1e',
        email: 'mgreyling+1@gmail.com',
        iat: 1788931134,
        exp: 1788931434
    } */
    let email, otp, error
    jwt.verify(
        jwtToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            console.log(72, {err, decoded})
            // if (err) return res.status(403).json({ err })
            if (err) {
                return error = { ...err }
            }
            //;({ username: email } = decoded)
            ;({ email, otp } = decoded)
        }
    )
    if (error) return res.status(403).json({ error })

    const updatedUser = await findUserWithOTP({ email, otp, app_name_header })
    console.log(87, updatedUser)

    if (!updatedUser) return { err: 'uh oh' }

    const { nonce, ...details } = updatedUser || {}

    res.cookie(
        'nonce', 
        nonce, 
        {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        }
    )

    // res.json({ foo: 'bar' })
    // res.json({ foo: 'bar', decoded: _decoded, nonce })
    // res.json({ foo: 'bar', nonce })
    res.json({ foo: 'bar', details })
}

export const setNewPw = async (req, res) => {

    const { newpw, jwt: jwtToken } = req.body
    // const { origin, host } = req.headers

    const cookies = req.cookies
    console.log(123, cookies)
    const nonce = cookies.nonce

    const { app_name_header } = res.locals
    // console.log(123, { app_name_header, body: req.body, cookies })
    console.log(127, util.inspect({ app_name_header, body: req.body, cookies }, { showHidden: false, depth: null, colors: true }))

    const pwEncrypted = await encryptPw(newpw)

    /* extract email (username) from jwt and check if nonce is correct */
    /* TODO: refactor this since it is duplicated code!!!! */
    let email, error
    jwt.verify(
        jwtToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            console.log(145, {err, decoded})
            if (err) {
                return error = { ...err }
            }
            email = decoded.email
        }
    )
    if (error) return res.status(403).json({ error })

    // const foundUser = await User.findOne({ email })
    const updatedUser = await User.findOneAndUpdate(
        { email, nonce },
        { $set: { reset_otp: null, nonce: null, passwd: pwEncrypted } },
        { new: true }
    )
    console.log(164, updatedUser)

    // res.json({ fooody: 'BAR!', nonce })
    res.json({ resultCode: 0, resultMsg: `updated user!` })

}

export const startPwReset = async (req, res, next) => {
    let foundUser
    const { email } = req.body
    const { origin, host } = req.headers
    const { protocol } = req
    const port = host.includes(':') ? host.split(':')[1] : null
    if (!email) return res.status(400).json({ 'message': ' email addr required.' })

    const { app_name_header } = res.locals

    // foundUser = await findUserWithGroupsForApp({ email, app_name_header })
    foundUser = await removeNonceAndGenerateResetOTP({ email })
    console.warn(184, `[${__filename}]`, `foundUser:`, util.inspect(foundUser, { showHidden: false, depth: null, colors: true }))

    if (!foundUser) {
        res.locals.invalid_credentials = true
        return next() /* will move to handleInvalidCredentials */
    }

    if (foundUser?.reset_otp && !foundUser?.passwd) {
    
        const token = jwt.sign(
            {
                otp: foundUser.reset_otp,
                email: foundUser.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn }
        )

        await sendResetPwLink({ ...foundUser.toObject(), token, origin, expiresIn }) // { email, fname, sname, reset_otp, origin, protocol }
        return res.json({
            // msg: `sent email for pw reset`
            success: true,
            status: 'pw_reset',
            action: 'email_sent',
            expiresIn, 
            expiresInFull: ms(ms(expiresIn), { long: true }), 
        })
    }

    // if (!foundUser) return res.sendStatus(401) /* unauthorized */
    if (!foundUser || !foundUser?.passwd) {
        return res.sendStatus(401) /* unauthorized */
    }

    res.json({ interim: true })
}
