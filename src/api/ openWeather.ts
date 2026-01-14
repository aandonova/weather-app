import type { OWForecastResponse } from "../types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

if (!API_KEY) {
  throw new Error("Missing VITE_OPENWEATHER_API_KEY");
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error("Network/API error");
  return data as T;
}

export async function getForecastByCity(city: string): Promise<OWForecastResponse> {
  const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const data = await fetchJson<OWForecastResponse>(url);
  if (data.cod !== "200") throw new Error(`OpenWeather error: ${data.cod}`);
  return data;
}

export async function getForecastByCoords(lat: number, lon: number): Promise<OWForecastResponse> {
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const data = await fetchJson<OWForecastResponse>(url);
  if (data.cod !== "200") throw new Error(`OpenWeather error: ${data.cod}`);
  return data;
}

export type GeoSuggestion = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export async function searchCitySuggestions(query: string, limit = 5): Promise<GeoSuggestion[]> {
  const url = `${GEO_URL}?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  return fetchJson<GeoSuggestion[]>(url);
}
