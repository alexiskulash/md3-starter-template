import { Link } from "react-router-dom";
import "../types/material-web";
import "@material/web/button/filled-button.js";
import "@material/web/icon/icon.js";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <md-icon
            style={{
              fontSize: "96px",
              color: "hsl(var(--md-sys-color-primary))",
            }}
          >
            error_outline
          </md-icon>
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-medium text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-base text-surface-variant-foreground mb-8">
          The page you're looking for doesn't exist or hasn't been created yet.
        </p>
        <Link to="/">
          <md-filled-button>Return Home</md-filled-button>
        </Link>
      </div>
    </div>
  );
}
