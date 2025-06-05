# 3.2 Tool Category Management

## Category Definition

The Tool Category Management system forms the foundation of the CNC Machine Shop Tool Library, enabling the organization to create a structured yet flexible framework for categorizing the diverse range of tooling used in CNC machining operations. Tool categories represent logical groupings of similar tools that share common attributes and characteristics beyond the standard fields that apply to all tools.

In a CNC machine shop environment, tools are naturally organized into distinct categories such as Endmills, Drills, Taps, Inserts, Boring Bars, Reamers, and many others. Each of these categories has its own set of specialized attributes that are critical for proper tool selection and usage. For example, endmills require information about diameter, flute length, number of flutes, and coating type, while taps need details about thread size, thread type, and pitch.

The system allows administrators and managers to define these categories in a way that reflects the specific needs and terminology of their organization. Each category is defined with the following properties:

- **Name**: A descriptive name for the category (e.g., "Endmill", "Drill", "Tap")
- **Code**: A short alphanumeric code used as a prefix for tool numbers (e.g., "EM" for Endmills)
- **Description**: An optional detailed description of the category and its typical applications
- **Attributes**: A collection of custom fields that apply specifically to tools within this category

Categories serve multiple purposes within the system:
1. They provide a logical organization structure for the tool library, making it easier for users to browse and locate tools.
2. They determine which specialized attributes are collected and displayed for each tool.
3. They influence the search and filtering capabilities, allowing users to filter tools based on category-specific attributes.
4. They may be used to apply visual differentiation in the user interface, such as category-specific colors or icons.

The category definition process is designed to be flexible enough to accommodate the wide variety of tooling used in CNC machining while maintaining a structured data model that supports effective data management and retrieval.

## Custom Attribute System

The Custom Attribute System is a key differentiating feature of the CNC Machine Shop Tool Library, providing the flexibility needed to manage diverse tooling types while maintaining a structured, queryable data model. This system allows each tool category to have its own set of specialized attributes beyond the standard fields that apply to all tools.

The custom attribute system is designed around several core principles:

1. **Flexibility**: Different tool categories require different sets of attributes. The system must accommodate this diversity without requiring database schema changes for each new attribute.

2. **Structure**: Despite the flexibility, the system must maintain a structured approach to data storage and retrieval, avoiding the pitfalls of completely free-form data.

3. **Queryability**: Custom attributes must be fully searchable and filterable, allowing users to find tools based on specific attribute values or ranges.

4. **Validation**: The system must enforce appropriate data types and validation rules for each attribute to maintain data integrity.

Each custom attribute is defined with the following properties:

- **Name**: A human-readable label for the attribute (e.g., "Diameter", "Flute Length")
- **Key**: A machine-readable identifier used in the database (e.g., "diameter", "flute_length")
- **Type**: The data type of the attribute (e.g., "number", "string", "boolean", "date")
- **Unit**: An optional unit of measurement for numeric attributes (e.g., "in", "mm", "degrees")
- **Required**: A boolean flag indicating whether the attribute is mandatory for tools in this category
- **Default Value**: An optional default value for the attribute
- **Validation Rules**: Optional constraints such as minimum/maximum values or pattern matching

The system supports several attribute types to accommodate different kinds of data:

1. **Number**: For numeric values such as dimensions, speeds, or feeds. These can be filtered using range queries (e.g., diameter between 0.125" and 0.5").

2. **String**: For text values such as coatings, materials, or other descriptive properties. These can be filtered using exact match or contains queries.

3. **Boolean**: For yes/no properties such as "Through Coolant" or "Left-Hand Cut".

4. **Enum**: For properties with a fixed set of possible values, such as "Helix Direction" (right, left, variable) or "Tolerance Class" (H7, H8, etc.).

5. **Date**: For tracking date-related information such as first use date or recertification date.

The custom attribute system enables the application to adapt to the specific needs of each organization without requiring custom development or database modifications. Administrators and managers can define the attributes that matter most for their specific tooling inventory, ensuring that the system captures all relevant information while maintaining usability and performance.

## Database Schema

The database schema for the Tool Category Management system is designed to support the flexible, attribute-driven approach while maintaining the benefits of a relational database structure. The schema employs a hybrid model that combines traditional relational tables with PostgreSQL's powerful JSONB data type for storing dynamic attributes.

### Tool Categories Table

The `tool_categories` table serves as the primary table for storing category definitions:

```sql
CREATE TABLE tool_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_category_name UNIQUE (name),
    CONSTRAINT unique_category_code UNIQUE (code)
);
```

This table stores the basic information about each category, including its name, code, and description. The unique constraints ensure that category names and codes remain distinct across the system.

### Category Attributes Table

The `category_attributes` table defines the custom attributes associated with each category:

```sql
CREATE TABLE category_attributes (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES tool_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'enum', 'date')),
    unit VARCHAR(20),
    is_required BOOLEAN DEFAULT false,
    default_value JSONB,
    validation_rules JSONB,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_attribute_key_per_category UNIQUE (category_id, key)
);
```

This table establishes the relationship between categories and their attributes. Each row represents a single attribute definition for a specific category. The `key` field provides a machine-readable identifier for the attribute, while the `name` field provides a human-readable label. The `type` field determines what kind of data the attribute will store, and the `validation_rules` field can contain JSON-encoded validation constraints.

The `display_order` field allows administrators to control the sequence in which attributes are displayed in forms and detail views. The unique constraint ensures that attribute keys are unique within each category.

### Tools Table

The `tools` table stores the actual tool records, including both fixed fields and dynamic attributes:

```sql
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    tool_number VARCHAR(50) NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    tool_description TEXT,
    category_id INTEGER NOT NULL REFERENCES tool_categories(id),
    brand VARCHAR(100),
    approved_vendor VARCHAR(100),
    lead_time INTEGER,
    cost DECIMAL(10, 2),
    location VARCHAR(100),
    max_quantity INTEGER NOT NULL DEFAULT 0,
    safe_quantity INTEGER NOT NULL DEFAULT 0,
    current_quantity INTEGER NOT NULL DEFAULT 0,
    custom_attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tool_number UNIQUE (tool_number)
);

CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_custom_attributes ON tools USING GIN (custom_attributes);
```

This table combines fixed columns for standard tool properties with a JSONB column (`custom_attributes`) for storing category-specific attributes. The GIN index on the `custom_attributes` column enables efficient querying of the JSON data.

### Database Considerations

This hybrid approach offers several advantages:

1. **Performance**: Fixed fields that are common to all tools and frequently queried are stored as regular columns, providing optimal query performance.

2. **Flexibility**: Category-specific attributes are stored in the JSONB column, allowing for dynamic attribute sets without schema changes.

3. **Queryability**: PostgreSQL's JSONB operators and indexing capabilities enable efficient filtering and searching on custom attributes.

4. **Data Integrity**: Foreign key constraints maintain referential integrity between tools and their categories.

The schema avoids the Entity-Attribute-Value (EAV) pattern, which can lead to performance and maintenance challenges, while still providing the flexibility needed for diverse tool categories. The use of JSONB for custom attributes strikes a balance between flexibility and performance, leveraging PostgreSQL's advanced features for JSON data.

## Category CRUD Operations

The Tool Category Management system provides comprehensive Create, Read, Update, and Delete (CRUD) operations for managing tool categories and their associated attributes. These operations are available to users with Admin or Manager roles and are implemented through both the API and user interface.

### Creating Categories

The category creation process allows administrators and managers to define new tool categories with their associated attributes:

1. The user navigates to the Category Management section of the application and selects "Create New Category."

2. The user provides the basic category information:
   - Name: A descriptive name for the category (e.g., "Endmill")
   - Code: A short code used as a prefix for tool numbers (e.g., "EM")
   - Description: An optional detailed description of the category

3. The user then defines the custom attributes for the category using a dynamic form interface. For each attribute, the user specifies:
   - Name: The display name for the attribute (e.g., "Diameter")
   - Key: A machine-readable identifier (e.g., "diameter")
   - Type: The data type (string, number, boolean, enum, date)
   - Unit: An optional unit of measurement for numeric attributes
   - Required: Whether the attribute is mandatory
   - Default Value: An optional default value
   - Validation Rules: Optional constraints such as min/max values

4. The user can add, remove, or reorder attributes using intuitive controls in the interface.

5. Upon submission, the system validates the category information and attribute definitions, ensuring that:
   - The category name and code are unique
   - Attribute keys are valid (lowercase, no spaces, alphanumeric with underscores)
   - Attribute keys are unique within the category
   - Required fields are provided

6. If validation passes, the system creates the new category and its attributes in the database.

7. The new category becomes immediately available for use when creating or editing tools.

### Reading Categories

The system provides several ways to view and explore category information:

1. **Category List**: A comprehensive list of all categories, showing basic information such as name, code, and description. This list can be sorted and filtered.

2. **Category Detail**: A detailed view of a specific category, showing all its information and associated attributes. This view includes:
   - Basic category information (name, code, description)
   - A list of all attributes with their properties
   - Statistics about how many tools use this category
   - Creation and last update timestamps

3. **Category Selection**: When creating or editing tools, users select from available categories, which then determines the dynamic attributes shown in the form.

4. **Category Export**: The ability to export category definitions, including all attribute specifications, for documentation or backup purposes.

### Updating Categories

The category update process allows modifications to existing categories and their attributes:

1. The user navigates to the Category Management section and selects a category to edit.

2. The user can modify the basic category information (name, code, description).

3. The user can add new attributes, remove existing attributes, or modify attribute properties.

4. When modifying existing attributes, the system provides warnings about potential impacts:
   - Renaming an attribute's display name has no impact on existing data
   - Changing an attribute's key would disconnect it from existing data
   - Changing an attribute's type might cause data conversion issues
   - Making an attribute required could create validation issues for existing tools

5. The system enforces appropriate constraints during updates:
   - Category names and codes must remain unique
   - Attribute keys must remain unique within the category
   - Referenced categories cannot be deleted if tools are using them

6. Upon submission, the system validates the changes and updates the database accordingly.

7. For attribute changes that might impact existing tools, the system provides options for data migration or transformation.

### Deleting Categories

The category deletion process includes appropriate safeguards:

1. The user navigates to the Category Management section and selects a category to delete.

2. The system checks whether any tools are currently using this category:
   - If tools are using the category, the system prevents deletion and displays the count of affected tools
   - If no tools are using the category, the system allows deletion after confirmation

3. Upon confirmation, the system deletes the category and all its associated attributes from the database.

4. The deletion is logged in the system audit trail for accountability.

These CRUD operations provide administrators and managers with complete control over the category structure of the tool library, allowing them to adapt the system to their organization's specific needs while maintaining data integrity and usability.
