import 'dotenv/config'
import nodemailer from 'nodemailer'

const {
    NOTIFY_EMAIL,
    NOTIFY_PASS,
    // ADMIN_EMAIL,
    // ADMIN_PASSWORD,
    SMTP_HOST,
    SMTP_PORT,
} = process.env

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.NOTIFY_EMAIL,
//         pass: process.env.NOTIFY_PASS
//     }
// })

const smtpTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: NOTIFY_EMAIL,
        pass: NOTIFY_PASS,
        // pass: 'wrong', // TEST: deliberately false
    }
})

export const sendResetPwLink = async ({ email, fname, sname, reset_otp,  origin, token, expiresIn }) => {

    console.log(33, `sending email pw reset link: \n${origin}/verify/${token}\n`)

    // await transporter.sendMail({
    const emailBodyText = `Hi ${fname} ${sname},

We received a request to reset the password for your account at ${origin}.

If you made this request, click the secure link below to reset your password. 

${origin}/verify/${token}

This link expires in ${expiresIn} and can only be used once.

If this was not you, please ignore this email. Your current password remains unchanged, and no further action is needed.

`
    await smtpTransport.sendMail({
        from: process.env.NOTIFY_EMAIL,
        to: `${email}`,
        subject: `Password reset request ${email}`,
        text: `${emailBodyText}`
    })
}

// export const sendVisaNotification = async (application) => {
//     await transporter.sendMail({
//         from: process.env.NOTIFY_EMAIL,
//         to: process.env.NOTIFY_EMAIL,
//         subject: 'New Visa Application Submitted',
//         text: `
// New visa application:

// Applicant: ${application.personal.family_name}, ${application.personal.given_names}
// Email: ${application.personal.email}
// Passport: ${application.personal.passport_number}
//     `
//     })
// }

// export const sendApplicantConfirmation = async (application, pdfBuffer) => {
//     await smtpTransport.sendMail({
//         from: process.env.NOTIFY_EMAIL,
//         to: application.personal.email,
//         subject: 'Your Visa Application Has Been Received',
//         text: 'Thank you for submitting your visa application. A PDF copy is attached.',
//         attachments: [
//             {
//                 filename: 'visa-application.pdf',
//                 content: pdfBuffer
//             }
//         ]
//     })
// }

// export const sendOTP = async ({ email, code, expires, link } = {}) => {
//     console.log(62, { email, code, expires, link })
//     // subject: 'Verification CODE for StudyBird Visa Application',
//     await smtpTransport.sendMail({    
//         from: process.env.NOTIFY_EMAIL,
//         to: email,
//         subject: `CODE ${code} to verify your email address for the StudyBird Visa Application`,
//         text: `Here is the code to start your online StudyBird Visa Application:

//     ${code}

// This code expires at ${expires}.

// Continue your application at the following link:

//     ${link}
//         `
//     })
// }
