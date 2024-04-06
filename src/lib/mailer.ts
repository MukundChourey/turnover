import { TRPCError } from "@trpc/server";

const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

export function sendVerificationMail(to: string) {
    try {
        const verificationCode: number = Math.floor(Math.random() * 90000000) + 10000000;
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to, 
            subject: 'Email verification code',
            text: `Here is your verification code: ${verificationCode}`
        };
    
        transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                throw error;
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return verificationCode;
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'FAILED TO SENT VERIFICATION EMAIL\n' + error,
          })
    }
}