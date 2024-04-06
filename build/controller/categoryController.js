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
const prismaClient_1 = require("../lib/prismaClient");
const server_1 = require("@trpc/server");
class CategoryController {
    static createCategory(body, isAdmin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = body.name.trim();
                if (!isAdmin) {
                    throw new server_1.TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'USER NOT AUTHORIZED TO CREATE',
                    });
                }
                return prismaClient_1.prisma.category.create({
                    data: {
                        name
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteCategory(body, isAdmin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = body.categoryId.trim();
                if (!isAdmin) {
                    throw new server_1.TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'USER NOT AUTHORIZED TO DELETE',
                    });
                }
                return yield prismaClient_1.prisma.category.delete({
                    where: {
                        id: categoryId
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static createCategories(body, isAdmin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const names = body.names;
                if (!isAdmin) {
                    throw new server_1.TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'USER NOT AUTHORIZED TO CREATE',
                    });
                }
                return prismaClient_1.prisma.category.createMany({
                    data: names.map((name) => { return { name }; }),
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static fetchAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return prismaClient_1.prisma.category.findMany();
            }
            catch (error) {
                throw error;
            }
        });
    }
    static addCategory(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = body.categoryId.trim();
                const relation = yield prismaClient_1.prisma.category_user_relation.findFirst({
                    where: {
                        user_id: userId,
                        category_id: categoryId,
                    }
                });
                if (relation) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'CATEGORY ALREADY ADDED',
                    });
                }
                return prismaClient_1.prisma.category_user_relation.create({
                    data: {
                        user_id: userId,
                        category_id: categoryId
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserCategories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relation = yield prismaClient_1.prisma.category.findMany({
                    include: {
                        category_user_relation: {
                            where: {
                                user_id: userId
                            }
                        },
                    },
                    orderBy: {
                        category_user_relation: {
                            _count: 'desc',
                        }
                    }
                });
                return relation;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static removeCategoryUser(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = body.categoryId.trim();
                const categoryRelation = yield prismaClient_1.prisma.category_user_relation.findFirst({
                    where: {
                        category_id: categoryId,
                        user_id: userId
                    }
                });
                if (!categoryRelation) {
                    throw new server_1.TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'CATEGORY NOT ADDED FOR USER',
                    });
                }
                return yield prismaClient_1.prisma.category_user_relation.delete({
                    where: {
                        id: categoryRelation === null || categoryRelation === void 0 ? void 0 : categoryRelation.id
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = CategoryController;
