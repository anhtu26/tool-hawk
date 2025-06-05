import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

/**
 * Service for handling dynamic attributes for tools
 */
export class AttributesService {
  /**
   * Validate custom attributes against category attribute definitions
   * @param categoryId Category ID
   * @param attributes Custom attributes object
   * @returns Promise with validation result
   */
  static async validateAttributes(categoryId: string, attributes: Record<string, any>): Promise<{
    isValid: boolean;
    errors?: Record<string, string>;
  }> {
    try {
      // Get category attributes including parent categories
      const category = await prisma.toolCategory.findUnique({
        where: { id: categoryId },
        include: {
          attributes: true,
        },
      });

      if (!category) {
        return { isValid: false, errors: { _general: 'Category not found' } };
      }

      // Get parent category attributes if exists
      let parentAttributes: any[] = [];
      if (category.parentId) {
        const parentCategory = await prisma.toolCategory.findUnique({
          where: { id: category.parentId },
          include: {
            attributes: true,
          },
        });
        
        if (parentCategory) {
          parentAttributes = parentCategory.attributes;
        }
      }

      // Combine category and parent category attributes
      const allAttributes = [...category.attributes, ...parentAttributes];
      
      // Build validation schema dynamically
      const validationSchema: Record<string, any> = {};
      const errors: Record<string, string> = {};

      // Process each attribute definition
      for (const attr of allAttributes) {
        const { name, attributeType, isRequired, validationRules, options } = attr;
        
        // Skip if attribute is not required and not provided
        if (!isRequired && !(name in attributes)) {
          continue;
        }

        // Check if required attribute is missing
        if (isRequired && !(name in attributes)) {
          errors[name] = `${attr.label} is required`;
          continue;
        }

        // Validate based on attribute type
        const value = attributes[name];
        
        switch (attributeType) {
          case 'TEXT':
            if (typeof value !== 'string') {
              errors[name] = `${attr.label} must be text`;
            } else if (validationRules) {
              const rules = validationRules as { minLength?: number; maxLength?: number };
              if (rules.minLength && value.length < rules.minLength) {
                errors[name] = `${attr.label} must be at least ${rules.minLength} characters`;
              }
              if (rules.maxLength && value.length > rules.maxLength) {
                errors[name] = `${attr.label} must be at most ${rules.maxLength} characters`;
              }
            }
            break;
            
          case 'NUMBER':
            if (typeof value !== 'number') {
              errors[name] = `${attr.label} must be a number`;
            } else if (validationRules) {
              const rules = validationRules as { min?: number; max?: number; step?: number };
              if (rules.min !== undefined && value < rules.min) {
                errors[name] = `${attr.label} must be at least ${rules.min}`;
              }
              if (rules.max !== undefined && value > rules.max) {
                errors[name] = `${attr.label} must be at most ${rules.max}`;
              }
              if (rules.step && value % rules.step !== 0) {
                errors[name] = `${attr.label} must be a multiple of ${rules.step}`;
              }
            }
            break;
            
          case 'BOOLEAN':
            if (typeof value !== 'boolean') {
              errors[name] = `${attr.label} must be a boolean`;
            }
            break;
            
          case 'DATE':
            try {
              new Date(value).toISOString();
            } catch (e) {
              errors[name] = `${attr.label} must be a valid date`;
            }
            break;
            
          case 'SELECT_SINGLE':
            if (!options) {
              errors[name] = `No options defined for ${attr.label}`;
            } else {
              const optionValues = (options as any[]).map(opt => opt.value);
              if (!optionValues.includes(value)) {
                errors[name] = `${attr.label} must be one of: ${optionValues.join(', ')}`;
              }
            }
            break;
            
          case 'SELECT_MULTI':
            if (!options) {
              errors[name] = `No options defined for ${attr.label}`;
            } else if (!Array.isArray(value)) {
              errors[name] = `${attr.label} must be an array`;
            } else {
              const optionValues = (options as any[]).map(opt => opt.value);
              const invalidValues = value.filter(v => !optionValues.includes(v));
              if (invalidValues.length > 0) {
                errors[name] = `${attr.label} contains invalid values: ${invalidValues.join(', ')}`;
              }
            }
            break;
            
          // Other types can be added as needed
        }
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error('Error validating attributes:', error);
      return {
        isValid: false,
        errors: { _general: 'Failed to validate attributes' },
      };
    }
  }

  /**
   * Get attribute definitions for a category
   * @param categoryId Category ID
   * @returns Promise with attribute definitions
   */
  static async getCategoryAttributes(categoryId: string): Promise<any[]> {
    try {
      // Get category with attributes and attribute groups
      const category = await prisma.toolCategory.findUnique({
        where: { id: categoryId },
        include: {
          attributes: {
            include: {
              attributeGroup: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
          attributeGroups: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });

      if (!category) {
        return [];
      }

      // Get parent category attributes if exists
      let parentAttributes: any[] = [];
      if (category.parentId) {
        const parentCategory = await prisma.toolCategory.findUnique({
          where: { id: category.parentId },
          include: {
            attributes: {
              include: {
                attributeGroup: true,
              },
              orderBy: {
                sortOrder: 'asc',
              },
            },
            attributeGroups: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        });
        
        if (parentCategory) {
          parentAttributes = parentCategory.attributes;
        }
      }

      // Combine and organize attributes by group
      const allAttributes = [...category.attributes, ...parentAttributes];
      const attributesByGroup = new Map<string, any[]>();
      
      // Initialize with "No Group" for attributes without a group
      attributesByGroup.set('no_group', []);
      
      // Add all attribute groups
      category.attributeGroups.forEach((group: any) => {
        attributesByGroup.set(group.id, []);
      });
      
      // Assign attributes to groups
      allAttributes.forEach(attr => {
        const groupId = attr.attributeGroupId || 'no_group';
        const group = attributesByGroup.get(groupId) || [];
        group.push(attr);
        attributesByGroup.set(groupId, group);
      });
      
      // Format the result
      const result = [];
      
      // Add grouped attributes
      for (const group of category.attributeGroups) {
        const attributes = attributesByGroup.get(group.id) || [];
        if (attributes.length > 0) {
          result.push({
            group: {
              id: group.id,
              name: group.name,
              sortOrder: group.sortOrder,
            },
            attributes,
          });
        }
      }
      
      // Add ungrouped attributes
      const ungroupedAttributes = attributesByGroup.get('no_group') || [];
      if (ungroupedAttributes.length > 0) {
        result.push({
          group: {
            id: 'no_group',
            name: 'General',
            sortOrder: 999,
          },
          attributes: ungroupedAttributes,
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error getting category attributes:', error);
      return [];
    }
  }
}
