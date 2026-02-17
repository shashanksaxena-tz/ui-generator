# Generative UI Platform - Example Applications

This directory contains example applications demonstrating the capabilities of the Generative UI Platform.

## Examples

### 1. Dashboard (`examples/dashboard/`)

A comprehensive sales analytics dashboard showcasing:

- **KPI Cards**: Real-time metrics with trend indicators and live data simulation
- **Interactive Charts**: Line, bar, area, and pie charts using Recharts
- **Data Tables**: Sortable, filterable tables with bulk actions
- **Date Range Picker**: Calendar integration for filtering data
- **Responsive Design**: Adapts to all screen sizes
- **Dark Mode Support**: Full theming integration

**Files:**
- `page.tsx` - Main dashboard page with layout
- `components/KPICards.tsx` - KPI metric cards
- `components/SalesChart.tsx` - Revenue and category charts
- `components/RecentOrders.tsx` - Orders data table
- `lib/data.ts` - Mock data and utilities

### 2. Landing Page (`examples/landing-page/`)

A complete SaaS landing page featuring:

- **Hero Section**: Animated gradient background with CTA buttons
- **Feature Grid**: 12 feature cards with icons and descriptions
- **Testimonials**: Customer reviews with ratings and avatars
- **Pricing Tiers**: Toggle between monthly/yearly billing
- **Responsive Navigation**: Mobile-friendly menu
- **Footer**: Links, social icons, and newsletter CTA

**Files:**
- `page.tsx` - Landing page with navigation and footer
- `components/Hero.tsx` - Hero section with animations
- `components/Features.tsx` - Feature grid with intersection observer
- `components/Testimonials.tsx` - Customer testimonials
- `components/Pricing.tsx` - Pricing cards with toggle

### 3. Admin Panel (`examples/admin-panel/`)

A full-featured admin panel with:

- **User Management**: Data table with filtering, sorting, bulk actions
- **Role Management**: Permission-based role editor
- **Activity Log**: System events with severity indicators
- **Settings Panel**: Appearance, notifications, security settings
- **Sidebar Navigation**: Collapsible navigation with user profile
- **Responsive Layout**: Works on desktop and mobile

**Files:**
- `page.tsx` - Admin panel with sidebar and routing
- `components/UserTable.tsx` - User management table
- `components/RoleManager.tsx` - Role and permission editor
- `components/ActivityLog.tsx` - Activity feed
- `lib/users.ts` - Mock user data and types

### 4. Form Builder (`examples/form-builder/`)

A dynamic form builder demonstrating:

- **Field Palette**: 20+ field types (text, select, file, rating, etc.)
- **Visual Canvas**: Drag-and-drop form arrangement
- **Property Editor**: Configure field properties and validation
- **Form Preview**: Live preview of the built form
- **Export Options**: JSON, TypeScript, React Hook Form
- **Templates**: Pre-built form templates
- **Validation Rules**: Required, min/max, pattern matching

**Files:**
- `page.tsx` - Form builder with history management
- `components/FieldPalette.tsx` - Available field types
- `components/FormCanvas.tsx` - Visual form editor
- `components/PropertyEditor.tsx` - Field configuration panel
- `lib/form-schema.ts` - Types, validation, and export utilities

## Usage

These examples are designed to work with the Generative UI Platform component library. To use them:

1. Copy the example directory to your app's pages directory
2. Install dependencies if needed (recharts for charts, date-fns for dates)
3. Update import paths to match your project structure
4. Customize the mock data in `lib/` files

## Dependencies

All examples use:
- `@generative-ui/ui` - UI components
- `@generative-ui/themes` - Theme system
- `next` - Next.js framework
- `react` - React library
- `lucide-react` - Icons
- `tailwindcss` - Styling

Additional dependencies per example:
- **Dashboard**: `recharts`, `date-fns`
- **Form Builder**: `zod`, `react-hook-form` (for exports)

## Architecture

Each example follows these patterns:

- **Next.js App Router**: Uses the app directory structure
- **TypeScript**: Full type safety
- **Component Composition**: Small, reusable components
- **Custom Hooks**: State management with hooks
- **Mock Data**: Realistic data in `lib/` files
- **Responsive**: Mobile-first design
- **Accessible**: ARIA labels and keyboard navigation
