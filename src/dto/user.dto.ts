import { z } from 'zod';
import { prisma } from '../lib/prismaClient';
import { hash } from '../lib/helper';

export const registerDto = z.object({
    name: z.string().min(3),
    email: z.string()
        .email("not a valid email")
        .refine(async (e) => {
            return !(await prisma.user.findFirst({ where: { email: e } }))
        }, "EMAIL ALREADY PRESENT"),
    password: z.string().min(5, 'password must contain minimum 5 characters').transform((s) => {
        return hash(s);
    })
});

export const verifyDto = z.object({
    code: z.number().refine((n) => (n >= 9999999 && n <= 99999999), 'INPUT A VALID 8 DIGIT CODE'),
    email: z.string().email(),
})

export const loginDto = z.object({
    email: z.string()
        .email("not a valid email"),
    password: z.string().min(5, 'password must contain minimum 5 characters').transform((s) => {
        return hash(s);
    }),
});
