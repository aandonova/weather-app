import type { DailySummary, HourSlot, OWForecastResponse } from "../types/weather";

const dayKey = (dt: string) => dt.slice(0, 10);

export function buildHourlySlots(data: OWForecastResponse): HourSlot[] {
  return data.list.map((i) => ({
    dt: i.dt,
    dt_txt: i.dt_txt,
    temp: i.main.temp,
    icon: i.weather[0].icon,
    description: i.weather[0].description,
    wind: i.wind.speed,
    humidity: i.main.humidity
  }));
}

export function buildDailySummaries(data: OWForecastResponse): DailySummary[] {
  const map = new Map<string, HourSlot[]>();

  buildHourlySlots(data).forEach((slot) => {
    const key = dayKey(slot.dt_txt);
    map.set(key, [...(map.get(key) ?? []), slot]);
  });

  return Array.from(map.entries())
    .slice(0, 5)
    .map(([key, slots]) => {
      const temps = slots.map((s) => s.temp);
      const noon =
        slots.find((s) => s.dt_txt.includes("12:00")) ??
        slots[Math.floor(slots.length / 2)];

      return {
        dateKey: key,
        label: new Date(key).toLocaleDateString(undefined, {
          weekday: "short"
        }),
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        icon: noon.icon,
        description: noon.description
      };
    });
}

export const hourlyForDay = (all: HourSlot[], day: string) =>
  all.filter((s) => s.dt_txt.startsWith(day));
