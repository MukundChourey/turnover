"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const prismaClient_1 = require("../lib/prismaClient");
const mailer_1 = require("../lib/mailer");
const helper_1 = require("../lib/helper");
class UserController {
    static register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = body.name.trim();
                const email = body.email.trim();
                const password = body.password.trim();
                const verificationCode = (0, mailer_1.sendVerificationMail)(email);
                return prismaClient_1.prisma.user.create({
                    data: {
                        name,
                        email,
                        password,
                        verification_code: verificationCode.toString(),
                        verified: false,
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static verifyEmail(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const code = body.code.toString().trim();
                const email = body.email.trim();
                const user = yield prismaClient_1.prisma.user.findFirst({ where: { email: email } });
                if (!user) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'USER NOT REGISTERED',
                    });
                }
                else if (user.verified) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'EMAIL ALREADY VERIFIED',
                    });
                }
                else if (code !== user.verification_code) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'WRONG VERIFICATION CODE',
                    });
                }
                yield prismaClient_1.prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        verified: true,
                    },
                });
                return {
                    success: true,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    static login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = body.email.trim();
                const password = body.password.trim();
                const user = yield prismaClient_1.prisma.user.findFirst({ where: { email: email } });
                if (!user) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'USER NOT REGISTERED',
                    });
                }
                else if (!user.verified) {
                    throw new server_1.TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'USER NOT VERIFIED',
                    });
                }
                else if (user.password !== password) {
                    throw new server_1.TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'WRONG PASSWORD',
                    });
                }
                return {
                    success: true,
                    token: (0, helper_1.makeJwtToken)(user),
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserController;
