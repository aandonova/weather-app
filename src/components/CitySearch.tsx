import { useEffect, useRef, useState } from "react";
import type { GeoSuggestion } from "../api/ openWeather";
import { searchCitySuggestions } from "../api/ openWeather";

type Props = {
  onSearchCity: (city: string) => void;
  onSelectCoords: (lat: number, lon: number, label: string) => void;
  onLocate: () => void;
  loading: boolean;
};

export default function CitySearch({
  onSearchCity,
  onSelectCoords,
  onLocate,
  loading,
}: Props) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);

  const debounceRef = useRef<number | null>(null);

  const pretty = (s: GeoSuggestion) =>
    `${s.name}${s.state ? ", " + s.state : ""}, ${s.country}`;

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        setHintLoading(true);
        const data = await searchCitySuggestions(q, 6);
        setSuggestions(data);
        setOpen(true);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setHintLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = value.trim();
    if (!city) return;
    setOpen(false);
    onSearchCity(city);
  };

  return (
    <div className="position-relative">
      <form className="d-flex flex-column flex-md-row gap-2" onSubmit={onSubmit}>
        <input
          className="form-control"
          style={{ paddingTop: 12, paddingBottom: 12, fontSize: 16 }}
          placeholder="Search city or location"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
          }}
        />

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
            disabled={loading}
          >
            Search
          </button>

          <button
            className="btn btn-outline-primary"
            style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
            disabled={loading}
            type="button"
            onClick={onLocate}
          >
            Use location
          </button>
        </div>
      </form>

      {open && (
        <div
          className="list-group position-absolute w-100 mt-2 shadow"
          style={{ zIndex: 1000, maxHeight: 260, overflowY: "auto" }}
        >
          {hintLoading && (
            <div className="list-group-item text-muted">Searching…</div>
          )}

          {!hintLoading && suggestions.length === 0 && (
            <div className="list-group-item text-muted">No suggestions.</div>
          )}

          {!hintLoading &&
            suggestions.map((s, idx) => (
              <button
                key={`${s.lat}-${s.lon}-${idx}`}
                type="button"
                className="list-group-item list-group-item-action"
                 onMouseDown={() => {
                  const label = pretty(s);
                  setValue(label);
                  setOpen(false); 
                  onSelectCoords(s.lat, s.lon, label);
                }}
              >
                {pretty(s)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
