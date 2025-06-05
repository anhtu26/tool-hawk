import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/appError';

export class VendorRelationshipService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
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
      where: { primaryVendorId: vendorId },
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
        // totalAmount: true, // This needs to be calculated
        shippingCost: true, // Include for potential calculation
        taxAmount: true,    // Include for potential calculation
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
            // attachments: true, // Cannot be counted directly due to nullable FK on DocumentAttachment
          },
        },
      },
    });
  }
}
