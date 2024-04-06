import { trpcCategory, trpcUser } from '../lib/trpc'
import { userRouter } from './userRouter'
import { categoryRouter } from './categoryRouter'

export const appRouterUser = trpcUser.router({
    user: userRouter,
})

export const appRouterCategory = trpcCategory.router({
    category: categoryRouter,
})

export type AppRouterUser = typeof appRouterUser
export type AppRouterCategory = typeof appRouterCategory
