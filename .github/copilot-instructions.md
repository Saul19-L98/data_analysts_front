# Project Development Guidelines

## Code Quality Standards
Write the best, most maintainable, and production-ready code possible. Follow industry best practices and modern development patterns.

---

## React Best Practices

### Component Structure
- **Always use functional components** with hooks instead of class components
- **Component names must start with a capital letter** (e.g., `MyButton`, `UserProfile`)
- **Use descriptive, meaningful component names** that reflect their purpose
- **Keep components focused on a single responsibility**

### JSX Guidelines
- **JSX is stricter than HTML** - always close self-closing tags like `<br />`, `<img />`, `<input />`
- **Cannot return multiple JSX tags** - wrap them in a shared parent like `<div>...</div>` or an empty fragment `<>...</>`
- **Use fragments (`<>...</>`)** to avoid unnecessary DOM nodes
- **Use `className` instead of `class`** for CSS classes

### Hooks Best Practices
- **Only call hooks at the top level** of your components - never inside conditions, loops, or nested functions
- **Call hooks in the same order** every time the component renders
- **Use `useState`** for component state management
- **Name state variables descriptively** using the pattern `[something, setSomething]`
- **Extract complex logic into custom hooks** when needed

### Props and State
- **Lift state up** when multiple components need to share data
- **Pass props explicitly** - use destructuring for clarity: `function MyButton({ count, onClick })`
- **Use props for passing data down** and callbacks for passing events up
- **Keep state as local as possible** - only lift it when necessary

### Event Handling
- **Event handler functions should be passed as references**, not called: `onClick={handleClick}` NOT `onClick={handleClick()}`
- **Name event handlers** with a `handle` prefix: `handleClick`, `handleSubmit`, `handleChange`
- **Define event handlers inside components** to access component state and props

### Lists and Keys
- **Always provide a `key` prop** when rendering lists with `.map()`
- **Keys should be stable, unique identifiers** from your data (e.g., database IDs)
- **Never use array index as key** unless the list is static and will never reorder

### Conditional Rendering
- **Use ternary operator** for inline conditions: `{isLoggedIn ? <AdminPanel /> : <LoginForm />}`
- **Use logical AND (`&&`)** when you only need to render on true: `{isLoggedIn && <AdminPanel />}`
- **Use `if` statements** for complex conditional logic outside JSX

### File Organization
- **One component per file** (with related helper components in the same file if tiny)
- **Export the main component as default**: `export default function MyApp() { ... }`
- **Import hooks from React**: `import { useState, useEffect } from 'react'`

---

## Tailwind CSS Best Practices

### Setup and Configuration
- **Use `@tailwindcss/vite` plugin** for seamless Vite integration
- **Import Tailwind in your CSS**: `@import "tailwindcss";`
- **Configure the Vite plugin** in `vite.config.ts`:
  ```typescript
  import tailwindcss from '@tailwindcss/vite'
  
  export default defineConfig({
    plugins: [tailwindcss()]
  })
  ```

### Utility-First Approach
- **Use utility classes directly in JSX** instead of writing custom CSS
- **Combine utilities for complex designs**: `className="text-3xl font-bold underline"`
- **Leverage responsive modifiers**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Use state modifiers**: `hover:`, `focus:`, `active:`, `disabled:`

### Class Organization
- **Order classes logically**: layout → sizing → spacing → typography → colors → effects
- **Keep class names readable** - break long lists into multiple lines if needed
- **Use template literals** for conditional classes:
  ```tsx
  className={`base-classes ${condition ? 'conditional-classes' : ''}`}
  ```

### Performance
- **Tailwind scans files and generates only used classes** - no runtime overhead
- **Classes are static and optimized** during build
- **Purge unused styles automatically** in production builds

---

## shadcn/ui Best Practices

### Installation and Setup
- **Install required dependencies**:
  ```bash
  pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
  ```
- **Configure path aliases** in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"]
      }
    }
  }
  ```

### Component Structure
- **Use the `cn` utility** for merging class names:
  ```tsx
  import { cn } from "@/lib/utils"
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```
- **Import components from `@/components/ui`**
- **Keep UI components in `components/ui` folder**
- **Keep business logic components separate** from UI components

### Styling with CSS Variables
- **Use CSS variables for theming** - defined in `globals.css`
- **Leverage the `@theme inline` directive** for Tailwind integration
- **Support dark mode** with the `.dark` class variant
- **Use semantic color names**: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`

### Component Customization
- **Copy components to your project** for full control
- **Modify components as needed** - they're your code
- **Maintain the component structure** for consistency
- **Use Tailwind utilities** for custom styling

### Icon Library
- **Use `lucide-react`** for icons (configured in `components.json`)
- **Icons are tree-shakeable** - only import what you use
- **Match icon style** with component design

---

## shadcn/ui Charts Best Practices

### Chart Library
- **Built on Recharts** - a composable charting library for React
- **Ready-to-use chart components** - copy and paste into your project
- **Fully customizable** - modify to match your design

### Area Chart Patterns
- **Interactive charts** - add tooltips, legends, and interactions
- **Multiple variants available**:
  - Standard area charts
  - Linear interpolation
  - Step interpolation
  - Stacked charts
  - Stacked expanded (100%)
  - With legends and icons
  - With gradients
  - With custom axes

### Chart Configuration
- **Use `chartConfig` object** to define chart metadata
- **Define colors for data series** using CSS variables
- **Add labels and descriptions** for accessibility
- **Configure tooltips** for data display

### Chart Components Structure
```tsx
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Wrap charts in ChartContainer
<ChartContainer config={chartConfig}>
  <AreaChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Area dataKey="desktop" fill="var(--color-desktop)" />
  </AreaChart>
</ChartContainer>
```

### Chart Best Practices
- **Always provide accessible data** with proper labels
- **Use semantic color variables** from your theme
- **Add descriptive tooltips** for better UX
- **Consider responsive design** - charts should work on all screen sizes
- **Show loading and error states** for async data
- **Add chart descriptions** for context (trending, totals, etc.)
- **Use appropriate chart types** for your data (area for trends, bar for comparisons, etc.)

---

## General Best Practices

### Code Style
- **Use TypeScript** for type safety
- **Write self-documenting code** with clear variable and function names
- **Keep functions small and focused**
- **Use async/await** instead of promise chains
- **Handle errors appropriately** with try-catch blocks

### Performance
- **Minimize re-renders** - use React.memo, useMemo, useCallback when appropriate
- **Code-split large applications** using React.lazy and Suspense
- **Optimize images and assets**
- **Use proper key props** to help React optimize renders

### Accessibility
- **Use semantic HTML elements**
- **Provide alt text for images**
- **Ensure keyboard navigation works**
- **Use ARIA attributes when needed**
- **Maintain sufficient color contrast**

### Testing
- **Write tests for critical functionality**
- **Test user interactions, not implementation details**
- **Use meaningful test descriptions**

---

## Project-Specific Reminders
- This is a **Vite + React + TypeScript** project
- **Tailwind CSS v4** is configured with the Vite plugin
- **shadcn/ui components** are available for UI elements
- **Path aliases** use `@/` prefix
- **Components go in `src/components/`**
- **Utilities go in `src/lib/utils.ts`**
