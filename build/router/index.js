"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouterCategory = exports.appRouterUser = void 0;
const trpc_1 = require("../lib/trpc");
const userRouter_1 = require("./userRouter");
const categoryRouter_1 = require("./categoryRouter");
exports.appRouterUser = trpc_1.trpcUser.router({
    user: userRouter_1.userRouter,
});
exports.appRouterCategory = trpc_1.trpcCategory.router({
    category: categoryRouter_1.categoryRouter,
});
