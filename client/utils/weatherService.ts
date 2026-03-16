export interface WeatherData {
  date: string; // ISO date string
  temp: number; // in Celsius
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly-cloudy';
  icon: string; // Material icon name
}

// Mock weather data generator for demonstration
// In production, this would call a real weather API like OpenWeather
export async function getWeatherForecast(startDate: Date, days: number = 7): Promise<WeatherData[]> {
  const weatherData: WeatherData[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate mock weather data
    const conditions: Array<'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly-cloudy'> = [
      'sunny', 'cloudy', 'rainy', 'snowy', 'partly-cloudy'
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 30) + 5; // 5-35°C
    
    weatherData.push({
      date: date.toISOString().split('T')[0],
      temp,
      condition: randomCondition,
      icon: getWeatherIcon(randomCondition),
    });
  }
  
  return weatherData;
}

function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    'sunny': 'wb_sunny',
    'cloudy': 'cloud',
    'rainy': 'rainy',
    'snowy': 'ac_unit',
    'partly-cloudy': 'partly_cloudy_day',
  };
  
  return iconMap[condition] || 'wb_sunny';
}

// For production use with OpenWeather API:
// export async function getWeatherForecast(startDate: Date, days: number = 7): Promise<WeatherData[]> {
//   const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
//   const lat = 40.7128; // Default to NYC, should be user's location
//   const lon = -74.0060;
//   
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${days}&appid=${apiKey}&units=metric`
//   );
//   
//   const data = await response.json();
//   
//   return data.list.map((day: any) => ({
//     date: new Date(day.dt * 1000).toISOString().split('T')[0],
//     temp: Math.round(day.temp.day),
//     condition: mapCondition(day.weather[0].main),
//     icon: getWeatherIcon(mapCondition(day.weather[0].main)),
//   }));
// }
