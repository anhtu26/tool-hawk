import { Request, Response, NextFunction } from 'express';
import { VendorService } from '../services/vendorService';
import { AppError } from '../utils/appError';

export class VendorController {
  private vendorService: VendorService;

  constructor() {
    this.vendorService = new VendorService();
  }

  /**
   * Get all vendors
   */
  public getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendors = await this.vendorService.getAllVendors();
      
      return res.status(200).json({
        success: true,
        message: 'Vendors retrieved successfully',
        data: vendors
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get vendor by ID
   */
  public getVendorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const vendor = await this.vendorService.getVendorById(id);
      
      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }
      
      return res.status(200).json({
        success: true,
        message: 'Vendor retrieved successfully',
        data: vendor
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new vendor
   */
  public createVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendorData = req.body;
      const newVendor = await this.vendorService.createVendor(vendorData);
      
      return res.status(201).json({
        success: true,
        message: 'Vendor created successfully',
        data: newVendor
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update vendor
   */
  public updateVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const vendorData = req.body;
      const updatedVendor = await this.vendorService.updateVendor(id, vendorData);
      
      return res.status(200).json({
        success: true,
        message: 'Vendor updated successfully',
        data: updatedVendor
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete vendor
   */
  public deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.vendorService.deleteVendor(id);
      
      return res.status(200).json({
        success: true,
        message: 'Vendor deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get tools from a vendor
   */
  public getVendorTools = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tools = await this.vendorService.getVendorTools(id);
      
      return res.status(200).json({
        success: true,
        message: 'Vendor tools retrieved successfully',
        data: tools
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get purchase orders from a vendor
   */
  public getVendorPurchaseOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const purchaseOrders = await this.vendorService.getVendorPurchaseOrders(id);
      
      return res.status(200).json({
        success: true,
        message: 'Vendor purchase orders retrieved successfully',
        data: purchaseOrders
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new contact for a vendor
   */
  public createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const contactData = req.body;
      const newContact = await this.vendorService.createContact(id, contactData);
      
      return res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: newContact
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a contact for a vendor
   */
  public updateContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, contactId } = req.params;
      const contactData = req.body;
      const updatedContact = await this.vendorService.updateContact(id, contactId, contactData);
      
      return res.status(200).json({
        success: true,
        message: 'Contact updated successfully',
        data: updatedContact
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a contact from a vendor
   */
  public deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, contactId } = req.params;
      await this.vendorService.deleteContact(id, contactId);
      
      return res.status(200).json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
