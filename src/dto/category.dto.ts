import { z } from 'zod';
import { prisma } from '../lib/prismaClient';

export const createCategoryDto = z.object({
    name: z.string().min(3).refine(async (c) => {
        return !(await prisma.category.findFirst({ where: { name: c } }))
    }, "CATEGORY ALREADY PRESENT"),
});

export const createCategoriesDto = z.object({
    names: z.array(z.string()).min(1)
});

export const addCategoryDto = z.object({
    categoryId: z.string().min(1).refine(async (id) => {
        return await prisma.category.findUnique({ where: { id } });
    }, "INVALID CATEGORY ID"),
});

export const fetchUserCategoriesDto = z.object({
    offset: z.number().default(0),
});

export const deleteCategoryDto = z.object({
    categoryId: z.string().min(1).refine(async (id) => {
        return await prisma.category.findUnique({ where: { id } });
    }, "INVALID CATEGORY ID"),
});
