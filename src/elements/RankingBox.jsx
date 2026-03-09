import { useMemo, useState } from "react";

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseNames(text) {
  const raw = text
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Set();
  const out = [];
  for (const name of raw) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}

export function RankingBox({ messages }) {
  const [namesText, setNamesText] = useState("");

  const names = useMemo(() => parseNames(namesText), [namesText]);

  const rankings = useMemo(() => {
    const safeMessages = Array.isArray(messages) ? messages : [];

    const counts = names.map((name) => {
      const re = new RegExp(`\\b${escapeRegExp(name)}\\b`, "i");
      let count = 0;
      for (const msg of safeMessages) {
        const hay = `${msg?.person ?? ""} ${msg?.message ?? ""}`;
        if (re.test(hay)) count += 1;
      }
      return { name, count };
    });

    counts.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return counts;
  }, [messages, names]);

  return (
    <aside className="rankingBox">
      <div className="rankingHeader">
        <h2>Rankings</h2>
        <p>
          <i>Paste names (comma or newline separated)</i>
        </p>
      </div>

      <textarea
        className="rankingInput"
        value={namesText}
        onChange={(e) => setNamesText(e.target.value)}
        placeholder={"e.g.\nAlice\nBob\nCharlie"}
        rows={6}
      />

      <div className="rankingMeta">
        <p>
          <i>
            Tracking: <b>{names.length}</b> name{names.length === 1 ? "" : "s"}
          </i>
        </p>
      </div>

      <div className="rankingList" aria-label="ranking list">
        {names.length === 0 ? (
          <p style={{ opacity: 0.8 }}>
            Add some names above to see who appears most in your quotes.
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

