"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationMail = void 0;
const server_1 = require("@trpc/server");
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
});
function sendVerificationMail(to) {
    try {
        const verificationCode = Math.floor(Math.random() * 90000000) + 10000000;
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to,
            subject: 'Email verification code',
            text: `Here is your verification code: ${verificationCode}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw error;
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
        return verificationCode;
    }
    catch (error) {
        throw new server_1.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'FAILED TO SENT VERIFICATION EMAIL\n' + error,
        });
    }
}
exports.sendVerificationMail = sendVerificationMail;
