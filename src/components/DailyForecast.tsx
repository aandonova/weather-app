import type { DailySummary } from "../types/weather";

type Props = {
  days: DailySummary[];
  selected?: string;
  onSelect: (dateKey: string) => void;
};

export default function DailyForecast({ days, selected, onSelect }: Props) {
  return (
    <div className="d-flex flex-column gap-2">
      {days.map((d) => {
        const isActive = selected === d.dateKey;

        return (
          <button
            key={d.dateKey}
            type="button"
            className={`card text-start border-0 shadow-sm ${isActive ? "bg-primary text-white" : ""}`}
            onClick={() => onSelect(d.dateKey)}
            style={{
              cursor: "pointer",
              transition: "transform .12s ease, box-shadow .12s ease",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={`/images/${d.icon}.svg`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/01d.svg";
                  }}
                  alt=""
                  width={44}
                  height={44}
                  style={{
                    filter: isActive ? "brightness(0) invert(1)" : "none",
                  }}
                />

                <div>
                  <div className="fw-semibold" style={{ fontSize: 16 }}>
                    {d.label}
                  </div>
                  <div className={isActive ? "text-white-50" : "text-muted"} style={{ fontSize: 13 }}>
                    {d.description}
                  </div>
                </div>
              </div>

              <div className="fw-semibold text-end" style={{ fontSize: 16, minWidth: 96 }}>
                {Math.round(d.minTemp)}° / {Math.round(d.maxTemp)}°
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
