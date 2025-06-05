import { PrismaClient, VendorContact } from '@prisma/client';
import { AppError } from '../../utils/appError';

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

export class VendorContactService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
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
