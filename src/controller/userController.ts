import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../lib/prismaClient';
import { loginDto, registerDto, verifyDto } from '../dto/user.dto';
import { sendVerificationMail } from '../lib/mailer';
import { makeJwtToken } from '../lib/helper';

class UserController {
    static async register(body: z.infer<typeof registerDto>) {
        try {
            const name: string = body.name.trim();
            const email: string = body.email.trim();
            const password: string = body.password.trim();

            const verificationCode: number = sendVerificationMail(email);
            prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    verification_code: verificationCode.toString(),
                    verified: false,
                },
            });
            return {
                success: true,
            }
        } catch (error) {
            throw error;
        }
    }

    static async verifyEmail(body: z.infer<typeof verifyDto>) {
        try {
            const code = body.code.toString().trim();
            const email = body.email.trim();
            const user = await prisma.user.findFirst({ where: { email: email } });
    
            if (!user) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'USER NOT REGISTERED',
                });
            } else if (user.verified) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'EMAIL ALREADY VERIFIED',
                });
            } else if (code !== user.verification_code) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'WRONG VERIFICATION CODE',
                });
            }
    
            await prisma.user.update({
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
        } catch (error) {
            throw error;
        }
    }

    static async login(body: z.infer<typeof loginDto>) {
        try {
            const email: string = body.email.trim();
            const password: string = body.password.trim();
    
            const user = await prisma.user.findFirst({ where: { email: email } });
    
            if (!user) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'USER NOT REGISTERED',
                });
            } else if (!user.verified) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'USER NOT VERIFIED',
                });
            } else if (user.password !== password) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'WRONG PASSWORD',
                });
            }
    
            return {
                success: true,
                token: makeJwtToken(user),
            };
        } catch (error) {
            throw error;
        }
    }
}

export default UserController;
