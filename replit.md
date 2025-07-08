# AI Valuation Analytics

## Overview

This is a full-stack web application that provides AI-powered business valuation analysis using Azure OpenAI GPT-4o-mini. The application allows users to input company financial data and receive comprehensive valuation reports with multiple methodologies including DCF analysis, market comparables, and risk assessments.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints for valuation processing
- **Build**: esbuild for production bundling
- **Development**: tsx for TypeScript execution in development

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Provider**: Neon Database (@neondatabase/serverless)
- **Schema Management**: Drizzle migrations in ./migrations directory
- **Development Fallback**: In-memory storage implementation for development/testing

### Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: Express middleware for request logging and error handling
- Currently no authentication system implemented (placeholder for future enhancement)

## Key Components

### Database Schema (shared/schema.ts)
- **valuations table**: Stores company data, analysis results, and AI-generated insights
- **Fields**: Company details, financial metrics, valuation methods, AI analysis, risk assessments
- **Validation**: Zod schemas for runtime type safety and API validation

### API Endpoints (server/routes.ts)
- **POST /api/valuations**: Creates new valuation analysis
- **GET /api/valuations/:id**: Retrieves specific valuation results
- **GET /api/valuations**: Lists recent valuations
- **POST /api/quick-calculator**: Provides quick valuation estimates

### UI Components
- **CompanyForm**: Input form for company financial data
- **ValuationResults**: Displays comprehensive analysis results
- **RiskAssessment**: Visual risk factor analysis
- **QuickCalculator**: Real-time valuation estimates
- **DetailedReport**: Exportable detailed analysis

### External Dependencies
- **Azure OpenAI**: GPT-4o-mini for AI-powered analysis and insights
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management
- **Drizzle**: Type-safe ORM for PostgreSQL

## Data Flow

1. **User Input**: Company financial data entered through CompanyForm
2. **Validation**: Client-side validation using Zod schemas
3. **API Request**: Data sent to backend valuation endpoint
4. **AI Processing**: Azure OpenAI analyzes company data and generates insights
5. **Calculation**: Multiple valuation methodologies applied (DCF, comparables, asset-based)
6. **Risk Analysis**: Automated risk assessment across multiple factors
7. **Storage**: Results stored in PostgreSQL database
8. **Response**: Comprehensive analysis returned to frontend
9. **Display**: Results rendered in interactive UI components

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: UI component primitives
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation
- **express**: Web server framework
- **wouter**: Lightweight React router

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database migration tools
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (required)
- **AZURE_OPENAI_ENDPOINT**: Azure OpenAI service endpoint (e.g., https://your-resource.openai.azure.com)
- **OPENAI_API_KEY**: Azure OpenAI API key
- **AZURE_OPENAI_DEPLOYMENT_NAME**: Model deployment name (defaults to gpt-4o-mini)
- **AZURE_SEARCH_ENDPOINT**: Azure Cognitive Search endpoint (optional)
- **AZURE_SEARCH_INDEX_NAME**: Azure Search index name (optional)
- **AZURE_SEARCH_KEY**: Azure Search API key (optional)
- **NODE_ENV**: Environment mode (development/production)

### Production Setup
- Node.js server serves both API and static frontend files
- PostgreSQL database with Drizzle schema
- Azure OpenAI service for AI analysis
- Environment-specific configuration via environment variables

### Development Features
- Hot module replacement via Vite
- TypeScript compilation checking
- Automatic server restart on file changes
- Replit-specific development tooling integration

## Changelog

```
Changelog:
- July 08, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```