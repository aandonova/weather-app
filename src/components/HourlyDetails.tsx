import type { HourSlot } from "../types/weather";

type Props = {
  dateKey?: string;
  slots: HourSlot[];
};

function hourLabel(dtTxt: string) {
  return dtTxt.slice(11, 16); // HH:MM
}

export default function HourlyDetails({ dateKey, slots }: Props) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
        <span>Hourly (3-hour steps)</span>
        <span className="text-muted" style={{ fontWeight: 400 }}>
          {dateKey ?? ""}
        </span>
      </div>

      <div className="card-body p-0">
        {slots.length === 0 ? (
          <div className="p-3 text-muted">Select a day to see hourly details.</div>
        ) : (
          <ul className="list-group list-group-flush">
            {slots.map((s) => (
              <li
                key={s.dt}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted" style={{ width: 52 }}>
                    {hourLabel(s.dt_txt)}
                  </span>

                  <img
                    src={`/images/${s.icon}.svg`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/01d.svg";
                    }}
                    alt=""
                    width={34}
                    height={34}
                  />

                  <div className="d-flex flex-column">
                    <span className="fw-semibold" style={{ minWidth: 52 }}>
                      {Math.round(s.temp)}°C
                    </span>
                    <span className="text-muted" style={{ fontSize: 13 }}>
                      {s.description}
                    </span>
                  </div>
                </div>

                <div className="text-muted" style={{ fontSize: 12, minWidth: 90, textAlign: "right" }}>
                  💨 {Math.round(s.wind)} · 💧 {s.humidity}%
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
