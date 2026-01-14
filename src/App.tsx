import { useMemo, useState } from "react";
import CitySearch from "./components/CitySearch";
import CurrentSummary from "./components/CurrentSummary";
import DailyForecast from "./components/DailyForecast";
import HourlyDetails from "./components/HourlyDetails";

import { getForecastByCity, getForecastByCoords } from "./api/ openWeather";

import { buildDailySummaries, buildHourlySlots, hourlyForDay } from "./utils/forecast";
import type { DailySummary, HourSlot, OWForecastResponse } from "./types/weather";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [raw, setRaw] = useState<OWForecastResponse | null>(null);
  const [days, setDays] = useState<DailySummary[]>([]);
  const [hourlyAll, setHourlyAll] = useState<HourSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);

  const [locationLabel, setLocationLabel] = useState<string | undefined>(undefined);

  const selectedSlots = useMemo(() => {
    if (!selectedDay) return [];
    return hourlyForDay(hourlyAll, selectedDay);
  }, [hourlyAll, selectedDay]);

  async function loadForecast(fetcher: () => Promise<OWForecastResponse>, label?: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher();
      setRaw(data);

      const daily = buildDailySummaries(data);
      const hourly = buildHourlySlots(data);

      setDays(daily);
      setHourlyAll(hourly);
      setSelectedDay(daily[0]?.dateKey);
      setLocationLabel(label ?? `${data.city.name}, ${data.city.country}`);
    } catch {
      setError("Could not load forecast. Check the city name or location permissions.");
    } finally {
      setLoading(false);
    }
  }

  const onSearchCity = (city: string) => loadForecast(() => getForecastByCity(city), city);

  const onSelectCoords = (lat: number, lon: number, label: string) =>
    loadForecast(() => getForecastByCoords(lat, lon), label);

  const onLocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by the browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        loadForecast(() => getForecastByCoords(latitude, longitude), "My location");
      },
      () => setError("Location permissions denied."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-vh-100" style={{ background: "radial-gradient(1200px 600px at 20% 0%, #eaf2ff 0%, #f6f8fc 50%, #f5f7fb 100%)",
 }}>
      <div className="container py-4" style={{ maxWidth: 1040 }}>
        <h2 className="fw-bold display-6 mb-3">Weather Forecast</h2>

        <CitySearch
          onSearchCity={onSearchCity}
          onSelectCoords={onSelectCoords}
          onLocate={onLocate}
          loading={loading}
        />

        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
        {loading && <div className="alert alert-info mt-3 mb-0">Loading…</div>}

        <div className="mt-3">
          <CurrentSummary city={raw?.city?.name} country={raw?.city?.country} today={days[0]} />
        </div>

        {days.length > 0 && (
          <div className="row g-3 align-items-stretch mt-1">
            <div className="col-12 col-md-5 d-flex">
              <div className="w-100">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white fw-semibold">
                    5-day forecast
                  </div>
                  <div className="card-body">
                    <DailyForecast
                      days={days}
                      selected={selectedDay}
                      onSelect={setSelectedDay}
                    />
                    <div className="text-muted small mt-2">
                      Select a day to see 3-hour details.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-7 d-flex">
              <div className="w-100">
                <HourlyDetails dateKey={selectedDay} slots={selectedSlots} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
