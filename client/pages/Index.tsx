import { useEffect } from "react";

// Import Material Design 3 web components
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/labs/card/elevated-card.js";
import "@material/web/icon/icon.js";

// Declare custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "md-outlined-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "md-text-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "md-elevated-card": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "md-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function Index() {
  useEffect(() => {
    // Material components are ready
    console.log("Material Design 3 Starter Ready");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Material Design 3
          </h1>
          <p className="text-xl text-surface-variant-foreground">
            A minimal starter for prototyping with Material Design 3
          </p>
        </div>

        {/* Main Card */}
        <md-elevated-card style={{ width: "100%", marginBottom: "24px" }}>
          <div className="p-8">
            <h2 className="text-2xl font-medium text-foreground mb-4">
              Welcome to MD3 Starter
            </h2>
            <p className="text-base text-surface-variant-foreground mb-6">
              This is a bare-bones Material Design 3 application perfect for
              prototyping. All components use the official Material Web
              Components library.
            </p>

            <div className="flex flex-wrap gap-3">
              <md-filled-button>Get Started</md-filled-button>
              <md-outlined-button>Learn More</md-outlined-button>
              <md-text-button>Documentation</md-text-button>
            </div>
          </div>
        </md-elevated-card>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <md-elevated-card style={{ width: "100%" }}>
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <md-icon
                  style={{
                    fontSize: "48px",
                    color: "hsl(var(--md-sys-color-primary))",
                  }}
                >
                  palette
                </md-icon>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Material Theme
              </h3>
              <p className="text-sm text-surface-variant-foreground">
                Built with Material Design 3 color tokens and theming
              </p>
            </div>
          </md-elevated-card>

          <md-elevated-card style={{ width: "100%" }}>
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <md-icon
                  style={{
                    fontSize: "48px",
                    color: "hsl(var(--md-sys-color-primary))",
                  }}
                >
                  code
                </md-icon>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Web Components
              </h3>
              <p className="text-sm text-surface-variant-foreground">
                Official Material Web Components from Google
              </p>
            </div>
          </md-elevated-card>

          <md-elevated-card style={{ width: "100%" }}>
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <md-icon
                  style={{
                    fontSize: "48px",
                    color: "hsl(var(--md-sys-color-primary))",
                  }}
                >
                  speed
                </md-icon>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Minimal Setup
              </h3>
              <p className="text-sm text-surface-variant-foreground">
                Bare bones starter ready for your prototypes
              </p>
            </div>
          </md-elevated-card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-surface-variant-foreground">
            Start building your next prototype with Material Design 3
          </p>
        </div>
      </div>
    </div>
  );
}
