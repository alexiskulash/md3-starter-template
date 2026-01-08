import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        // Material Design 3 color tokens
        primary: {
          DEFAULT: "hsl(var(--md-sys-color-primary))",
          foreground: "hsl(var(--md-sys-color-on-primary))",
          container: "hsl(var(--md-sys-color-primary-container))",
          "container-foreground":
            "hsl(var(--md-sys-color-on-primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--md-sys-color-secondary))",
          foreground: "hsl(var(--md-sys-color-on-secondary))",
          container: "hsl(var(--md-sys-color-secondary-container))",
          "container-foreground":
            "hsl(var(--md-sys-color-on-secondary-container))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--md-sys-color-tertiary))",
          foreground: "hsl(var(--md-sys-color-on-tertiary))",
          container: "hsl(var(--md-sys-color-tertiary-container))",
          "container-foreground":
            "hsl(var(--md-sys-color-on-tertiary-container))",
        },
        error: {
          DEFAULT: "hsl(var(--md-sys-color-error))",
          foreground: "hsl(var(--md-sys-color-on-error))",
          container: "hsl(var(--md-sys-color-error-container))",
          "container-foreground": "hsl(var(--md-sys-color-on-error-container))",
        },
        surface: {
          DEFAULT: "hsl(var(--md-sys-color-surface))",
          foreground: "hsl(var(--md-sys-color-on-surface))",
          variant: "hsl(var(--md-sys-color-surface-variant))",
          "variant-foreground": "hsl(var(--md-sys-color-on-surface-variant))",
        },
        background: "hsl(var(--md-sys-color-background))",
        foreground: "hsl(var(--md-sys-color-on-background))",
        outline: {
          DEFAULT: "hsl(var(--md-sys-color-outline))",
          variant: "hsl(var(--md-sys-color-outline-variant))",
        },
      },
      borderRadius: {
        none: "var(--md-sys-shape-corner-none)",
        xs: "var(--md-sys-shape-corner-extra-small)",
        sm: "var(--md-sys-shape-corner-small)",
        md: "var(--md-sys-shape-corner-medium)",
        lg: "var(--md-sys-shape-corner-large)",
        xl: "var(--md-sys-shape-corner-extra-large)",
        full: "var(--md-sys-shape-corner-full)",
      },
      fontFamily: {
        sans: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
