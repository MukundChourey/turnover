import { trpcUser } from '../lib/trpc'
import UserController from '../controller/userController'
import { loginDto, registerDto, verifyDto } from "../dto/user.dto"

export const userRouter = trpcUser.router({
    register: trpcUser.procedure
        .input(registerDto)
        .mutation(async ({ input }) => {
            return await UserController.register(input);
        }),
    verify: trpcUser.procedure
        .input(verifyDto)
        .mutation(async ({ input }) => {
            return await UserController.verifyEmail(input);
        }),
    login: trpcUser.procedure
        .input(loginDto)
        .mutation(async ({ input }) => {
            return await UserController.login(input);
        }),
})
