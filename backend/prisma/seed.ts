import { PrismaClient } from '@prisma/client';

// Define UserRole enum to match the schema
enum UserRole {
  admin = 'admin',
  manager = 'manager',
  operator = 'operator'
}
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.auditLog.deleteMany();
  await prisma.toolUsageCache.deleteMany();
  await prisma.toolCheckout.deleteMany();
  await prisma.documentAttachment.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.categoryAttribute.deleteMany();
  await prisma.attributeGroup.deleteMany();
  await prisma.toolCategory.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash('Password123!', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@toolhawk.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.admin,
      preferences: {
        create: {
          preferences: {
            theme: 'dark',
            notifications_enabled: true,
            dashboard_layout: {
              widgets: ['recent_tools', 'low_stock', 'checkouts']
            }
          }
        }
      }
    }
  });

  const managerUser = await prisma.user.create({
    data: {
      username: 'manager',
      email: 'manager@toolhawk.com',
      passwordHash,
      firstName: 'Manager',
      lastName: 'User',
      role: UserRole.manager,
      preferences: {
        create: {
          preferences: {
            theme: 'light',
            notifications_enabled: true,
            dashboard_layout: {
              widgets: ['recent_tools', 'checkouts']
            }
          }
        }
      }
    }
  });

  const operatorUser = await prisma.user.create({
    data: {
      username: 'operator',
      email: 'operator@toolhawk.com',
      passwordHash,
      firstName: 'Operator',
      lastName: 'User',
      role: UserRole.operator,
      preferences: {
        create: {
          preferences: {
            theme: 'system',
            notifications_enabled: false,
            dashboard_layout: {
              widgets: ['checkouts']
            }
          }
        }
      }
    }
  });

  // Create tool categories
  const cuttingToolsCategory = await prisma.toolCategory.create({
    data: {
      name: 'Cutting Tools',
      description: 'Tools used for cutting operations',
      attributeGroups: {
        create: [
          {
            name: 'Physical Properties',
            sortOrder: 1
          },
          {
            name: 'Performance Metrics',
            sortOrder: 2
          }
        ]
      }
    }
  });

  // Get the created attribute groups
  const attributeGroups = await prisma.attributeGroup.findMany({
    where: {
      categoryId: cuttingToolsCategory.id
    }
  });

  // Create category attributes
  await prisma.categoryAttribute.createMany({
    data: [
      {
        categoryId: cuttingToolsCategory.id,
        attributeGroupId: attributeGroups[0].id, // Physical Properties
        name: 'diameter',
        label: 'Diameter',
        attributeType: 'NUMBER',
        isRequired: true,
        defaultValue: null,
        validationRules: {
          min: 0.1,
          max: 100,
          step: 0.1
        },
        sortOrder: 1,
        tooltip: 'Diameter of the tool in mm',
        isFilterable: true,
        isSearchable: true
      },
      {
        categoryId: cuttingToolsCategory.id,
        attributeGroupId: attributeGroups[0].id, // Physical Properties
        name: 'length',
        label: 'Length',
        attributeType: 'NUMBER',
        isRequired: true,
        defaultValue: null,
        validationRules: {
          min: 1,
          max: 500,
          step: 0.1
        },
        sortOrder: 2,
        tooltip: 'Length of the tool in mm',
        isFilterable: true,
        isSearchable: true
      },
      {
        categoryId: cuttingToolsCategory.id,
        attributeGroupId: attributeGroups[1].id, // Performance Metrics
        name: 'material',
        label: 'Material',
        attributeType: 'SELECT_SINGLE',
        isRequired: true,
        defaultValue: null,
        options: [
          { value: 'hss', label: 'High Speed Steel' },
          { value: 'carbide', label: 'Carbide' },
          { value: 'diamond', label: 'Diamond' },
          { value: 'ceramic', label: 'Ceramic' }
        ],
        sortOrder: 1,
        tooltip: 'Material of the cutting tool',
        isFilterable: true,
        isSearchable: true
      },
      {
        categoryId: cuttingToolsCategory.id,
        attributeGroupId: attributeGroups[1].id, // Performance Metrics
        name: 'coating',
        label: 'Coating',
        attributeType: 'SELECT_MULTI',
        isRequired: false,
        defaultValue: null,
        options: [
          { value: 'tin', label: 'Titanium Nitride (TiN)' },
          { value: 'ticn', label: 'Titanium Carbonitride (TiCN)' },
          { value: 'tialn', label: 'Titanium Aluminum Nitride (TiAlN)' },
          { value: 'none', label: 'None' }
        ],
        sortOrder: 2,
        tooltip: 'Coating applied to the tool',
        isFilterable: true,
        isSearchable: true
      }
    ]
  });

  // Create subcategory
  const endMillsCategory = await prisma.toolCategory.create({
    data: {
      name: 'End Mills',
      description: 'Cutting tools used for milling operations',
      parentId: cuttingToolsCategory.id
    }
  });

  // Create vendors
  const vendors = await prisma.vendor.createMany({
    data: [
      {
        name: 'Kennametal',
        contactPerson: 'John Smith',
        email: 'john.smith@kennametal.com',
        phone: '555-123-4567',
        website: 'https://www.kennametal.com',
        notes: 'Preferred vendor for carbide tools'
      },
      {
        name: 'Sandvik Coromant',
        contactPerson: 'Jane Doe',
        email: 'jane.doe@sandvik.com',
        phone: '555-987-6543',
        website: 'https://www.sandvik.coromant.com',
        notes: 'High-quality cutting tools'
      },
      {
        name: 'Mitsubishi Materials',
        contactPerson: 'Robert Johnson',
        email: 'robert.johnson@mitsubishimaterials.com',
        phone: '555-456-7890',
        website: 'https://www.mitsubishicarbide.com',
        notes: 'Reliable delivery times'
      }
    ]
  });

  // Get vendors for reference
  const vendorsList = await prisma.vendor.findMany();

  // Create tools
  await prisma.tool.createMany({
    data: [
      {
        toolNumber: 'EM-001',
        name: '1/4" 4-Flute Carbide End Mill',
        description: 'General purpose end mill for aluminum and steel',
        categoryId: endMillsCategory.id,
        customAttributes: {
          diameter: 6.35, // 1/4" in mm
          length: 50,
          material: 'carbide',
          coating: ['tin']
        },
        currentQuantity: 15,
        safeQuantity: 5,
        maxQuantity: 25,
        unitOfMeasure: 'pcs',
        costPerUnit: 24.99,
        primaryVendorId: vendorsList[0].id, // Kennametal
        locationInShop: 'Cabinet A, Drawer 2',
        status: 'ACTIVE',
        createdByUserId: adminUser.id,
        updatedByUserId: adminUser.id
      },
      {
        toolNumber: 'EM-002',
        name: '1/2" 2-Flute Carbide End Mill',
        description: 'Heavy duty end mill for roughing operations',
        categoryId: endMillsCategory.id,
        customAttributes: {
          diameter: 12.7, // 1/2" in mm
          length: 75,
          material: 'carbide',
          coating: ['tialn']
        },
        currentQuantity: 8,
        safeQuantity: 3,
        maxQuantity: 15,
        unitOfMeasure: 'pcs',
        costPerUnit: 42.50,
        primaryVendorId: vendorsList[1].id, // Sandvik
        locationInShop: 'Cabinet A, Drawer 3',
        status: 'ACTIVE',
        createdByUserId: adminUser.id,
        updatedByUserId: adminUser.id
      },
      {
        toolNumber: 'EM-003',
        name: '3/8" 3-Flute HSS End Mill',
        description: 'Economic option for non-critical applications',
        categoryId: endMillsCategory.id,
        customAttributes: {
          diameter: 9.525, // 3/8" in mm
          length: 63,
          material: 'hss',
          coating: ['none']
        },
        currentQuantity: 20,
        safeQuantity: 8,
        maxQuantity: 30,
        unitOfMeasure: 'pcs',
        costPerUnit: 12.75,
        primaryVendorId: vendorsList[2].id, // Mitsubishi
        locationInShop: 'Cabinet B, Drawer 1',
        status: 'ACTIVE',
        createdByUserId: managerUser.id,
        updatedByUserId: adminUser.id
      }
    ]
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
