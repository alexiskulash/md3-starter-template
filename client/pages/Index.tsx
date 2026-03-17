import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    // Material Design 3 components are ready
    console.log("Material Design 3 Starter Ready");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "hsl(var(--md-sys-color-background))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "768px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "hsl(var(--md-sys-color-primary))",
              marginBottom: "16px",
              lineHeight: "1.2",
            }}
          >
            Material Design 3
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              lineHeight: "1.4",
            }}
          >
            A minimal starter for rapid prototyping with Material Design 3
          </p>
        </div>

        {/* Main Card */}
        <md-elevated-card style={{ width: "100%", marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "32px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface))",
                marginBottom: "16px",
                lineHeight: "1.33",
              }}
            >
              Welcome to MD3 Starter
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                marginBottom: "24px",
                lineHeight: "1.5",
                textAlign: "center",
              }}
            >
              This is a bare-bones Material Design 3 application perfect for
              prototyping. All components use the official Material Web
              Components library.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <md-filled-button onClick={() => navigate('/calendar')}>
                Open Calendar
              </md-filled-button>
              <md-outlined-button>Learn More</md-outlined-button>
              <md-text-button>Documentation</md-text-button>
            </div>
          </div>
        </md-elevated-card>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <md-elevated-card style={{ width: "100%" }}>
            <div style={{ padding: "24px", textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <md-icon
                  style={{
                    fontSize: "48px",
                    color: "hsl(var(--md-sys-color-primary))",
                  }}
                >
                  palette
                </md-icon>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "hsl(var(--md-sys-color-on-surface))",
                  marginBottom: "8px",
                  lineHeight: "1.33",
                }}
              >
                Material Theme
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  lineHeight: "1.43",
                }}
              >
                Built with Material Design 3 color tokens and theming
              </p>
            </div>
          </md-elevated-card>

          <md-elevated-card style={{ width: "100%" }}>
            <div style={{ padding: "24px", textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <md-icon
                  style={{
                    fontSize: "48px",
                    color: "hsl(var(--md-sys-color-primary))",
                  }}
                >
                  code
                </md-icon>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "hsl(var(--md-sys-color-on-surface))",
                  marginBottom: "8px",
                  lineHeight: "1.33",
                }}
              >
                Web Components
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  lineHeight: "1.43",
                }}
              >
                Official Material Web Components from Google
              </p>
            </div>
          </md-elevated-card>

          <md-elevated-card style={{ width: "100%" }}>
            <div style={{ padding: "24px", textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <md-icon
                  style={{
                    fontSize: "48px",
                    color: "hsl(var(--md-sys-color-primary))",
                  }}
                >
                  speed
                </md-icon>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "hsl(var(--md-sys-color-on-surface))",
                  marginBottom: "8px",
                  lineHeight: "1.33",
                }}
              >
                Minimal Setup
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  lineHeight: "1.43",
                }}
              >
                Bare bones starter ready for your prototypes
              </p>
            </div>
          </md-elevated-card>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p
            style={{
              fontSize: "14px",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              lineHeight: "1.43",
            }}
          >
            Start building your next prototype with Material Design 3
          </p>
        </div>
      </div>
    </div>
  );
}
