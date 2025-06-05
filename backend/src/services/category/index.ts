import { CategoryBaseService } from './categoryBase.service';
import { AttributeGroupService } from './attributeGroup.service';
import { AttributeService } from './attribute.service';

/**
 * Combined Category Service that provides access to all category-related functionality
 */
export class CategoryService {
  public base: CategoryBaseService;
  public attributeGroup: AttributeGroupService;
  public attribute: AttributeService;

  constructor() {
    this.base = new CategoryBaseService();
    this.attributeGroup = new AttributeGroupService();
    this.attribute = new AttributeService();
  }

  // Re-export types
  static get CategoryCreateInput() {
    return require('./types').CategoryCreateInput;
  }

  static get CategoryUpdateInput() {
    return require('./types').CategoryUpdateInput;
  }

  static get AttributeGroupCreateInput() {
    return require('./types').AttributeGroupCreateInput;
  }

  static get AttributeGroupUpdateInput() {
    return require('./types').AttributeGroupUpdateInput;
  }

  static get CategoryAttributeCreateInput() {
    return require('./types').CategoryAttributeCreateInput;
  }

  static get CategoryAttributeUpdateInput() {
    return require('./types').CategoryAttributeUpdateInput;
  }
}

// Export individual services and types for direct imports
export * from './types';
export { CategoryBaseService } from './categoryBase.service';
export { AttributeGroupService } from './attributeGroup.service';
export { AttributeService } from './attribute.service';
