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
- Prisma ORM integration and schema design
- Basic middleware setup (error handling, authentication, validation)
- Base controllers and routes

### In Progress
- Database schema implementation
- Authentication and authorization system
- Tool category management backend

### Next Steps
- Tool management implementation
- Purchase and part history tracking
- Frontend implementation starting with authentication

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
