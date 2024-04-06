"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.makeJwtToken = exports.hash = void 0;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const secretKey = process.env.JWTT_SECRET || 'ABCDEFGHI';
const hash = function (s) {
    return (0, crypto_1.createHash)('sha256').update(s).digest('hex');
    ;
};
exports.hash = hash;
const makeJwtToken = function (user) {
    return jsonwebtoken_1.default.sign(user, secretKey, { expiresIn: '1h' });
};
exports.makeJwtToken = makeJwtToken;
const verifyJwtToken = function (token) {
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyJwtToken = verifyJwtToken;
