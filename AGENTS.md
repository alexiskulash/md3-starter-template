# Material Design 3 Starter

A minimal, bare-bones starter application built exclusively with Material Design 3 web components. Perfect for prototyping new applications quickly with Google's official Material Design system.

## Tech Stack

- **PNPM**: Package manager
- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite
- **Design System**: Material Design 3 ([@material/web](https://github.com/material-components/material-web))
- **Styling**: TailwindCSS 3 with Material Design 3 color tokens
- **Backend**: Express server (optional - only create endpoints when strictly necessary)
- **Testing**: Vitest

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/           # Reusable UI components
├── types/                # TypeScript type declarations
│   └── material-web.d.ts # Material Web Components types
├── App.tsx               # App entry point and SPA routing setup
└── global.css            # Material Design 3 tokens + TailwindCSS

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces

.builder/rules/           # AI development guidelines
├── import-resolution.mdc       # Import verification best practices
├── material-web-integration.mdc # Material Web components guide
└── react-patterns.mdc          # React + Web Components patterns

tailwind.config.ts        # Tailwind with MD3 color tokens
```

## Critical Guidelines

### 🔍 Import Resolution

**Always verify imports exist before using them.** See detailed guidelines in:
- `.builder/rules/import-resolution.mdc` - Complete import verification workflows
- For Material Web components, verify paths especially for lab components

### 🎨 Material Web Components

**Use stable components from `@material/web/[category]/[component].js`**

Common components available:
- Buttons: `md-filled-button`, `md-outlined-button`, `md-text-button`
- Cards: `md-elevated-card`, `md-filled-card`, `md-outlined-card`
- Form inputs: `md-filled-text-field`, `md-checkbox`, `md-switch`, `md-slider`
- Other: `md-icon`, `md-fab`, `md-chip`, `md-dialog`, `md-list`, `md-tabs`, `md-menu`

See complete component reference in:
- `.builder/rules/material-web-integration.mdc`

### ⚛️ React Integration

**Material Web Components are native web components, not React components:**

Key patterns:
- ✅ Use `onClick` for buttons, checkboxes, switches (NOT `onChange`)
- ✅ Use `onInput` for text fields
- ✅ Boolean attributes: `disabled={isDisabled ? true : undefined}`
- ✅ Use `useMemo`/`useCallback` for derived state

See complete React patterns in:
- `.builder/rules/react-patterns.mdc`

## SPA Routing System

Routes are defined in `client/App.tsx` using React Router 6:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

- `client/pages/Index.tsx` = home page
- Route files in `client/pages/` directory
- Custom routes must be added BEFORE the `*` catch-all route

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test       # Run Vitest tests
```

## Material Design 3 Color System

All color tokens are defined in `client/global.css`:

```tsx
// Using Tailwind classes
<div className="bg-primary text-primary-foreground">

// Using CSS custom properties
<div style={{ color: "hsl(var(--md-sys-color-primary))" }}>
```

Available tokens:
- **Primary**: Main brand color (purple by default)
- **Secondary**: Supporting brand color
- **Tertiary**: Accent color
- **Surface**: Background for components
- **Error**: Error states

To customize: Edit `client/global.css` or use [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)

## Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`
- **Note**: Only create server endpoints when strictly necessary (e.g., for handling private keys, sensitive DB operations)

## Design Philosophy

This starter is intentionally **minimal and bare-bones**:

✅ Material Design 3 web components and theming  
✅ TypeScript support for all MD3 components  
✅ Responsive layout with Tailwind CSS  
✅ Clean project structure

❌ No state management (add as needed)  
❌ No API client libraries (add as needed)  
❌ No authentication (add as needed)  
❌ No database integrations (add as needed)

## Production Deployment

- **Standard**: `pnpm build`
- **Cloud Deployment**: Use Netlify or Vercel via their MCP integrations for easy deployment

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Web Components](https://github.com/material-components/material-web)
- [Material Icons](https://fonts.google.com/icons)
- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)
- [Builder.io Projects Documentation](https://www.builder.io/c/docs/projects)

## Detailed Guides

For comprehensive implementation details, see:
- `.builder/rules/import-resolution.mdc` - Import verification workflows and common errors
- `.builder/rules/material-web-integration.mdc` - Complete Material Web component reference
- `.builder/rules/react-patterns.mdc` - React integration patterns and best practices

## Notes

- This project uses official Material Web Components from Google
- All components are web components (custom elements) that work with React
- The design system is completely separate from shadcn/ui - this is a pure Material Design 3 implementation
- The color system uses Material Design 3's token-based approach for consistent theming
