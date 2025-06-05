# 3.3 Tool Management

## Tool Data Structure

The Tool Management system is built around a comprehensive data structure that captures all relevant information about each tool in the CNC machine shop inventory. This data structure combines fixed fields that are common to all tools with dynamic, category-specific attributes to provide a complete representation of each tool's characteristics and status.

The core tool data structure consists of the following fixed fields that apply to all tools regardless of category:

- **Tool Number**: A unique identifier for the tool, typically following a shop-specific numbering convention, often including a category code prefix (e.g., "EM0123" for an endmill). This serves as the primary reference for the tool throughout the system and must be unique across the entire tool library.

- **Tool Name**: A descriptive name for the tool that identifies its general purpose and characteristics (e.g., "1/2" 4-Flute Carbide Endmill").

- **Tool Description**: An optional detailed description providing additional information about the tool's features, applications, or other relevant details.

- **Category**: The tool category to which this tool belongs (e.g., Endmill, Drill, Tap), which determines which custom attributes apply to this tool.

- **Brand**: The manufacturer or brand of the tool (e.g., Kennametal, Sandvik, OSG).

- **Approved Vendor**: The preferred or approved supplier for purchasing this tool.

- **Lead Time**: The typical time in days required to receive the tool after placing an order, used for procurement planning.

- **Cost**: The current purchase price of the tool, used for budgeting and value tracking.

- **Location**: The physical storage location of the tool within the shop (e.g., cabinet, drawer, or bin number).

- **Maximum Quantity**: The maximum inventory level to maintain for this tool, representing the upper limit for reordering.

- **Safe Quantity**: The minimum inventory level that should be maintained, below which reordering should be initiated. This threshold triggers low inventory alerts.

- **Current Quantity**: The number of units currently available in inventory, updated automatically through check-out and purchase operations.

- **Creation Date**: The date when the tool record was first created in the system.

- **Last Update Date**: The date when the tool record was last modified.

In addition to these fixed fields, each tool record includes a set of custom attributes specific to its category. These attributes are stored in a structured JSON format and might include:

- For Endmills: diameter, flute length, overall length, number of flutes, helix angle, coating, corner radius, etc.
- For Drills: diameter, drill point angle, overall length, flute length, coating, etc.
- For Taps: thread size, thread type, pitch, number of flutes, coating, etc.

The combination of fixed fields and category-specific attributes provides a complete representation of each tool, supporting both standardized inventory management functions and specialized tool selection based on machining requirements.

## Fixed vs. Dynamic Attributes

The CNC Machine Shop Tool Library implements a hybrid data model that balances the benefits of fixed, structured fields with the flexibility of dynamic, category-specific attributes. This approach is fundamental to the system's ability to accommodate diverse tooling types while maintaining efficient data management and retrieval.

### Fixed Attributes

Fixed attributes are implemented as standard columns in the tools table and apply universally to all tools regardless of category. These attributes have several important characteristics:

1. **Consistency**: Fixed attributes provide a consistent structure across all tool records, ensuring that essential inventory management data is always present and accessible.

2. **Performance**: As standard database columns, fixed attributes benefit from optimized storage, indexing, and query performance.

3. **Validation**: Fixed attributes have well-defined data types and validation rules enforced at the database level.

4. **Universality**: Fixed attributes represent properties that are relevant to all tools, such as identification, inventory levels, cost, and location.

The fixed attributes form the foundation of the tool management system, supporting core functionality such as inventory tracking, procurement, and basic tool identification. These attributes are directly accessible in SQL queries without the need for JSON operations, providing optimal performance for common operations.

### Dynamic Attributes

Dynamic attributes are implemented using PostgreSQL's JSONB data type and are specific to each tool category. This approach offers several advantages:

1. **Flexibility**: Each category can define its own set of attributes without requiring database schema changes. This allows the system to adapt to the specific needs of each organization and accommodate new tool types as they are introduced.

2. **Specialization**: Dynamic attributes capture the technical specifications that are unique to each tool category, such as the dimensional and geometric properties that distinguish different types of cutting tools.

3. **Extensibility**: New attributes can be added to a category at any time without affecting existing tool records or requiring database migrations.

4. **Structured Storage**: Unlike free-form text fields, the JSONB format maintains the structure and data types of attributes, supporting validation and typed queries.

The dynamic attributes are defined at the category level through the category_attributes table, which specifies the name, key, data type, and validation rules for each attribute. When a tool is created or updated, the system ensures that the provided dynamic attributes conform to the structure defined for the tool's category.

### Integration of Fixed and Dynamic Attributes

The system seamlessly integrates fixed and dynamic attributes throughout the user interface and API:

1. **Tool Forms**: When creating or editing a tool, the user interface presents a unified form that includes both fixed fields and category-specific attributes, with appropriate input controls based on data types.

2. **Tool Detail Views**: Tool detail pages display all attributes in a cohesive layout, with clear organization that helps users find the information they need.

3. **Search and Filtering**: The system supports searching and filtering across both fixed and dynamic attributes, with appropriate operators based on data types (e.g., range queries for numeric attributes, text search for string attributes).

4. **Data Export**: When exporting tool data, the system flattens the structure, presenting both fixed and dynamic attributes as columns in the exported file.

This hybrid approach strikes an optimal balance between structure and flexibility, providing a robust foundation for tool management while accommodating the diverse and specialized nature of CNC tooling.

## Tool CRUD Operations

The Tool Management system provides comprehensive Create, Read, Update, and Delete (CRUD) operations for managing tools in the library. These operations are implemented through both the API and user interface, with appropriate access controls based on user roles.

### Creating Tools

The tool creation process allows administrators and managers to add new tools to the library:

1. The user navigates to the Tool Management section of the application and selects "Add New Tool."

2. The user first selects the appropriate tool category from a dropdown list. This selection determines which dynamic attributes will be required for the tool.

3. The system presents a form with two sections:
   - Standard fields that apply to all tools (tool number, name, description, brand, etc.)
   - Category-specific attributes based on the selected category

4. The form dynamically adapts to the selected category, rendering appropriate input controls for each attribute based on its data type:
   - Text inputs for string attributes
   - Numeric inputs with appropriate step values and units for number attributes
   - Checkboxes for boolean attributes
   - Select dropdowns for enum attributes
   - Date pickers for date attributes

5. The system applies appropriate validation rules to both standard fields and dynamic attributes:
   - Required fields are marked and validated
   - Numeric ranges are enforced
   - Text patterns are validated
   - The tool number is checked for uniqueness

6. The user completes the form and submits it to create the new tool.

7. Upon submission, the system validates all inputs and, if valid, creates a new tool record in the database with both the standard fields and the JSON-encoded dynamic attributes.

8. The new tool is immediately available in the tool library for searching, viewing, and check-out operations.

### Reading Tools

The system provides several ways to view and explore tool information:

1. **Tool List**: A comprehensive list of all tools, showing key information such as tool number, name, category, and current quantity. This list can be sorted, filtered, and searched.

2. **Tool Detail**: A detailed view of a specific tool, showing all its information including both standard fields and category-specific attributes. This view is organized into sections:
   - Basic Information (tool number, name, description)
   - Inventory Information (current quantity, safe quantity, max quantity)
   - Procurement Information (cost, vendor, lead time)
   - Technical Specifications (category-specific attributes)
   - History Tabs (purchase history, part history)

3. **Tool Search**: A powerful search function that allows users to find tools based on various criteria, including tool number, name, category, and technical specifications.

4. **Tool Export**: The ability to export tool data in formats such as CSV or Excel for reporting and analysis.

### Updating Tools

The tool update process allows modifications to existing tool records:

1. The user navigates to the Tool Management section or finds a tool through search, then selects the tool to edit.

2. The system presents a form similar to the creation form, pre-populated with the tool's current values for both standard fields and dynamic attributes.

3. The user can modify any of the tool's properties, including:
   - Standard information (name, description, location, etc.)
   - Inventory levels (current quantity, safe quantity, max quantity)
   - Procurement details (cost, vendor, lead time)
   - Technical specifications (category-specific attributes)

4. The system applies the same validation rules as during creation, ensuring data integrity.

5. The user cannot change the tool's category after creation, as this would require a different set of dynamic attributes. If a category change is needed, the user must create a new tool and optionally retire the old one.

6. Upon submission, the system validates all inputs and, if valid, updates the tool record in the database.

7. The system records the update timestamp and, optionally, logs the changes for audit purposes.

### Deleting Tools

The tool deletion process includes appropriate safeguards:

1. The user navigates to the Tool Management section or finds a tool through search, then selects the tool to delete.

2. The system checks whether the tool has associated records:
   - Purchase history records
   - Part history records

3. If associated records exist, the system warns the user that deletion will remove these records as well.

4. The user must confirm the deletion, typically by entering the tool number as a verification step.

5. Upon confirmation, the system either:
   - Performs a hard delete, removing the tool and its associated records from the database, or
   - Performs a soft delete, marking the tool as inactive but preserving its data and history for reference

6. The deletion is logged in the system audit trail for accountability.

These CRUD operations provide administrators and managers with complete control over the tool library, allowing them to maintain an accurate and up-to-date inventory of all tools used in the shop.

## Tool Detail Page

The Tool Detail Page serves as the central hub for viewing and managing all information related to a specific tool. This page provides a comprehensive view of the tool's properties, inventory status, and history, while also offering access to key actions such as editing, checking out, and generating reports.

### Page Layout

The Tool Detail Page is organized into a clear, logical structure that makes information easy to find and understand:

1. **Header Section**: At the top of the page, the header displays the tool's identifying information:
   - Tool number prominently displayed
   - Tool name and brief description
   - Category with a visual indicator (color or icon)
   - Current inventory status with visual cues (green for adequate stock, yellow for low stock, red for out of stock)
   - Quick action buttons for common operations (Edit, Check Out, Duplicate, Delete)

2. **Basic Information Panel**: This section displays the tool's fundamental properties:
   - Tool number and name
   - Full description
   - Category
   - Brand
   - Location in the shop
   - Visual representation (image if available)

3. **Inventory Panel**: This section focuses on inventory management:
   - Current quantity with visual indicator
   - Safe quantity (reorder threshold)
   - Maximum quantity
   - Visual gauge showing current level relative to safe and maximum quantities
   - Inventory history graph showing quantity changes over time

4. **Procurement Panel**: This section contains purchasing-related information:
   - Current cost
   - Approved vendor
   - Lead time
   - Last purchase date and price
   - Reorder button with quick access to purchasing workflow

5. **Technical Specifications Panel**: This section displays all category-specific attributes in a structured format:
   - Attributes organized by logical groups if applicable
   - Clear labels and values with appropriate units
   - Visual formatting appropriate to the data type (e.g., decimal precision for dimensions)

6. **History Tabs**: A tabbed interface provides access to the tool's historical records:
   - **Purchase History Tab**: Displays all purchase records for the tool, including date, vendor, quantity, cost, and links to attached documents
   - **Part History Tab**: Shows all usage records for the tool, including job number, part number, date, user, and quantity used

7. **Related Tools Section**: Optionally, this section shows other tools that are frequently used with this tool or alternative tools that could substitute for it.

### Interactive Features

The Tool Detail Page includes several interactive features to enhance usability:

1. **Check-Out Workflow**: A prominent "Check Out Tool" button initiates the check-out process:
   - Clicking the button opens a modal dialog
   - If this is the user's first check-out of the day, the dialog prompts for job number and part number
   - For subsequent check-outs, the system remembers the previously entered information
   - The user confirms the check-out, which decreases the inventory count and creates a part history record

2. **In-Place Editing**: Authorized users (admins and managers) can edit certain fields directly on the detail page without navigating to a separate edit form:
   - Clicking an edit icon next to a field makes it editable
   - Changes are validated and saved immediately
   - This feature is particularly useful for quick updates to inventory levels or location

3. **Document Viewer**: For purchase history records with attached documents, the page includes an integrated document viewer:
   - Clicking on a document thumbnail opens the viewer
   - The viewer supports common document formats (PDF, images)
   - Documents can be downloaded for offline viewing

4. **History Filtering**: The history tabs include filtering capabilities:
   - Purchase history can be filtered by date range, vendor, or cost range
   - Part history can be filtered by job number, part number, date range, or user

5. **Export Options**: The page offers contextual export options:
   - Export tool details as PDF or Excel
   - Export purchase history as Excel
   - Export part history as Excel
   - Export complete tool record with all history

### Responsive Design

While the application is primarily designed for desktop use in shop environments, the Tool Detail Page implements responsive design principles to ensure usability on various screen sizes:

1. On smaller screens, the layout adjusts to a vertical orientation with collapsible panels.
2. Touch targets are sized appropriately for both mouse and touch interaction.
3. Critical information and actions remain accessible regardless of screen size.

### Role-Based Display

The Tool Detail Page adapts its display based on the user's role:

1. **Administrators** see all information and have access to all actions, including editing, deletion, and history management.
2. **Managers** see all information and can edit tool details, but may have limited access to certain administrative actions.
3. **Users** see all information but cannot edit tool details. They can perform check-out operations and view history, but cannot modify or delete records.

The Tool Detail Page serves as a comprehensive information hub for each tool in the library, providing all stakeholders with the information they need while enforcing appropriate access controls based on user roles.
