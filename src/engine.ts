// Pure game math: no React, no data imports, so it runs in tests and the simulator.

export type Slot = "index" | "tech" | "spicy";
export type Series = { ticker: string; dates: string[]; close: number[] };
export type ScenarioData = { start: string; end: string; series: Record<Slot, Series> };

export type Action = "cash" | "half" | "hold" | "all" | "yolo";
export const TARGET: Record<Action, number | null> = { cash: 0, half: 0.5, hold: null, all: 1, yolo: 2 };

export const START_CASH = 10_000;
const MARGIN_RATE_WEEKLY = 0.08 / 52; // 8%/yr broker margin interest
const MAINTENANCE = 0.25; // equity must stay >= 25% of the position

export type Portfolio = { cash: number; shares: number; debt: number };

export const equity = (p: Portfolio, price: number) => p.cash + p.shares * price - p.debt;
export const exposure = (p: Portfolio, price: number) => {
  const eq = equity(p, price);
  return eq <= 0 ? 0 : (p.shares * price) / eq;
};

export function rebalance(p: Portfolio, price: number, target: number): Portfolio {
  const eq = Math.max(0, equity(p, price));
  const pos = target * eq;
  return pos > eq
    ? { cash: 0, shares: pos / price, debt: pos - eq }
    : { cash: eq - pos, shares: pos / price, debt: 0 };
}

export type PeriodResult = { p: Portfolio; curve: number[]; liquidatedAt: number | null };

/** Walk week by week from index i0 (exclusive) to i1 (inclusive), checking margin each week. */
export function simulatePeriod(p0: Portfolio, close: number[], i0: number, i1: number): PeriodResult {
  let p = { ...p0 };
  const curve: number[] = [];
  let liquidatedAt: number | null = null;
  for (let i = i0 + 1; i <= i1; i++) {
    const price = close[i];
    if (p.debt > 0) p.debt *= 1 + MARGIN_RATE_WEEKLY;
    const pos = p.shares * price;
    const eq = p.cash + pos - p.debt;
    if (p.debt > 0 && eq < MAINTENANCE * pos) {
      p = { cash: Math.max(0, eq), shares: 0, debt: 0 };
      liquidatedAt = i;
    }
    curve.push(Math.max(0, equity(p, price)));
  }
  return { p, curve, liquidatedAt };
}

/** Index range of the scenario window inside a series. */
export function windowRange(s: Series, start: string, end: string): [number, number] {
  const i0 = s.dates.findIndex((d) => d >= start);
  let iEnd = s.dates.length - 1;
  while (iEnd > i0 && s.dates[iEnd] > end) iEnd--;
  return [i0, iEnd];
}

/** Map step dates to strictly increasing week indices before the window end. */
export function decisionIndices(s: Series, stepDates: string[], i0: number, iEnd: number): number[] {
  const out: number[] = [];
  let prev = i0 - 1;
  for (const d of stepDates) {
    let i = s.dates.findIndex((x) => x >= d);
    if (i < 0) i = iEnd - 1;
    i = Math.max(i, prev + 1, i0);
    if (i >= iEnd) break;
    out.push(i);
    prev = i;
  }
  if (out.length) out[0] = i0; // first decision is always at the window start
  return out;
}

// ── Benchmarks (all return equity curves aligned to i0..iEnd) ──────────────

export function buyAndHold(close: number[], i0: number, iEnd: number): number[] {
  const sh = START_CASH / close[i0];
  return close.slice(i0, iEnd + 1).map((c) => sh * c);
}

/** "Panic Pete": all in, sells after a 20% drop from the peak, buys back once price is near the old high (FOMO). */
export function panicPete(close: number[], i0: number, iEnd: number): { curve: number[]; trades: number } {
  let cash = 0;
  let sh = START_CASH / close[i0];
  let peak = close[i0];
  let soldPeak = 0;
  let trades = 1;
  const curve: number[] = [];
  for (let i = i0; i <= iEnd; i++) {
    const c = close[i];
    if (sh > 0) {
      peak = Math.max(peak, c);
      if (c <= 0.8 * peak) {
        cash = sh * c; sh = 0; soldPeak = peak; trades++;
      }
    } else if (c >= 0.95 * soldPeak) {
      sh = cash / c; cash = 0; peak = c; trades++;
    }
    curve.push(cash + sh * c);
  }
  return { curve, trades };
}

/** Rules bot: hold while price closes above its 40-week (≈200-day) average, cash when below. Decided on weekly closes. */
export function rulesBot(close: number[], i0: number, iEnd: number): { curve: number[]; trades: number } {
  const ma = (i: number) => {
    const from = Math.max(0, i - 39);
    const w = close.slice(from, i + 1);
    return w.length >= 20 ? w.reduce((a, b) => a + b, 0) / w.length : -Infinity;
  };
  let cash = START_CASH;
  let sh = 0;
  let trades = 0;
  const curve: number[] = [];
  for (let i = i0; i <= iEnd; i++) {
    const c = close[i];
    const above = c > ma(i);
    if (above && sh === 0) { sh = cash / c; cash = 0; trades++; }
    else if (!above && sh > 0) { cash = sh * c; sh = 0; trades++; }
    curve.push(cash + sh * c);
  }
  return { curve, trades };
}

// ── Scoring ────────────────────────────────────────────────────────────────

export type StepLog = {
  action: Action;
  expBefore: number;
  expAfter: number;
  equityBefore: number;
  equityAfter: number;
  assetMove: number; // asset return over the following period
  liquidated: boolean;
  mark?: "top" | "bottom";
};

export type Verdict = "good" | "bad" | "meh";
export function verdict(s: StepLog): Verdict {
  if (s.liquidated) return "bad";
  if (s.assetMove > 0.03) return s.expAfter >= 0.5 ? "good" : "bad";
  if (s.assetMove < -0.03) return s.expAfter < 0.5 ? "good" : "bad";
  return "meh";
}

export function stepEmoji(s: StepLog): string {
  if (s.liquidated) return "💀";
  const ch = s.equityBefore > 0 ? s.equityAfter / s.equityBefore - 1 : 0;
  if (s.expAfter === 0 && Math.abs(ch) < 0.005) return "💤";
  if (ch >= 0.05) return "🚀";
  if (ch >= 0) return "🟩";
  if (ch > -0.05) return "🟥";
  return "💥";
}

export type TitleId =
  | "harvested" | "whale" | "fullleek" | "soldbottom" | "boughttop" | "coward" | "diamond" | "bagholder" | "soldearly" | "halfhearted" | "leek";

export function pickTitle(log: StepLog[], finalEq: number, bhFinal: number): TitleId {
  const ret = finalEq / START_CASH - 1;
  const bh = bhFinal / START_CASH - 1;
  if (finalEq < START_CASH * 0.1) return "harvested";
  const soldBottom = log.some((s) => s.mark === "bottom" && s.expAfter <= 0.5 && s.expAfter < s.expBefore - 0.2);
  // The opening buy is mandatory-ish, so a "top" on step 0 does not count against the player.
  const boughtTop = log.some((s, i) => i > 0 && s.mark === "top" && s.expAfter > s.expBefore + 0.2 && s.expAfter >= 0.5);
  if (ret > bh + 0.1) return "whale";
  if (soldBottom && boughtTop) return "fullleek";
  if (soldBottom) return "soldbottom";
  if (boughtTop) return "boughttop";
  if (log.every((s) => s.expAfter === 0)) return "coward";
  if (ret >= bh - 0.03) return ret < -0.2 ? "bagholder" : "diamond";
  if (ret >= 0.15) return "soldearly"; // made real money, but holding made more
  const bigMoves = log.filter((s, i) => i > 0 && Math.abs(s.expAfter - s.expBefore) > 0.2).length;
  return bigMoves <= 1 ? "halfhearted" : "leek";
}
