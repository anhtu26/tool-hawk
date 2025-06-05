# CNC Tool Library Build Plan - Phase 1: Foundation & Core Demo Features

This phase focuses on establishing the foundation and implementing core features with mock data to quickly demonstrate the application's capabilities to the client.

## 1. Project Setup & Infrastructure

### 1.1 Frontend Project Setup
- [x] Initialize React application with Vite
- [x] Install and configure Tailwind CSS
- [x] Set up shadcn/ui component library
- [x] Configure Zod for form validation
- [x] Set up project structure (e.g., `src/components`, `src/pages`, `src/services`, `src/utils`, `src/hooks`, `src/contexts`)
- [x] Establish global state management (e.g., Zustand, Jotai, or React Context based on complexity)
- [x] Create basic layout components (e.g., `Header`, `Sidebar`, `Footer`, `MainContentArea`)
- [x] Set up routing with React Router DOM (v6+)

### 1.2 Backend Project Setup
- [x] Initialize Node.js project with Express.js
- [x] Configure TypeScript for strict type checking and path aliases
- [x] Set up project structure (e.g., `src/core` (common modules), `src/features` (feature-specific modules), `src/config`, `src/middleware`, `src/utils`)
- [x] Configure middleware for: logging (e.g., Morgan/Pino), centralized error handling, request parsing (JSON, URL-encoded)
- [x] Set up Prisma ORM and generate initial Prisma Client
- [x] Configure `dotenv` for environment variables (e.g., `.env.development`, `.env.production`)
- [x] Establish security middleware (CORS with restrictive policies, Helmet for security headers, rate limiting e.g., `express-rate-limit`)

### 1.3 Development Environment (Skipped as per user request)
- [-] Set up Git repository with branch protection rules and `.gitignore` <!-- User skipped further work on this -->
- [-] Configure ESLint, Prettier, and Husky for code quality <!-- User skipped -->
- [-] Define essential scripts in `package.json` for development tasks <!-- User skipped -->

## 2. Database Schema Design (Core Tables)

### 2.1 User Management Schema
- [x] Design `users` table with role-based access control
- [x] Design `user_preferences` table
- [x] Design `refresh_tokens` table

### 2.2 Tool Categories Schema
- [x] Design `tool_categories` table with hierarchical structure
- [x] Design `attribute_groups` table for UI organization
- [x] Design `category_attributes` table with dynamic attribute types

### 2.3 Tools Schema (Core)
- [x] Design `vendors` table
- [x] Design `tools` table with JSONB `custom_attributes`
- [x] Configure GIN indexing for efficient attribute queries

### 2.4 Schema Migration and Initialization
- [x] Create initial Prisma migration scripts (Command initiated; user may need to confirm prompts in terminal)
- [x] Develop seed data scripts for demonstration data (Existing seed.ts is comprehensive)
  - [x] Create admin, manager, and operator user accounts (Covered by existing seed.ts)
  - [x] Generate sample tool categories with attributes (Covered by existing seed.ts)
  - [x] Create sample tools with realistic attributes (Covered by existing seed.ts)
  - [x] Add mock vendor data (Covered by existing seed.ts)

## 3. Backend API Foundation

### 3.1 API Structure & Middleware
- [x] Set up versioned API routes
- [x] Implement request validation with Zod
- [x] Create error handling middleware
- [x] Establish response formatting standards
- [x] Configure security headers and CORS

### 3.2 Core Services
- [x] Implement tool listing with DB (GET /tools) images) - Config, controller, and routes created. Multer and @types/multer installed. One persistent lint error in upload.routes.ts related to Express handler typings (ID: 881537ba-465f-4069-afb8-66645d3e69ad).
- [~] Create utility functions for common operations (started with `asyncHandler.ts`)
- [x] Set up basic caching for performance (simple in-memory cache with `memory-cache`)

## 4. Authentication & Authorization

### 4.1 User Registration and Login
- [x] Implement user registration endpoint
- [x] Create login endpoint with JWT generation
- [x] Implement password hashing with bcrypt
- [x] Create token refresh mechanism

### 4.2 Authorization System
- [x] Implement JWT validation middleware
- [x] Create role-based permission system
- [x] Set up access control for routes

### 4.3 Frontend Authentication
- [x] Create login and registration forms
- [x] Implement JWT storage and management
- [x] Set up protected routes
- [x] Create authentication context/provider

## 5. Tool Category Management (Core Demo Feature)

### 5.1 Category Backend Implementation
- [x] Create CRUD endpoints for categories
- [x] Implement hierarchical category operations
- [x] Set up category validation
- [x] Create endpoints for retrieving category tree

### 5.2 Custom Attributes Backend
- [x] Create endpoints for managing category attributes
- [x] Implement attribute validation schemas
- [x] Set up attribute grouping functionality

### 5.3 Category Frontend Components
- [x] Create category management UI (page with tree, details, and mock CUD operations)
- [x] Implement category tree visualization (integrated existing `CategoryTree` component with mock data)
- [x] Build category creation/edit forms (integrated `CategoryFormDialog.tsx` with mock data handlers)

### 5.4 Custom Attributes Frontend
- [x] Build attribute management interface (dynamic forms for mock attributes in category detail view)
- [x] Create dynamic attribute form components (integrated `DynamicAttributeFormField.tsx`)
- [~] Implement attribute validation in UI (basic HTML5 validation present in dynamic forms)

## 6. Tool Management (Core Demo Feature)

### 6.1 Tool CRUD Backend
- [x] Implement tool creation with DB (POST /tools)
- [x] Implement tool retrieval with DB (GET /tools/:id)
- [x] Implement tool listing with DB (GET /tools)
- [x] Implement tool update with DB (PUT /tools/:id)
- [x] Implement tool deletion with DB (DELETE /tools/:id)

### 6.2 Dynamic Attributes Backend
- [~] Implement JSONB attribute storage (validation pending)
- [x] GIN index for customAttributes defined in schema.prisma

### 6.3 Tool Frontend Components
- [x] Create tool listing page with filtering
- [x] Build tool detail page with tabs

- [x] Create dynamic attribute form components

### 6.4 Mock Data Integration
- [ ] Create mock data service for development
- [ ] Implement toggle between mock and API data

## 7. Basic Dashboard

### 7.1 Simple Dashboard UI
- [ ] Create main dashboard layout
- [ ] Implement mock inventory statistics
- [ ] Build simple tool category distribution chart
- [ ] Create quick access links to core features

## 8. Phase 1 Testing & Documentation

### 8.1 Basic Testing
- [ ] Create essential API endpoint tests
- [ ] Implement core component tests
- [ ] Test authentication flows

### 8.2 Documentation
- [ ] Create basic user guide for demo features
- [ ] Document API endpoints for Phase 1
- [ ] Create demo script for client presentation
