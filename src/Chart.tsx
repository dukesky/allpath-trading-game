import type { Marker } from "./game.ts";

const W = 320;
const H = 150;
const PAD = 8;

function pathFor(values: number[], min: number, max: number, n: number) {
  const span = max - min || 1;
  return values
    .map((v, k) => {
      const x = PAD + (k / Math.max(1, n - 1)) * (W - 2 * PAD);
      const y = H - PAD - ((v - min) / span) * (H - 2 * PAD);
      return `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Price so far, with the unknown future left blank. Draws the newest stretch on each update. */
export function PriceChart(props: {
  close: number[];
  i0: number;
  iNow: number;
  iEnd: number;
  markers: Marker[];
  prevNow: number;
}) {
  const { close, i0, iNow, iEnd, markers, prevNow } = props;
  const lookback = Math.min(26, i0); // half a year of context before the start
  const from = i0 - lookback;
  const shown = close.slice(from, iNow + 1);
  const n = iEnd - from + 1;
  const min = Math.min(...shown) * 0.97;
  const max = Math.max(...shown) * 1.03;
  const xOf = (i: number) => PAD + ((i - from) / Math.max(1, n - 1)) * (W - 2 * PAD);
  const yOf = (v: number) => H - PAD - ((v - min) / (max - min || 1)) * (H - 2 * PAD);
  const drawFrom = Math.max(0, (prevNow - from) / Math.max(1, iNow - from));
  const startX = xOf(i0);
  const nowX = xOf(iNow);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Price chart so far">
      <rect className="chart-future" x={nowX} y={0} width={W - nowX} height={H} />
      <line className="chart-start" x1={startX} x2={startX} y1={4} y2={H - 4} />
      <path
        key={iNow}
        className="chart-line"
        d={pathFor(shown, min, max, n)}
        pathLength={1}
        style={{ ["--from" as string]: String(1 - drawFrom) }}
      />
      {markers.filter((m) => m.i <= iNow).map((m, k) => (
        <g key={k} transform={`translate(${xOf(m.i)},${yOf(close[m.i])})`} className={`mk mk-${m.kind}`}>
          {m.kind === "rekt" ? <text textAnchor="middle" dy="5">💀</text> : <circle r={5} />}
        </g>
      ))}
      <circle className="chart-now" cx={nowX} cy={yOf(close[iNow])} r={4.5} />
      <text className="chart-q" x={(nowX + W) / 2} y={H / 2 + 8} textAnchor="middle">
        {iNow < iEnd ? "?" : ""}
      </text>
    </svg>
  );
}

/** Final comparison chart: several equity curves on one scale. */
export function EquityChart(props: { lines: { values: number[]; cls: string }[] }) {
  const all = props.lines.flatMap((l) => l.values);
  const min = Math.min(...all) * 0.95;
  const max = Math.max(...all) * 1.05;
  const n = Math.max(...props.lines.map((l) => l.values.length));
  const base = H - PAD - ((10_000 - min) / (max - min || 1)) * (H - 2 * PAD);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Account value over time, you versus the benchmarks">
      {base > 0 && base < H && <line className="chart-base" x1={0} x2={W} y1={base} y2={base} />}
      {props.lines.map((l) => (
        <path key={l.cls} className={`eq ${l.cls}`} d={pathFor(l.values, min, max, n)} />
      ))}
    </svg>
  );
}
