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
├── types/                # TypeScript type declarations
│   └── material-web.d.ts # Material Web Components types
├── App.tsx               # App entry point and SPA routing setup
└── global.css            # Material Design 3 tokens + TailwindCSS

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces

tailwind.config.ts        # Tailwind with MD3 color tokens
```

## Material Design 3 Setup

### Available Components

This starter includes the official Material Web Components library with support for:

**Buttons**

- `<md-filled-button>` - High-emphasis primary actions
- `<md-outlined-button>` - Medium-emphasis secondary actions
- `<md-text-button>` - Low-emphasis tertiary actions
- `<md-elevated-button>` - Actions needing visual separation
- `<md-filled-tonal-button>` - Middle-ground emphasis

**Cards**

- `<md-elevated-card>` - Cards with shadow elevation
- `<md-filled-card>` - Cards with tonal background
- `<md-outlined-card>` - Cards with outline border

**Form Inputs**

- `<md-filled-text-field>` - Text inputs with filled style
- `<md-outlined-text-field>` - Text inputs with outlined style
- `<md-checkbox>` - Checkboxes
- `<md-radio>` - Radio buttons
- `<md-switch>` - Toggle switches
- `<md-slider>` - Range sliders
- `<md-filled-select>` / `<md-outlined-select>` - Dropdowns

**Other Components**

- `<md-icon>` - Material Icons
- `<md-fab>` - Floating action buttons
- `<md-chip>` variants - Chips for filters, inputs, etc.
- `<md-dialog>` - Modal dialogs
- `<md-list>` - Lists
- `<md-tabs>` - Tab navigation
- `<md-menu>` - Menus

### Using Material Components

1. **Import the web component:**

```typescript
import "@material/web/button/filled-button.js";
```

2. **Declare types (if TypeScript complains):**

```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
```

3. **Use in JSX:**

```tsx
<md-filled-button>Click Me</md-filled-button>
```

## Material Web Components - Important React Integration Notes

### Handling Boolean Attributes

Material Web Components are **native web components**, not React components. Boolean attributes must be handled carefully:

❌ **WRONG:**

```tsx
<md-filled-button disabled={false}>Click Me</md-filled-button>
// Sets disabled="false" which is truthy - button stays disabled!
```

✅ **CORRECT:**

```tsx
<md-filled-button disabled={isDisabled ? true : undefined}>
  Click Me
</md-filled-button>
// Sets attribute when true, removes it when undefined
```

### Event Handling

Material Web Components use **native DOM events**, not React synthetic events.

**CRITICAL RULES:**

1. **Never use `onChange` on Material Web Components** - it won't fire
2. **Use `onClick` for interactive components** (checkboxes, buttons, etc.)
3. **For complex state changes, use refs with `addEventListener`**

**Common Event Handlers:**

✅ **Checkboxes - Use `onClick`:**
```tsx
<md-checkbox
  checked={isChecked ? true : undefined}
  onClick={() => setIsChecked(!isChecked)}
/>
```

❌ **WRONG - onChange doesn't work:**
```tsx
<md-checkbox
  checked={isChecked}
  onChange={() => setIsChecked(!isChecked)}  // WON'T FIRE!
/>
```

✅ **Text Fields - Use `onInput`:**
```tsx
<md-filled-text-field
  value={text}
  onInput={(e: any) => setText(e.target.value)}
/>
```

✅ **Buttons - Use `onClick`:**
```tsx
<md-filled-button onClick={handleClick}>
  Click Me
</md-filled-button>
```

**When in doubt:** Use `onClick` for interactive components, `onInput` for text fields.

**Key Takeaway:**
- Material Web Components use native events - use `onClick` not `onChange`
- Follow the Material Web Components event handling rules from AGENTS.md exactly
- Test all interactive components for event handling

### Form Validation

Always use `useMemo` or `useCallback` for derived state that controls component behavior:

```tsx
const isFormValid = useMemo(() => {
  return !!(field1 && field2 && field3);
}, [field1, field2, field3]);
```

**Without `useMemo`, the value only calculates once and won't update when dependencies change.**

### Material Design 3 Color System

All color tokens are defined in `client/global.css` using the MD3 color system:

- **Primary**: Main brand color (purple by default)
- **Secondary**: Supporting brand color
- **Tertiary**: Accent color
- **Surface**: Background for components
- **Error**: Error states

Colors are defined in HSL format for Tailwind compatibility and are available as both CSS custom properties and Tailwind utilities:

```tsx
// Using Tailwind classes
<div className="bg-primary text-primary-foreground">

// Using CSS custom properties
<div style={{ color: "hsl(var(--md-sys-color-primary))" }}>
```

### Customizing the Theme

To change colors:

1. Open `client/global.css`
2. Modify the HSL values in `:root` (light theme) and `.dark` (dark theme)
3. Or use [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) to generate a complete palette

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page
- Routes are defined in `client/App.tsx` using `react-router-dom`
- Route files are located in the `client/pages/` directory

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test       # Run Vitest tests
```

## Adding New Material Components

1. Find the component in [Material Web docs](https://github.com/material-components/material-web)
2. Import it in your component:
   ```tsx
   import "@material/web/[category]/[component-name].js";
   ```
3. Add TypeScript declarations if needed (see `client/types/material-web.d.ts`)
4. Use the component in your JSX:
   ```tsx
   <md-component-name />
   ```

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

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Web Components](https://github.com/material-components/material-web)
- [Material Icons](https://fonts.google.com/icons)
- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)
- [Builder.io Projects Documentation](https://www.builder.io/c/docs/projects)

## Production Deployment

- **Standard**: `pnpm build`
- **Cloud Deployment**: Use Netlify or Vercel via their MCP integrations for easy deployment

## Notes

- This project uses official Material Web Components from Google
- All components are web components (custom elements) that work with React
- The design system is completely separate from shadcn/ui - this is a pure Material Design 3 implementation
- The color system uses Material Design 3's token-based approach for consistent theming
