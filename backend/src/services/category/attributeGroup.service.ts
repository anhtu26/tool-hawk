import { PrismaClient, AttributeGroup } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { AttributeGroupCreateInput, AttributeGroupUpdateInput } from './types';
import { CategoryBaseService } from './categoryBase.service';

/**
 * Service for managing attribute groups
 */
export class AttributeGroupService extends CategoryBaseService {
  /**
   * Get attribute groups for a category
   */
  public async getAttributeGroupsByCategoryId(categoryId: string): Promise<AttributeGroup[]> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return this.prisma.attributeGroup.findMany({
      where: { categoryId },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  /**
   * Get attribute group by ID
   */
  public async getAttributeGroupById(id: string): Promise<AttributeGroup | null> {
    return this.prisma.attributeGroup.findUnique({
      where: { id },
      include: {
        category: true,
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  /**
   * Create attribute group
   */
  public async createAttributeGroup(
    categoryId: string,
    data: AttributeGroupCreateInput
  ): Promise<AttributeGroup> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check for duplicate name
    const existingGroup = await this.prisma.attributeGroup.findFirst({
      where: {
        categoryId,
        name: data.name,
      },
    });

    if (existingGroup) {
      throw new AppError('Attribute group with this name already exists', 409);
    }

    // Get highest sort order
    const highestSortOrder = await this.prisma.attributeGroup.findFirst({
      where: { categoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const nextSortOrder = highestSortOrder ? (highestSortOrder.sortOrder || 0) + 1 : 0;

    // Create attribute group
    return this.prisma.attributeGroup.create({
      data: {
        ...data,
        categoryId,
        sortOrder: data.sortOrder ?? nextSortOrder,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Update attribute group
   */
  public async updateAttributeGroup(
    id: string,
    data: AttributeGroupUpdateInput
  ): Promise<AttributeGroup> {
    // Check if attribute group exists
    const attributeGroup = await this.prisma.attributeGroup.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!attributeGroup) {
      throw new AppError('Attribute group not found', 404);
    }

    // Check for duplicate name
    if (data.name) {
      const existingGroup = await this.prisma.attributeGroup.findFirst({
        where: {
          categoryId: attributeGroup.categoryId,
          name: data.name,
          id: { not: id },
        },
      });

      if (existingGroup) {
        throw new AppError('Attribute group with this name already exists', 409);
      }
    }

    // Update attribute group
    return this.prisma.attributeGroup.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  /**
   * Delete attribute group
   */
  public async deleteAttributeGroup(id: string): Promise<void> {
    // Check if attribute group exists
    const attributeGroup = await this.prisma.attributeGroup.findUnique({
      where: { id },
      include: {
        attributes: true,
      },
    });

    if (!attributeGroup) {
      throw new AppError('Attribute group not found', 404);
    }

    // Check if attribute group has attributes
    if (attributeGroup.attributes.length > 0) {
      throw new AppError('Cannot delete attribute group with associated attributes', 400);
    }

    // Delete attribute group
    await this.prisma.attributeGroup.delete({
      where: { id },
    });
  }
}
