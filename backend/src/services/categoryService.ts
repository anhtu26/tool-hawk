import { PrismaClient, ToolCategory, AttributeGroup, CategoryAttribute } from '@prisma/client';
import { AppError } from '../utils/appError';

export interface CategoryCreateInput {
  name: string;
  description?: string;
  parentId?: string | null;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string | null;
  parentId?: string | null;
}

export interface AttributeGroupCreateInput {
  name: string;
  sortOrder?: number;
}

export interface AttributeGroupUpdateInput {
  name?: string;
  sortOrder?: number;
}

export interface CategoryAttributeCreateInput {
  name: string;
  label: string;
  attributeType: string;
  attributeGroupId?: string | null;
  isRequired?: boolean;
  defaultValue?: string | null;
  options?: any;
  validationRules?: any;
  sortOrder?: number;
  tooltip?: string | null;
  isFilterable?: boolean;
  isSearchable?: boolean;
}

export interface CategoryAttributeUpdateInput {
  label?: string;
  attributeType?: string;
  attributeGroupId?: string | null;
  isRequired?: boolean;
  defaultValue?: string | null;
  options?: any;
  validationRules?: any;
  sortOrder?: number;
  tooltip?: string | null;
  isFilterable?: boolean;
  isSearchable?: boolean;
}

export class CategoryService {
  private prisma: PrismaClient;

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
   * Get category attributes
   */
  public async getCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Get attributes
    return this.prisma.categoryAttribute.findMany({
      where: { categoryId },
      include: {
        attributeGroup: true,
      },
      orderBy: [
        {
          attributeGroup: {
            sortOrder: 'asc',
          },
        },
        {
          sortOrder: 'asc',
        },
      ],
    });
  }

  /**
   * Get tools in category
   */
  public async getCategoryTools(categoryId: string): Promise<any[]> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Get tools
    return this.prisma.tool.findMany({
      where: { categoryId },
      select: {
        id: true,
        toolNumber: true,
        name: true,
        description: true,
        currentQuantity: true,
        safeQuantity: true,
        unitOfMeasure: true,
        status: true,
        imageUrl: true,
        locationInShop: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Create attribute group
   */
  public async createAttributeGroup(
    categoryId: string,
    groupData: AttributeGroupCreateInput
  ): Promise<AttributeGroup> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if group name is unique within the category
    const existingGroup = await this.prisma.attributeGroup.findFirst({
      where: {
        categoryId,
        name: groupData.name,
      },
    });

    if (existingGroup) {
      throw new AppError('Attribute group name already exists in this category', 409);
    }

    // Create attribute group
    return this.prisma.attributeGroup.create({
      data: {
        ...groupData,
        categoryId,
      },
    });
  }

  /**
   * Update attribute group
   */
  public async updateAttributeGroup(
    categoryId: string,
    groupId: string,
    groupData: AttributeGroupUpdateInput
  ): Promise<AttributeGroup> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if attribute group exists
    const attributeGroup = await this.prisma.attributeGroup.findFirst({
      where: {
        id: groupId,
        categoryId,
      },
    });

    if (!attributeGroup) {
      throw new AppError('Attribute group not found', 404);
    }

    // Check if group name is unique within the category
    if (groupData.name) {
      const existingGroup = await this.prisma.attributeGroup.findFirst({
        where: {
          categoryId,
          name: groupData.name,
          id: { not: groupId },
        },
      });

      if (existingGroup) {
        throw new AppError('Attribute group name already exists in this category', 409);
      }
    }

    // Update attribute group
    return this.prisma.attributeGroup.update({
      where: { id: groupId },
      data: groupData,
    });
  }

  /**
   * Delete attribute group
   */
  public async deleteAttributeGroup(categoryId: string, groupId: string): Promise<void> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if attribute group exists
    const attributeGroup = await this.prisma.attributeGroup.findFirst({
      where: {
        id: groupId,
        categoryId,
      },
      include: {
        attributes: true,
      },
    });

    if (!attributeGroup) {
      throw new AppError('Attribute group not found', 404);
    }

    // Check if group has attributes
    if (attributeGroup.attributes.length > 0) {
      // Update attributes to remove group association
      await this.prisma.categoryAttribute.updateMany({
        where: {
          attributeGroupId: groupId,
        },
        data: {
          attributeGroupId: null,
        },
      });
    }

    // Delete attribute group
    await this.prisma.attributeGroup.delete({
      where: { id: groupId },
    });
  }

  /**
   * Create category attribute
   */
  public async createAttribute(
    categoryId: string,
    attributeData: CategoryAttributeCreateInput
  ): Promise<CategoryAttribute> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if attribute group exists if provided
    if (attributeData.attributeGroupId) {
      const attributeGroup = await this.prisma.attributeGroup.findFirst({
        where: {
          id: attributeData.attributeGroupId,
          categoryId,
        },
      });

      if (!attributeGroup) {
        throw new AppError('Attribute group not found', 404);
      }
    }

    // Check if attribute name is unique within the category
    const existingAttribute = await this.prisma.categoryAttribute.findFirst({
      where: {
        categoryId,
        name: attributeData.name,
      },
    });

    if (existingAttribute) {
      throw new AppError('Attribute name already exists in this category', 409);
    }

    // Validate options for select types
    if (
      (attributeData.attributeType === 'SELECT_SINGLE' || attributeData.attributeType === 'SELECT_MULTI') &&
      (!attributeData.options || !Array.isArray(attributeData.options) || attributeData.options.length === 0)
    ) {
      throw new AppError('Options are required for select type attributes', 400);
    }

    // Create attribute
    return this.prisma.categoryAttribute.create({
      data: {
        ...attributeData,
        categoryId,
        options: attributeData.options ? JSON.stringify(attributeData.options) : null,
        validationRules: attributeData.validationRules ? JSON.stringify(attributeData.validationRules) : null,
      },
      include: {
        attributeGroup: true,
      },
    });
  }

  /**
   * Update category attribute
   */
  public async updateAttribute(
    categoryId: string,
    attributeId: string,
    attributeData: CategoryAttributeUpdateInput
  ): Promise<CategoryAttribute> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if attribute exists
    const attribute = await this.prisma.categoryAttribute.findFirst({
      where: {
        id: attributeId,
        categoryId,
      },
    });

    if (!attribute) {
      throw new AppError('Attribute not found', 404);
    }

    // Check if attribute group exists if provided
    if (attributeData.attributeGroupId) {
      const attributeGroup = await this.prisma.attributeGroup.findFirst({
        where: {
          id: attributeData.attributeGroupId,
          categoryId,
        },
      });

      if (!attributeGroup) {
        throw new AppError('Attribute group not found', 404);
      }
    }

    // Validate options for select types
    const attributeType = attributeData.attributeType || attribute.attributeType;
    if (
      (attributeType === 'SELECT_SINGLE' || attributeType === 'SELECT_MULTI') &&
      attributeData.options !== undefined &&
      (!attributeData.options || !Array.isArray(attributeData.options) || attributeData.options.length === 0)
    ) {
      throw new AppError('Options are required for select type attributes', 400);
    }

    // Update attribute
    return this.prisma.categoryAttribute.update({
      where: { id: attributeId },
      data: {
        ...attributeData,
        options: attributeData.options ? JSON.stringify(attributeData.options) : undefined,
        validationRules: attributeData.validationRules ? JSON.stringify(attributeData.validationRules) : undefined,
      },
      include: {
        attributeGroup: true,
      },
    });
  }

  /**
   * Delete category attribute
   */
  public async deleteAttribute(categoryId: string, attributeId: string): Promise<void> {
    // Check if category exists
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if attribute exists
    const attribute = await this.prisma.categoryAttribute.findFirst({
      where: {
        id: attributeId,
        categoryId,
      },
    });

    if (!attribute) {
      throw new AppError('Attribute not found', 404);
    }

    // Delete attribute
    await this.prisma.categoryAttribute.delete({
      where: { id: attributeId },
    });
  }

  /**
   * Check if a category is a descendant of another category
   * Used to prevent circular references in the category hierarchy
   */
  private async isDescendantOf(categoryId: string, potentialAncestorId: string): Promise<boolean> {
    // Base case: if categories are the same, it's a circular reference
    if (categoryId === potentialAncestorId) {
      return true;
    }

    // Get the category
    const category = await this.prisma.toolCategory.findUnique({
      where: { id: categoryId },
      select: { parentId: true },
    });

    // If category doesn't exist or has no parent, it's not a descendant
    if (!category || !category.parentId) {
      return false;
    }

    // Recursively check if the parent is a descendant of the potential ancestor
    return this.isDescendantOf(category.parentId, potentialAncestorId);
  }
}
