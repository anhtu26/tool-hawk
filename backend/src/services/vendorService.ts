import { PrismaClient, Vendor } from '@prisma/client';
import { VendorBaseService, VendorCreateInput, VendorUpdateInput } from './vendor/vendorBaseService';

import { VendorRelationshipService } from './vendor/vendorRelationshipService';

/**
 * Main vendor service that combines all vendor-related functionality
 */
export class VendorService {
  private baseService: VendorBaseService;
  private relationshipService: VendorRelationshipService;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.baseService = new VendorBaseService(this.prisma);
    this.relationshipService = new VendorRelationshipService(this.prisma);
  }

  // Base vendor operations
  public async getAllVendors(): Promise<Vendor[]> {
    return this.baseService.getAllVendors();
  }

  public async getVendorById(id: string): Promise<Vendor | null> {
    return this.baseService.getVendorById(id);
  }

  public async createVendor(vendorData: VendorCreateInput): Promise<Vendor> {
    return this.baseService.createVendor(vendorData);
  }

  public async updateVendor(id: string, vendorData: VendorUpdateInput): Promise<Vendor> {
    return this.baseService.updateVendor(id, vendorData);
  }

  public async deleteVendor(id: string): Promise<void> {
    return this.baseService.deleteVendor(id);
  }

  // Vendor relationship operations
  public async getVendorTools(vendorId: string): Promise<any[]> {
    return this.relationshipService.getVendorTools(vendorId);
  }

  public async getVendorPurchaseOrders(vendorId: string): Promise<any[]> {
    return this.relationshipService.getVendorPurchaseOrders(vendorId);
  }
}

// Re-export types for external use
export { VendorCreateInput, VendorUpdateInput };
