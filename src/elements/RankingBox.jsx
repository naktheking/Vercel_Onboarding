import { useEffect, useMemo, useState } from "react";

export function RankingBox() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/getRankings");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed (${res.status})`);
        }
        const data = await res.json();
        if (!alive) return;
        setRankings(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load rankings");
        setRankings([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  const trackedCount = useMemo(() => rankings.length, [rankings]);

  return (
    <aside className="rankingBox">
      <div className="rankingHeader">
        <h2>Rankings</h2>
        <p>
          <i>Top Ranked of Being Clocked, lock in fam</i>
        </p>
      </div>

      <div className="rankingMeta">
        <p>
          <i>
            Tracking: <b>{trackedCount}</b> name{trackedCount === 1 ? "" : "s"}
          </i>
        </p>
      </div>

      <div className="rankingList" aria-label="ranking list">
        {loading ? (
          <p style={{ opacity: 0.8 }}>Loading…</p>
        ) : error ? (
          <p style={{ opacity: 0.8 }}>{error}</p>
        ) : rankings.length === 0 ? (
          <p style={{ opacity: 0.8 }}>
            No rankings configured yet.
          </p>
        ) : (
          rankings.map((row, idx) => (
            <div className="rankingRow" key={row.name}>
              <div className="rankingLeft">
                <span className="rankingRank">{idx + 1}</span>
                <span className="rankingName">{row.name}</span>
              </div>
              <span className="rankingCount">{row.count}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

