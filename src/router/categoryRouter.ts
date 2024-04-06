import CategoryController from '../controller/categoryController';
import { addCategoryDto, createCategoriesDto, createCategoryDto, deleteCategoryDto, fetchUserCategoriesDto } from '../dto/category.dto';
import { trpcCategory } from '../lib/trpc';

export const categoryRouter = trpcCategory.router({
    fetch: trpcCategory.procedure.query(({ ctx }) => {
        const { user } = ctx;
        return CategoryController.fetchAllCategories();
    }),
    create: trpcCategory.procedure
        .input(createCategoryDto)
        .mutation(async ({ input, ctx }) => {
            return await CategoryController.createCategory(input, ctx.user.isAdmin);
        }),
    delete: trpcCategory.procedure
        .input(deleteCategoryDto)
        .mutation(async ({ input, ctx }) => {
            return await CategoryController.deleteCategory(input, ctx.user.isAdmin);
        }),
    createMany: trpcCategory.procedure
        .input(createCategoriesDto)
        .mutation(async ({ input, ctx }) => {
            return await CategoryController.createCategories(input, ctx.user.isAdmin);
        }),

    addCategory: trpcCategory.procedure
        .input(addCategoryDto)
        .mutation(async ({ input, ctx }) => {
            return await CategoryController.addCategory(input, ctx.user.id);
        }),
    getUserCategories: trpcCategory.procedure
    .input(fetchUserCategoriesDto)
    .query(({ input, ctx }) => {
        const { user } = ctx;        
        return CategoryController.getUserCategories(user.id, input.offset);
    }),
    removeUserCategory: trpcCategory.procedure
        .input(deleteCategoryDto)
        .mutation(async ({ input, ctx }) => {
            return await CategoryController.removeCategoryUser(input, ctx.user.id);
        }),
})
