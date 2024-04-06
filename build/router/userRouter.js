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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const trpc_1 = require("../lib/trpc");
const userController_1 = __importDefault(require("../controller/userController"));
const user_dto_1 = require("../dto/user.dto");
exports.userRouter = trpc_1.trpcUser.router({
    register: trpc_1.trpcUser.procedure
        .input(user_dto_1.registerDto)
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userController_1.default.register(input);
    })),
    verify: trpc_1.trpcUser.procedure
        .input(user_dto_1.verifyDto)
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userController_1.default.verifyEmail(input);
    })),
    login: trpc_1.trpcUser.procedure
        .input(user_dto_1.loginDto)
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userController_1.default.login(input);
    })),
});
