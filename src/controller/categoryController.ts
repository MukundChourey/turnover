import { z } from 'zod';
import { prisma } from '../lib/prismaClient';
import { addCategoryDto, createCategoriesDto, createCategoryDto, deleteCategoryDto } from '../dto/category.dto';
import { TRPCError } from '@trpc/server';

class CategoryController {

    static async createCategory(body: z.infer<typeof createCategoryDto>, isAdmin: boolean = false) {
        try {
            const name: string = body.name.trim();

            if (!isAdmin) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'USER NOT AUTHORIZED TO CREATE',
                });
            }

            return prisma.category.create({
                data: {
                    name
                },
            });
        } catch (error) {
            throw error;
        }
    }
    static async deleteCategory(body: z.infer<typeof deleteCategoryDto>, isAdmin: boolean = false) {
        try {
            const categoryId: string = body.categoryId.trim();

            if (!isAdmin) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'USER NOT AUTHORIZED TO DELETE',
                });
            }
            return await prisma.category.delete({
                where: {
                    id: categoryId
                }
            });
        } catch (error) {
            throw error;
        }
    }

    static async createCategories(body: z.infer<typeof createCategoriesDto>, isAdmin: boolean = false) {
        try {
            const names: string[] = body.names;
            if (!isAdmin) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'USER NOT AUTHORIZED TO CREATE',
                });
            }

            return prisma.category.createMany({
                data: names.map((name) => { return { name } }),
            });
        } catch (error) {
            throw error;
        }
    }

    static async fetchAllCategories() {
        try {
            return prisma.category.findMany();
        } catch (error) {
            throw error;
        }
    }

    static async addCategory(body: z.infer<typeof addCategoryDto>, userId: string) {
        try {
            const categoryId: string = body.categoryId.trim();

            const relation = await prisma.category_user_relation.findFirst({
                where: {
                    user_id: userId,
                    category_id: categoryId,
                }
            });
            if (relation) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'CATEGORY ALREADY ADDED',
                });
            }

            return prisma.category_user_relation.create({
                data: {
                    user_id: userId,
                    category_id: categoryId
                },
            });
        } catch (error) {
            throw error;
        }
    }
    static async getUserCategories(userId: string, offset = 0) {
        try {
            console.log('the offset is', offset);

            const categories = await prisma.category.findMany({
                include: {
                    category_user_relation: {
                        where: {
                            user_id: userId
                        }
                    },
                },
                orderBy: [
                    {
                        createdAt: 'asc',
                    }, {
                        id: 'asc'
                    }
                ],
                skip: offset,
                take: 6
            })
            if (categories.length === 0) {
                offset = -1;
            } else {
                offset += 6;
            }
            return { categories, offset };
        } catch (error) {
            throw error;
        }
    }

    static async removeCategoryUser(body: z.infer<typeof deleteCategoryDto>, userId: string) {
        try {
            const categoryId: string = body.categoryId.trim();

            const categoryRelation = await prisma.category_user_relation.findFirst({
                where: {
                    category_id: categoryId,
                    user_id: userId
                }
            });
            if (!categoryRelation) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'CATEGORY NOT ADDED FOR USER',
                });
            }

            return await prisma.category_user_relation.delete({
                where: {
                    id: categoryRelation?.id
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

export default CategoryController;
