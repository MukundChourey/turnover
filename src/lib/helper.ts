import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
require('dotenv').config()

const secretKey: string = process.env.JWTT_SECRET || 'ABCDEFGHI';

export const hash = function (s: string) {
    return createHash('sha256').update(s).digest('hex');;
}

export const makeJwtToken = function (user: any) {
    return jwt.sign(user, secretKey, { expiresIn: '1d' });
}

export const verifyJwtToken = function (token: string) {
    return jwt.verify(token, secretKey);
}
