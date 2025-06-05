import { PrismaClient, ToolCategory } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { CategoryCreateInput, CategoryUpdateInput } from './types';

/**
 * Service for managing tool categories
 */
export class CategoryBaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get all categories
   */
  public async getAllCategories(): Promise<ToolCategory[]> {
    return this.prisma.toolCategory.findMany({
      include: {
        parentCategory: true,
        _count: {
          select: {
            childCategories: true,
            tools: true,
          },
        },
      },
    });
  }

  /**
   * Get category by ID
   */
  public async getCategoryById(id: string): Promise<ToolCategory | null> {
    return this.prisma.toolCategory.findUnique({
      where: { id },
      include: {
        parentCategory: true,
        childCategories: true,
        attributeGroups: {
          include: {
            _count: {
              select: {
                attributes: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        _count: {
          select: {
            attributes: true,
            tools: true,
          },
        },
      },
    });
  }

  /**
   * Create a new category
   */
  public async createCategory(categoryData: CategoryCreateInput): Promise<ToolCategory> {
    // Check if parent category exists if parentId is provided
    if (categoryData.parentId) {
      const parentCategory = await this.prisma.toolCategory.findUnique({
        where: { id: categoryData.parentId },
      });

      if (!parentCategory) {
        throw new AppError('Parent category not found', 404);
      }
    }

    // Check if category name is unique within the parent
    const existingCategory = await this.prisma.toolCategory.findFirst({
      where: {
        name: categoryData.name,
        parentId: categoryData.parentId,
      },
    });

    if (existingCategory) {
      throw new AppError('Category name already exists within this parent category', 409);
    }

    // Create category
    return this.prisma.toolCategory.create({
      data: categoryData,
      include: {
        parentCategory: true,
      },
    });
  }

  /**
   * Update category
   */
  public async updateCategory(id: string, categoryData: CategoryUpdateInput): Promise<ToolCategory> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if parent category exists if parentId is provided
    if (categoryData.parentId) {
      const parentCategory = await this.prisma.toolCategory.findUnique({
        where: { id: categoryData.parentId },
      });

      if (!parentCategory) {
        throw new AppError('Parent category not found', 404);
      }

      // Prevent circular reference
      if (categoryData.parentId === id) {
        throw new AppError('Category cannot be its own parent', 400);
      }

      // Check if the new parent is not a descendant of this category
      const isDescendant = await this.isDescendantOf(categoryData.parentId, id);
      if (isDescendant) {
        throw new AppError('Cannot set a descendant as parent (circular reference)', 400);
      }
    }

    // Check if category name is unique within the parent
    if (categoryData.name) {
      const existingCategory = await this.prisma.toolCategory.findFirst({
        where: {
          name: categoryData.name,
          parentId: categoryData.parentId ?? category.parentId,
          id: { not: id },
        },
      });

      if (existingCategory) {
        throw new AppError('Category name already exists within this parent category', 409);
      }
    }

    // Update category
    return this.prisma.toolCategory.update({
      where: { id },
      data: categoryData,
      include: {
        parentCategory: true,
      },
    });
  }

  /**
   * Delete category
   */
  public async deleteCategory(id: string): Promise<void> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id },
      include: {
        childCategories: true,
        tools: true,
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if category has children
    if (category.childCategories.length > 0) {
      throw new AppError('Cannot delete category with child categories', 400);
    }

    // Check if category has tools
    if (category.tools.length > 0) {
      throw new AppError('Cannot delete category with associated tools', 400);
    }

    // Delete category
    await this.prisma.toolCategory.delete({
      where: { id },
    });
  }

  /**
   * Check if a category is a descendant of another category
   */
  public async isDescendantOf(potentialDescendantId: string, ancestorId: string): Promise<boolean> {
    // Get the potential descendant
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: potentialDescendantId },
    });

    if (!category) {
      return false;
    }

    // If the category has no parent, it can't be a descendant
    if (!category.parentId) {
      return false;
    }

    // If the parent is the ancestor, the category is a direct descendant
    if (category.parentId === ancestorId) {
      return true;
    }

    // Check if the parent is a descendant of the ancestor
    return this.isDescendantOf(category.parentId, ancestorId);
  }
}
