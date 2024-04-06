import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { verifyJwtToken } from './helper'
import { userPayload } from '@prisma/client';

export const createContextForCategory = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => {
    try {
        const bearerToken: string = req.headers.authorization || 'Bearer abcdefgh';
        const token: string = bearerToken.replace(/^Bearer\s/, '');

        const user: userPayload | any = verifyJwtToken(token);

        if (!user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You are not authorized',
            })
        } else if (!user.verified) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not verified',
            })
        }

        return {
            user: user,
        }
    } catch (error) {
        throw error;
    }
}

export const createContextForUser = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => {
    return {

    }
}

type ContextForUser = inferAsyncReturnType<typeof createContextForUser>
type ContextForCategory = inferAsyncReturnType<typeof createContextForCategory>

export const trpcUser = initTRPC.context<ContextForUser>().create()
export const trpcCategory = initTRPC.context<ContextForCategory>().create()
