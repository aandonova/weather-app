export interface OWForecastResponse {
  cod: string;
  list: OWForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export interface OWForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

export interface DailySummary {
  dateKey: string;
  label: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

export interface HourSlot {
  dt: number;
  dt_txt: string;
  temp: number;
  icon: string;
  description: string;
  wind: number;
  humidity: number;
}