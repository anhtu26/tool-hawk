import { PrismaClient, CategoryAttribute } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { CategoryAttributeCreateInput, CategoryAttributeUpdateInput } from './types';
import { CategoryBaseService } from './categoryBase.service';

/**
 * Service for managing category attributes
 */
export class AttributeService extends CategoryBaseService {
  /**
   * Get attributes for a category
   */
  public async getAttributesByCategoryId(categoryId: string): Promise<CategoryAttribute[]> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return this.prisma.categoryAttribute.findMany({
      where: { categoryId },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        attributeGroup: true,
      },
    });
  }

  /**
   * Get attribute by ID
   */
  public async getAttributeById(id: string): Promise<CategoryAttribute | null> {
    return this.prisma.categoryAttribute.findUnique({
      where: { id },
      include: {
        category: true,
        attributeGroup: true,
      },
    });
  }

  /**
   * Create attribute
   */
  public async createAttribute(
    categoryId: string,
    data: CategoryAttributeCreateInput
  ): Promise<CategoryAttribute> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if attribute group exists if provided
    if (data.attributeGroupId) {
      const attributeGroup = await this.prisma.attributeGroup.findUnique({
        where: { id: data.attributeGroupId },
      });

      if (!attributeGroup) {
        throw new AppError('Attribute group not found', 404);
      }

      // Check if attribute group belongs to the category
      if (attributeGroup.categoryId !== categoryId) {
        throw new AppError('Attribute group does not belong to this category', 400);
      }
    }

    // Check for duplicate name
    const existingAttribute = await this.prisma.categoryAttribute.findFirst({
      where: {
        categoryId,
        name: data.name,
      },
    });

    if (existingAttribute) {
      throw new AppError('Attribute with this name already exists', 409);
    }

    // Get highest sort order
    const highestSortOrder = await this.prisma.categoryAttribute.findFirst({
      where: { categoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const nextSortOrder = highestSortOrder ? (highestSortOrder.sortOrder || 0) + 1 : 0;

    // Create attribute
    return this.prisma.categoryAttribute.create({
      data: {
        ...data,
        categoryId,
        sortOrder: data.sortOrder ?? nextSortOrder,
      },
      include: {
        category: true,
        attributeGroup: true,
      },
    });
  }

  /**
   * Update attribute
   */
  public async updateAttribute(
    id: string,
    data: CategoryAttributeUpdateInput
  ): Promise<CategoryAttribute> {
    // Check if attribute exists
    const attribute = await this.prisma.categoryAttribute.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!attribute) {
      throw new AppError('Attribute not found', 404);
    }

    // Check if attribute group exists if provided
    if (data.attributeGroupId) {
      const attributeGroup = await this.prisma.attributeGroup.findUnique({
        where: { id: data.attributeGroupId },
      });

      if (!attributeGroup) {
        throw new AppError('Attribute group not found', 404);
      }

      // Check if attribute group belongs to the category
      if (attributeGroup.categoryId !== attribute.categoryId) {
        throw new AppError('Attribute group does not belong to this category', 400);
      }
    }

    // Update attribute
    return this.prisma.categoryAttribute.update({
      where: { id },
      data,
      include: {
        category: true,
        attributeGroup: true,
      },
    });
  }

  /**
   * Delete attribute
   */
  public async deleteAttribute(id: string): Promise<void> {
    // Check if attribute exists
    const attribute = await this.prisma.categoryAttribute.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new AppError('Attribute not found', 404);
    }

    // Check if attribute is being used in any tool
    // This would require custom implementation based on how tool attributes are stored

    // Delete attribute
    await this.prisma.categoryAttribute.delete({
      where: { id },
    });
  }
}
