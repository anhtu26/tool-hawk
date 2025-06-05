import { PrismaClient, Vendor } from '@prisma/client';
import { AppError } from '../../utils/appError';

export interface VendorCreateInput {
  name: string;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | null;
  notes?: string | null;
  accountNumber?: string | null;
  paymentTerms?: string | null;
  isActive?: boolean;
}

export interface VendorUpdateInput {
  name?: string;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | null;
  notes?: string | null;
  accountNumber?: string | null;
  paymentTerms?: string | null;
  isActive?: boolean;
}

export class VendorBaseService {
  protected prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Get all vendors
   */
  public async getAllVendors(): Promise<Vendor[]> {
    return this.prisma.vendor.findMany({
      include: {
        _count: {
          select: {
            contacts: true,
            tools: true,
            purchaseOrders: true,
          },
        },
      },
    });
  }

  /**
   * Get vendor by ID
   */
  public async getVendorById(id: string): Promise<Vendor | null> {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: {
        contacts: true,
        _count: {
          select: {
            tools: true,
            purchaseOrders: true,
          },
        },
      },
    });
  }

  /**
   * Create a new vendor
   */
  public async createVendor(vendorData: VendorCreateInput): Promise<Vendor> {
    // Check if vendor with same name already exists
    const existingVendor = await this.prisma.vendor.findFirst({
      where: {
        name: vendorData.name,
      },
    });

    if (existingVendor) {
      throw new AppError('Vendor with this name already exists', 409);
    }

    // Create vendor
    return this.prisma.vendor.create({
      data: {
        ...vendorData,
        address: vendorData.address ? JSON.stringify(vendorData.address) : null,
      },
    });
  }

  /**
   * Update vendor
   */
  public async updateVendor(id: string, vendorData: VendorUpdateInput): Promise<Vendor> {
    // Check if vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // Check if vendor name is unique if being updated
    if (vendorData.name && vendorData.name !== vendor.name) {
      const existingVendor = await this.prisma.vendor.findFirst({
        where: {
          name: vendorData.name,
          id: { not: id },
        },
      });

      if (existingVendor) {
        throw new AppError('Vendor with this name already exists', 409);
      }
    }

    // Update vendor
    return this.prisma.vendor.update({
      where: { id },
      data: {
        ...vendorData,
        address: vendorData.address ? JSON.stringify(vendorData.address) : undefined,
      },
    });
  }

  /**
   * Delete vendor
   */
  public async deleteVendor(id: string): Promise<void> {
    // Check if vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        tools: true,
        purchaseOrders: true,
      },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // Check if vendor has associated tools
    if (vendor.tools.length > 0) {
      throw new AppError('Cannot delete vendor with associated tools', 400);
    }

    // Check if vendor has associated purchase orders
    if (vendor.purchaseOrders.length > 0) {
      throw new AppError('Cannot delete vendor with associated purchase orders', 400);
    }

    // Delete all contacts first
    await this.prisma.vendorContact.deleteMany({
      where: {
        vendorId: id,
      },
    });

    // Delete vendor
    await this.prisma.vendor.delete({
      where: { id },
    });
  }
}
