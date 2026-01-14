import type { DailySummary } from "../types/weather";

type Props = {
  city?: string;
  country?: string;
  today?: DailySummary;
};

export default function CurrentSummary({ city, country, today }: Props) {
  const icon = today?.icon ?? "01d";

  return (
    <div
      className="card border-0 shadow-sm"
      style={{ background: "linear-gradient(135deg, #ffffff 0%, #f2f6ff 100%)" }}
    >
      <div className="card-body d-flex align-items-center gap-3">
        <img
          src={`/images/${icon}.svg`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/01d.svg";
          }}
          alt="weather"
          width={96}
          height={96}
        />

        <div>
          <h4 className="mb-1">
            {city ? `${city}${country ? ", " + country : ""}` : "Weather Forecast"}
          </h4>

          {today ? (
            <>
              <div className="text-muted">{today.label}</div>
              <div className="fw-semibold" style={{ fontSize: 18 }}>
                {Math.round(today.minTemp)}°C / {Math.round(today.maxTemp)}°C
              </div>
              <div className="text-muted">{today.description}</div>
            </>
          ) : null
        }
        </div>
      </div>
    </div>
  );
}
