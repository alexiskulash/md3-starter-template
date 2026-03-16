import "@material/web/icon/icon.js";
import { WeatherData } from "../../utils/weatherService";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface WeatherIndicatorProps {
  weather: WeatherData;
  compact?: boolean;
}

export default function WeatherIndicator({ weather, compact = false }: WeatherIndicatorProps) {
  const getConditionColor = (condition: string): string => {
    const colorMap: Record<string, string> = {
      'sunny': '#FFA726',
      'cloudy': '#78909C',
      'rainy': '#42A5F5',
      'snowy': '#90CAF9',
      'partly-cloudy': '#FFCA28',
    };
    return colorMap[condition] || '#FFA726';
  };

  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "11px",
          color: "hsl(var(--md-sys-color-on-surface-variant))",
        }}
      >
        <md-icon
          style={{
            fontSize: "14px",
            color: getConditionColor(weather.condition),
          }}
        >
          {weather.icon}
        </md-icon>
        <span>{weather.temp}°</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        borderRadius: "12px",
        background: "hsl(var(--md-sys-color-surface-container-high))",
        fontSize: "12px",
      }}
    >
      <md-icon
        style={{
          fontSize: "16px",
          color: getConditionColor(weather.condition),
        }}
      >
        {weather.icon}
      </md-icon>
      <span style={{ fontWeight: "500", color: "hsl(var(--md-sys-color-on-surface))" }}>
        {weather.temp}°C
      </span>
    </div>
  );
}
