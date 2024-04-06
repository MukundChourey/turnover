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
exports.deleteCategoryDto = exports.addCategoryDto = exports.createCategoriesDto = exports.createCategoryDto = void 0;
const zod_1 = require("zod");
const prismaClient_1 = require("../lib/prismaClient");
exports.createCategoryDto = zod_1.z.object({
    name: zod_1.z.string().min(3).refine((c) => __awaiter(void 0, void 0, void 0, function* () {
        return !(yield prismaClient_1.prisma.category.findFirst({ where: { name: c } }));
    }), "CATEGORY ALREADY PRESENT"),
});
exports.createCategoriesDto = zod_1.z.object({
    names: zod_1.z.array(zod_1.z.string()).min(1)
});
exports.addCategoryDto = zod_1.z.object({
    categoryId: zod_1.z.string().min(1).refine((id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prismaClient_1.prisma.category.findUnique({ where: { id } });
    }), "INVALID CATEGORY ID"),
});
exports.deleteCategoryDto = zod_1.z.object({
    categoryId: zod_1.z.string().min(1).refine((id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prismaClient_1.prisma.category.findUnique({ where: { id } });
    }), "INVALID CATEGORY ID"),
});
