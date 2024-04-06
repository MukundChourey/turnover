"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trpcCategory = exports.trpcUser = exports.createContextForUser = exports.createContextForCategory = void 0;
const server_1 = require("@trpc/server");
const helper_1 = require("./helper");
const createContextForCategory = ({ req, res, }) => {
    try {
        const bearerToken = req.headers.authorization || 'Bearer abcdefgh';
        const token = bearerToken.replace(/^Bearer\s/, '');
        const user = (0, helper_1.verifyJwtToken)(token);
        if (!user) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You are not authorized',
            });
        }
        else if (!user.verified) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not verified',
            });
        }
        return {
            user: user,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.createContextForCategory = createContextForCategory;
const createContextForUser = ({ req, res, }) => {
    return {};
};
exports.createContextForUser = createContextForUser;
exports.trpcUser = server_1.initTRPC.context().create();
exports.trpcCategory = server_1.initTRPC.context().create();
