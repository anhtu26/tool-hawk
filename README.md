# ToolHawk - CNC Machine Shop Tool Library

ToolHawk is a comprehensive web application for managing the complete lifecycle of tooling inventory within a CNC machine shop environment. This system replaces manual, paper-based processes with a streamlined digital solution that provides real-time visibility into tool inventory, usage patterns, purchase history, and maintenance requirements.

## Project Overview

The application serves as a centralized repository for all tool-related information, enabling:
- Efficient tool management with custom attributes by category
- Real-time inventory tracking and low stock alerts
- Detailed tool usage history by job/part number
- Complete purchase history with document attachments
- Streamlined tool check-out system with intelligent caching
- Advanced search and filtering capabilities

## Technology Stack

### Frontend
- React with Vite
- TypeScript
- shadcn/ui component library
- Tailwind CSS
- Zod for form validation

### Backend
- Node.js with Express.js
- TypeScript
- Prisma ORM
- JWT for authentication
- bcrypt for password hashing

### Database
- PostgreSQL with JSONB for dynamic attributes

## Project Structure

```
/tool-hawk
  /backend
    /src
      /controllers  - Business logic for handling requests
      /middleware   - Custom middleware functions
      /models       - Data models and schema
      /routes       - API route definitions
      /services     - Core business logic and data operations
    /prisma         - Database schema and migrations
  /frontend
    /public         - Static assets
    /src
      /components   - Reusable UI components
      /pages        - Page components
      /services     - API communication layer
      /utils        - Helper functions
```

## Current Progress

### Completed
- Backend project initialization with Express.js
- TypeScript configuration
- Project structure setup for backend
- Prisma ORM integration with complete schema design
- Database schema migration files created
- Basic middleware setup (error handling, authentication, validation)
- User authentication and authorization system
- User management API (CRUD operations)
- Tool category management API with attributes and groups
- Vendor management API with contacts and relationship tracking
- Comprehensive validation using Zod

### In Progress
- Tool management API implementation
- Purchase order and history tracking
- Tool checkout system
- Database seed scripts for initial data

### Next Steps
- Implement remaining backend APIs (tools, vendors, purchases)
- Create database seed scripts for initial data
- Frontend implementation starting with authentication
- Integration of frontend with backend APIs

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy .env.example to .env and configure your environment variables:
   ```
   cp .env.example .env
   ```

4. Set up the database:
   ```
   npm run prisma:migrate
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Authorization System

The application implements a role-based authorization system with three user types:
- **Administrators**: Full access to all system features
- **Managers**: Comprehensive access to tool management features
- **Users**: Limited access focused on day-to-day tool usage and basic inventory management

Each role has specific permissions designed to ensure appropriate data access and system usage.

6/4/2025 8:22PM PST
Created ToolForm Component:
Built a comprehensive form for adding and editing tools with validation using Zod
Implemented fields for tool name, serial number, part number, description, category, status, purchase information, and vendor
Added dynamic technical specifications (attributes) management with add/remove functionality
Created Tool Management Pages:
CreateToolPage.tsx - For adding new tools to the inventory
EditToolPage.tsx - For modifying existing tool information with ID-based routing
Updated App Routing:
Added routes for tool creation, viewing, and editing
Properly configured protected routes for these pages
Enhanced Tool Service:
Updated toolService.ts with mock data for development
Added proper type definitions for tools, categories, vendors, and attributes
Implemented CRUD operations with proper TypeScript typing
Fixed TypeScript Issues:
Resolved type import issues and compatibility problems
Used proper type annotations for better code quality
Added temporary workarounds where needed for development