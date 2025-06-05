import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category';
import { AppError } from '../utils/appError';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Get all categories
   */
  public getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.base.getAllCategories();
      
      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get category by ID
   */
  public getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.base.getCategoryById(id);
      
      if (!category) {
        throw new AppError('Category not found', 404);
      }
      
      return res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new category
   */
  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData = req.body;
      const newCategory = await this.categoryService.base.createCategory(categoryData);
      
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: newCategory
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update category
   */
  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const updatedCategory = await this.categoryService.base.updateCategory(id, categoryData);
      
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete category
   */
  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.categoryService.base.deleteCategory(id);
      
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get category attributes
   */
  public getCategoryAttributes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const attributes = await this.categoryService.attribute.getAttributesByCategoryId(id);
      
      return res.status(200).json({
        success: true,
        message: 'Category attributes retrieved successfully',
        data: attributes
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get tools in category
   */
  /*
  public getCategoryTools = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
            // const tools = await this.categoryService.base.getCategoryTools(id); // Method missing in service
      
      return res.status(200).json({
        success: true,
        message: 'Category tools retrieved successfully',
        data: [] // Placeholder for tools
      });
    } catch (error) {
      next(error);
    }
  }; 
  */

  /**
   * Create attribute group
   */
  public createAttributeGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const groupData = req.body;
      const newGroup = await this.categoryService.attributeGroup.createAttributeGroup(id, groupData);
      
      return res.status(201).json({
        success: true,
        message: 'Attribute group created successfully',
        data: newGroup
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update attribute group
   */
  public updateAttributeGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, groupId } = req.params;
      const groupData = req.body;
      const updatedGroup = await this.categoryService.attributeGroup.updateAttributeGroup(groupId, groupData);
      
      return res.status(200).json({
        success: true,
        message: 'Attribute group updated successfully',
        data: updatedGroup
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete attribute group
   */
  public deleteAttributeGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, groupId } = req.params;
      await this.categoryService.attributeGroup.deleteAttributeGroup(groupId);
      
      return res.status(200).json({
        success: true,
        message: 'Attribute group deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create category attribute
   */
  public createAttribute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, groupId } = req.params;
      const attributeData = req.body;
      const newAttribute = await this.categoryService.attribute.createAttribute(id, attributeData);
      
      return res.status(201).json({
        success: true,
        message: 'Category attribute created successfully',
        data: newAttribute
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update category attribute
   */
  public updateAttribute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, groupId, attributeId } = req.params;
      const attributeData = req.body;
      const updatedAttribute = await this.categoryService.attribute.updateAttribute(attributeId, attributeData);
      
      return res.status(200).json({
        success: true,
        message: 'Category attribute updated successfully',
        data: updatedAttribute
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete category attribute
   */
  public deleteAttribute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, groupId, attributeId } = req.params;
      await this.categoryService.attribute.deleteAttribute(attributeId);
      
      return res.status(200).json({
        success: true,
        message: 'Category attribute deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
