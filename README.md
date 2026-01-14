# FinRP - AI-Powered Business Management Platform

<div align="center">
  <h2>The all-in-one platform for SMEs</h2>
  <p>Manage billing, CRM, ERP, finance, and compliance with the power of AI</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Components](#components)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Development](#development)

---

## 🎯 Overview

FinRP is a comprehensive business management platform designed specifically for Small and Medium Enterprises (SMEs). It integrates multiple business functions including invoicing, customer relationship management, enterprise resource planning, financial tracking, and compliance management into a single, intelligent platform powered by AI.

---

## ✨ Key Features

### 1. **Billing & Invoicing**
- Create and manage professional invoices
- Add multiple line items with descriptions, quantities, and rates
- Customer management with email and address tracking
- Invoice status tracking (Draft, Pending, Paid, Overdue)
- PDF preview generation for invoices
- Payment modal for processing transactions

### 2. **CRM (Customer Relationship Management)**
- Customer database with full contact information
- Customer lifecycle tracking
- Integration with billing system
- Customer interaction history

### 3. **ERP (Enterprise Resource Planning)**
- Manufacturing, Retail, and Services dashboards
- Industry-specific analytics
- Performance metrics and KPIs
- Resource allocation tracking

### 4. **Finance Management**
- Financial analytics and reporting
- Revenue tracking by customer
- Billable hours tracking
- Project profitability analysis
- Financial forecasting

### 5. **Compliance & Regulatory**
- Automated compliance task management
- Document verification system
- Status tracking for regulatory requirements
- Priority-based task organization
- Compliance deadline monitoring

### 6. **AI Integration**
- Intelligent business advisor powered by Google Gemini
- AI-assisted compliance recommendations
- Smart business insights and suggestions
- Natural language processing for business queries
- Contextual AI responses based on business profile

### 7. **Business Management**
- Comprehensive business profile setup
- Business type and industry classification
- Employee tracking
- Annual turnover documentation
- Multi-page dashboard layouts

### 8. **Authentication & Security**
- Clerk authentication integration
- User-specific data isolation
- Secure API endpoints with authorization
- Session management

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Custom built components
- **Type Safety**: TypeScript
- **Charts**: Custom chart components (Bar, Line, Pie)

### Backend
- **Runtime**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: Google Gemini 2.5 Flash API
- **Database Adapter**: Prisma PostgreSQL Adapter

### Build Tools
- **Package Manager**: npm
- **Build Tool**: Vite (configured, used for development)
- **Runtime Configuration**: turbopack

---

## 📁 Project Structure

```
Finrp/
├── app/
│   ├── layout.tsx                 # Root layout with theme and auth providers
│   ├── page.tsx                   # Home page
│   ├── api/
│   │   ├── customers/
│   │   │   └── route.ts          # Customer CRUD operations
│   │   ├── invoices/
│   │   │   └── route.ts          # Invoice management
│   │   └── profile/
│   │       └── route.ts          # Business profile management
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── overview/
│   │   │   └── page.tsx          # Dashboard overview
│   │   ├── billing/
│   │   │   └── page.tsx          # Billing management
│   │   ├── crm/
│   │   │   └── page.tsx          # Customer management
│   │   ├── erp/
│   │   │   └── page.tsx          # ERP features
│   │   ├── finance/
│   │   │   └── page.tsx          # Financial analytics
│   │   ├── compliance/
│   │   │   └── page.tsx          # Compliance management
│   │   └── virtual-cfo/
│   │       └── page.tsx          # AI-powered CFO advisor
│   ├── login/
│   │   └── page.tsx              # Legacy login
│   ├── sign-in/
│   │   └── [[...index]]/
│   │       └── page.tsx          # Clerk sign-in
│   └── sign-up/
│       └── [[...index]]/
│           └── page.tsx          # Clerk sign-up
├── components/
│   ├── DashboardLayout.tsx        # Main layout wrapper
│   ├── DashboardPage.tsx          # Dashboard grid
│   ├── HomePage.tsx               # Home page component
│   ├── BillingPage.tsx            # Billing interface
│   ├── CrmPage.tsx                # CRM interface
│   ├── ErpPage.tsx                # ERP interface
│   ├── FinancePage.tsx            # Finance interface
│   ├── CompliancePage.tsx         # Compliance interface
│   ├── VirtualCFOPage.tsx         # AI advisor interface
│   ├── InvoiceCreator.tsx         # Invoice creation form
│   ├── InvoiceItemsTable.tsx      # Line items table
│   ├── InvoicePDFPreview.tsx      # PDF preview
│   ├── PaymentModal.tsx           # Payment processing
│   ├── AddCustomerModal.tsx       # Customer creation
│   ├── BusinessProfileModal.tsx   # Business profile editor
│   ├── ComplianceTaskCard.tsx     # Compliance task display
│   ├── CompanyDocumentsCard.tsx   # Document management
│   ├── AIAssistant.tsx            # AI chat interface
│   ├── AIBusinessAdvisorChat.tsx  # AI advisor chat
│   ├── AIAdvisorPage.tsx          # AI advisor page
│   ├── PageHeader.tsx             # Page header component
│   ├── LoginPage.tsx              # Login page
│   ├── charts/
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   └── PieChart.tsx
│   ├── dashboards/
│   │   ├── ManufacturingDashboard.tsx
│   │   ├── RetailDashboard.tsx
│   │   └── ServicesDashboard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Logo.tsx
│       ├── MetricCard.tsx
│       ├── ProgressBar.tsx
│       ├── Skeleton.tsx
│       ├── Spinner.tsx
│       ├── Table.tsx
│       └── ThemeToggle.tsx
├── hooks/
│   └── useTheme.ts               # Theme management hook
├── lib/
│   └── db.ts                     # Prisma database client
├── services/
│   ├── geminiService.ts          # Google Gemini API integration
│   ├── billingService.ts         # Billing logic
│   └── mockApi.ts                # Mock data for development
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/
│       └── 000_init/
│           └── migration.sql     # Initial migration
├── styles/
│   └── globals.css               # Global styles
├── middleware.ts                 # Clerk middleware
├── types.ts                      # TypeScript type definitions
├── next.config.ts                # Next.js configuration
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
├── .env.local                    # Environment variables
└── README.md                     # This file
```

---

## 💾 Database Schema

### Customer Model
```typescript
model Customer {
  id        String   @id @default(uuid())
  userId    String
  name      String
  email     String
  address   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  invoices  Invoice[]

  @@index([userId])
}
```

### Invoice Model
```typescript
model Invoice {
  id         String       @id
  userId     String
  customerId String

  customer   Customer     @relation(fields: [customerId], references: [id])
  items      InvoiceItem[]

  issueDate  String
  dueDate    String
  status     String
  notes      String?

  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@index([userId])
  @@index([customerId])
}
```

### InvoiceItem Model
```typescript
model InvoiceItem {
  id          String   @id @default(uuid())
  invoiceId   String

  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  description String
  quantity    Int
  rate        Float

  @@index([invoiceId])
}
```

### BusinessProfile Model
```typescript
model BusinessProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  businessName String
  email        String
  address      String

  // Compliance Fields
  industry          String?
  businessType      String?
  annualTurnover    String?
  hasEmployees      Boolean   @default(false)
  numberOfEmployees Int       @default(0)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 🔌 API Endpoints

### Customer Endpoints
**GET** `/api/customers`
- Fetches all customers for the authenticated user
- Returns: Array of Customer objects
- Auto-seeds mock data if no customers exist

**POST** `/api/customers`
- Creates a new customer
- Body: `{ name: string, email?: string, address?: string }`
- Returns: Created Customer object

### Invoice Endpoints
**GET** `/api/invoices`
- Fetches all invoices for the authenticated user
- Includes customer and items relations
- Returns: Array of Invoice objects with nested data

**POST** `/api/invoices`
- Creates a new invoice with line items
- Body: 
  ```json
  {
    "id": "string",
    "customerId": "string",
    "issueDate": "string",
    "dueDate": "string",
    "status": "string",
    "items": [
      { "description": "string", "quantity": "number", "rate": "number" }
    ],
    "notes": "string?"
  }
  ```
- Returns: Created Invoice object with items

### Profile Endpoints
**GET** `/api/profile`
- Fetches the business profile for the authenticated user
- Returns default profile if not exists in DB
- Returns: BusinessProfile object

**POST** `/api/profile`
- Creates or updates business profile
- Body: BusinessProfile data (all fields optional for updates)
- Returns: Saved BusinessProfile object

---

## 🎨 Components Guide

### Layout Components
- **DashboardLayout**: Main container with sidebar navigation and theme support
- **PageHeader**: Header with title, description, and action buttons

### Feature Components
- **BillingPage**: Complete billing interface with invoice management
- **CrmPage**: Customer management and interactions
- **ErpPage**: Enterprise resource planning features
- **FinancePage**: Financial analytics and reporting
- **CompliancePage**: Compliance tasks and document management
- **VirtualCFOPage**: AI-powered business advisor

### Form Components
- **InvoiceCreator**: Multi-step invoice creation
- **AddCustomerModal**: Customer addition form
- **BusinessProfileModal**: Business information editor

### Data Display Components
- **InvoiceItemsTable**: Line items display and editing
- **ComplianceTaskCard**: Compliance task visualization
- **CompanyDocumentsCard**: Document status display
- **Charts**: BarChart, LineChart, PieChart for analytics

### AI Components
- **AIAssistant**: Chatbot interface
- **AIBusinessAdvisorChat**: Specialized business advisor chat
- **AIAdvisorPage**: Full-page AI advisor interface

### UI Primitives
- **Button**: Customizable button with variants
- **Card**: Container with shadow and padding
- **Input**: Text input with validation
- **Table**: Responsive table component
- **Spinner**: Loading indicator
- **Skeleton**: Content placeholder
- **MetricCard**: KPI display component
- **ProgressBar**: Progress visualization

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database
- Google Gemini API key
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DaRkLord0350/Finrp.git
   cd Finrp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Configuration](#environment-configuration))

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/finrp

# Google Gemini API (for AI features)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Node Environment
NODE_ENV=development
```

### Getting API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into `NEXT_PUBLIC_GEMINI_API_KEY`

**Clerk Keys:**
1. Sign up at [Clerk.com](https://clerk.com)
2. Create a new application
3. Find your keys in the API section
4. Copy `Publishable Key` and `Secret Key`

---

## 🔨 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm run start

# Run linting
npm run lint

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database UI)
npx prisma studio
```

### Project Features Implementation

#### Authentication Flow
- Users authenticate via Clerk
- Middleware validates authentication for protected routes
- User ID from Clerk is used for data isolation

#### Database Operations
- All operations use Prisma ORM for type safety
- Database adapter uses PostgreSQL with connection pooling
- User-specific data filtering via `userId` field

#### AI Integration
- Google Gemini 2.5 Flash model for fast, intelligent responses
- Custom system prompts for different business contexts
- Error handling with fallback messages
- Environment variable configuration for API key

#### Invoice System
- UUID generation for customers
- Custom IDs for invoices
- Cascade delete for invoice items when invoice is deleted
- Support for multiple line items per invoice

#### Business Profile
- Upsert operation for create/update in single call
- Selective field updates to prevent overwriting
- Default values for new profiles
- Classification by industry, business type, and turnover

### Key Implementation Details

**Theme System:**
- Light and dark mode support
- Persisted in localStorage
- Applied via CSS class on `<html>` element
- Custom scrollbar styling

**Responsive Design:**
- Mobile-first approach
- Tailwind CSS utilities
- Custom media query handling
- Flexible grid layouts

**State Management:**
- React hooks for local state
- Custom hooks for reusable logic
- API calls via fetch
- Error boundaries where needed

**Type Safety:**
- Comprehensive TypeScript types
- Interface definitions for all models
- Union types for status and enums
- Optional field handling

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Clerk Documentation](https://clerk.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 📝 License

This project is proprietary software. All rights reserved.


