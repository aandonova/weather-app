import { describe, it, expect } from "vitest";
import { buildDailySummaries, buildHourlySlots, hourlyForDay } from "./forecast";
import type { OWForecastResponse } from "../types/weather";

describe("utils/forecast", () => {
  it("hourlyForDay filters slots by YYYY-MM-DD prefix", () => {
    const slots = [
      {
        dt: 1,
        dt_txt: "2026-01-13 09:00:00",
        temp: 5,
        icon: "04d",
        description: "cloudy",
        wind: 3,
        humidity: 60,
      },
      {
        dt: 2,
        dt_txt: "2026-01-14 09:00:00",
        temp: 7,
        icon: "01d",
        description: "clear sky",
        wind: 2,
        humidity: 40,
      },
    ];

    const result = hourlyForDay(slots as any, "2026-01-13");
    expect(result).toHaveLength(1);
    expect(result[0].dt_txt.startsWith("2026-01-13")).toBe(true);
  });

  it("buildDailySummaries computes min/max and uses 12:00 slot as representative", () => {
    const mock: OWForecastResponse = {
      cod: "200",
      city: { name: "Sofia", country: "BG" },
      list: [
        {
          dt: 1,
          dt_txt: "2026-01-13 09:00:00",
          main: { temp: 10, humidity: 50 },
          weather: [{ description: "morning clouds", icon: "04d" }],
          wind: { speed: 3 },
        },
        {
          dt: 2,
          dt_txt: "2026-01-13 12:00:00",
          main: { temp: 14, humidity: 40 },
          weather: [{ description: "clear sky", icon: "01d" }],
          wind: { speed: 4 },
        },
        {
          dt: 3,
          dt_txt: "2026-01-14 12:00:00",
          main: { temp: 5, humidity: 60 },
          weather: [{ description: "rain", icon: "10d" }],
          wind: { speed: 6 },
        },
      ],
    } as any; 

    const hourly = buildHourlySlots(mock);
    expect(hourly).toHaveLength(3);

    const daily = buildDailySummaries(mock);

    expect(daily[0].dateKey).toBe("2026-01-13");
    expect(daily[0].minTemp).toBe(10);
    expect(daily[0].maxTemp).toBe(14);

    // Representative = 12:00 slot
    expect(daily[0].icon).toBe("01d");
    expect(daily[0].description).toBe("clear sky");
  });
});
