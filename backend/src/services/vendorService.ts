import { PrismaClient, Vendor, VendorContact } from '@prisma/client';
import { AppError } from '../utils/appError';

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

export interface ContactCreateInput {
  firstName: string;
  lastName: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
}

export interface ContactUpdateInput {
  firstName?: string;
  lastName?: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
}

export class VendorService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
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

  /**
   * Get tools from a vendor
   */
  public async getVendorTools(vendorId: string): Promise<any[]> {
    // Check if vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // Get tools
    return this.prisma.tool.findMany({
      where: { vendorId },
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
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get purchase orders from a vendor
   */
  public async getVendorPurchaseOrders(vendorId: string): Promise<any[]> {
    // Check if vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // Get purchase orders
    return this.prisma.purchaseOrder.findMany({
      where: { vendorId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        orderDate: true,
        expectedDeliveryDate: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            items: true,
            attachments: true,
          },
        },
      },
    });
  }

  /**
   * Create a new contact for a vendor
   */
  public async createContact(vendorId: string, contactData: ContactCreateInput): Promise<VendorContact> {
    // Check if vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // If this contact is primary, update any existing primary contacts
    if (contactData.isPrimary) {
      await this.prisma.vendorContact.updateMany({
        where: {
          vendorId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create contact
    return this.prisma.vendorContact.create({
      data: {
        ...contactData,
        vendorId,
      },
    });
  }

  /**
   * Update a contact for a vendor
   */
  public async updateContact(
    vendorId: string,
    contactId: string,
    contactData: ContactUpdateInput
  ): Promise<VendorContact> {
    // Check if vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // Check if contact exists
    const contact = await this.prisma.vendorContact.findFirst({
      where: {
        id: contactId,
        vendorId,
      },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    // If this contact is being set as primary, update any existing primary contacts
    if (contactData.isPrimary) {
      await this.prisma.vendorContact.updateMany({
        where: {
          vendorId,
          isPrimary: true,
          id: { not: contactId },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Update contact
    return this.prisma.vendorContact.update({
      where: { id: contactId },
      data: contactData,
    });
  }

  /**
   * Delete a contact from a vendor
   */
  public async deleteContact(vendorId: string, contactId: string): Promise<void> {
    // Check if vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // Check if contact exists
    const contact = await this.prisma.vendorContact.findFirst({
      where: {
        id: contactId,
        vendorId,
      },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    // Delete contact
    await this.prisma.vendorContact.delete({
      where: { id: contactId },
    });
  }
}
