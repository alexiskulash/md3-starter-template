/**
 * Material Design 3 Web Components Type Declarations
 * This file provides TypeScript support for Material Web Components
 */

declare namespace JSX {
  interface IntrinsicElements {
    // Buttons
    "md-filled-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        href?: string;
        target?: string;
        type?: "button" | "submit" | "reset";
      },
      HTMLElement
    >;
    "md-outlined-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        href?: string;
        target?: string;
        type?: "button" | "submit" | "reset";
      },
      HTMLElement
    >;
    "md-text-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        href?: string;
        target?: string;
        type?: "button" | "submit" | "reset";
      },
      HTMLElement
    >;
    "md-elevated-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        href?: string;
        target?: string;
        type?: "button" | "submit" | "reset";
      },
      HTMLElement
    >;
    "md-filled-tonal-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        href?: string;
        target?: string;
        type?: "button" | "submit" | "reset";
      },
      HTMLElement
    >;

    // Icon Buttons
    "md-icon-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        toggle?: boolean;
        selected?: boolean;
      },
      HTMLElement
    >;
    "md-filled-icon-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        toggle?: boolean;
        selected?: boolean;
      },
      HTMLElement
    >;
    "md-outlined-icon-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        toggle?: boolean;
        selected?: boolean;
      },
      HTMLElement
    >;

    // Cards
    "md-elevated-card": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
    "md-filled-card": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
    "md-outlined-card": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;

    // Text Fields
    "md-filled-text-field": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        required?: boolean;
        error?: boolean;
        "error-text"?: string;
        "supporting-text"?: string;
        type?:
          | "text"
          | "email"
          | "number"
          | "password"
          | "search"
          | "tel"
          | "url"
          | "date"
          | "time"
          | "datetime-local";
      },
      HTMLElement
    >;
    "md-outlined-text-field": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        required?: boolean;
        error?: boolean;
        "error-text"?: string;
        "supporting-text"?: string;
        type?:
          | "text"
          | "email"
          | "number"
          | "password"
          | "search"
          | "tel"
          | "url";
      },
      HTMLElement
    >;

    // Icons
    "md-icon": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;

    // FAB
    "md-fab": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        variant?: "primary" | "secondary" | "tertiary";
        size?: "medium" | "small" | "large";
        label?: string;
      },
      HTMLElement
    >;

    // Checkbox
    "md-checkbox": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        checked?: boolean;
        disabled?: boolean;
        indeterminate?: boolean;
      },
      HTMLElement
    >;

    // Radio
    "md-radio": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        checked?: boolean;
        disabled?: boolean;
        value?: string;
        name?: string;
      },
      HTMLElement
    >;

    // Switch
    "md-switch": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        selected?: boolean;
        disabled?: boolean;
      },
      HTMLElement
    >;

    // Select
    "md-filled-select": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        disabled?: boolean;
        required?: boolean;
      },
      HTMLElement
    >;
    "md-outlined-select": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        disabled?: boolean;
        required?: boolean;
      },
      HTMLElement
    >;
    "md-select-option": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: string;
        selected?: boolean;
      },
      HTMLElement
    >;

    // Dialog
    "md-dialog": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        open?: boolean;
      },
      HTMLElement
    >;

    // List
    "md-list": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
    "md-list-item": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        type?: "text" | "button" | "link";
      },
      HTMLElement
    >;

    // Ripple
    "md-ripple": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;

    // Elevation
    "md-elevation": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;

    // Progress
    "md-linear-progress": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: number;
        max?: number;
        indeterminate?: boolean;
      },
      HTMLElement
    >;
    "md-circular-progress": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: number;
        max?: number;
        indeterminate?: boolean;
      },
      HTMLElement
    >;

    // Chips
    "md-assist-chip": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        disabled?: boolean;
      },
      HTMLElement
    >;
    "md-filter-chip": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        selected?: boolean;
        disabled?: boolean;
      },
      HTMLElement
    >;
    "md-input-chip": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        disabled?: boolean;
      },
      HTMLElement
    >;
    "md-suggestion-chip": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        label?: string;
        disabled?: boolean;
      },
      HTMLElement
    >;

    // Tabs
    "md-tabs": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
    "md-primary-tab": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        active?: boolean;
        "inline-icon"?: boolean;
      },
      HTMLElement
    >;
    "md-secondary-tab": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        active?: boolean;
      },
      HTMLElement
    >;

    // Slider
    "md-slider": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
      },
      HTMLElement
    >;

    // Menu
    "md-menu": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        open?: boolean;
      },
      HTMLElement
    >;
    "md-menu-item": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
      },
      HTMLElement
    >;
  }
}
