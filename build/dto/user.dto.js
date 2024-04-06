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
exports.loginDto = exports.verifyDto = exports.registerDto = void 0;
const zod_1 = require("zod");
const prismaClient_1 = require("../lib/prismaClient");
const helper_1 = require("../lib/helper");
exports.registerDto = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string()
        .email("not a valid email")
        .refine((e) => __awaiter(void 0, void 0, void 0, function* () {
        return !(yield prismaClient_1.prisma.user.findFirst({ where: { email: e } }));
    }), "EMAIL ALREADY PRESENT"),
    password: zod_1.z.string().min(5, 'password must contain minimum 5 characters').transform((s) => {
        return (0, helper_1.hash)(s);
    })
});
exports.verifyDto = zod_1.z.object({
    code: zod_1.z.number().refine((n) => n >= 9999999),
    email: zod_1.z.string().email(),
});
exports.loginDto = zod_1.z.object({
    email: zod_1.z.string()
        .email("not a valid email"),
    password: zod_1.z.string().transform((s) => {
        return (0, helper_1.hash)(s);
    }),
});
