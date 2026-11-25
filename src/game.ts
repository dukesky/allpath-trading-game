import {
  type Action, type Portfolio, type ScenarioData, type Series, type Slot, type StepLog, type TitleId,
  START_CASH, TARGET, buyAndHold, decisionIndices, equity, exposure, panicPete, pickTitle, rebalance,
  rulesBot, simulatePeriod, stepEmoji, windowRange
} from "./engine.ts";
import type { Scenario } from "./scenarios.ts";

export type Run = {
  scenario: Scenario;
  slot: Slot;
  series: Series;
  i0: number;
  iEnd: number;
  decisions: number[];
};

export function makeRun(scenario: Scenario, data: ScenarioData, slot: Slot): Run {
  const series = data.series[slot];
  const [i0, iEnd] = windowRange(series, data.start, data.end);
  const decisions = decisionIndices(series, scenario.steps.map((s) => s.date), i0, iEnd);
  return { scenario, slot, series, i0, iEnd, decisions };
}

export type Marker = { i: number; kind: "buy" | "sell" | "rekt" };
export type GameState = {
  run: Run;
  step: number; // index of the decision the player is looking at
  p: Portfolio;
  log: StepLog[];
  curve: number[]; // player equity per week, starting at i0
  markers: Marker[];
  done: boolean;
  wiped: boolean;
};

export const WIPED_BELOW = 100;

export function startGame(run: Run): GameState {
  return {
    run, step: 0, p: { cash: START_CASH, shares: 0, debt: 0 }, log: [], curve: [START_CASH],
    markers: [], done: false, wiped: false
  };
}

/** Index of the week the player is currently at. */
export const nowIndex = (g: GameState) => (g.done ? g.run.i0 + g.curve.length - 1 : g.run.decisions[g.step]);

export function applyAction(g: GameState, action: Action): GameState {
  const { run } = g;
  const close = run.series.close;
  const i = run.decisions[g.step];
  const next = g.step + 1 < run.decisions.length ? run.decisions[g.step + 1] : run.iEnd;
  const price = close[i];
  const expBefore = exposure(g.p, price);
  const target = TARGET[action];
  const p = target === null ? g.p : rebalance(g.p, price, target);
  const expAfter = exposure(p, price);
  const markers = [...g.markers];
  if (expAfter > expBefore + 0.01) markers.push({ i, kind: "buy" });
  if (expAfter < expBefore - 0.01) markers.push({ i, kind: "sell" });

  const res = simulatePeriod(p, close, i, next);
  const eqBefore = equity(p, price);
  const eqAfter = equity(res.p, close[next]);
  if (res.liquidatedAt !== null) markers.push({ i: res.liquidatedAt, kind: "rekt" });

  const log: StepLog[] = [...g.log, {
    action, expBefore, expAfter, equityBefore: eqBefore, equityAfter: Math.max(0, eqAfter),
    assetMove: close[next] / price - 1, liquidated: res.liquidatedAt !== null,
    mark: run.scenario.steps[g.step]?.mark
  }];
  const wiped = eqAfter < WIPED_BELOW;
  const done = wiped || next >= run.iEnd;
  return { ...g, p: res.p, log, curve: [...g.curve, ...res.curve], markers, step: g.step + 1, done, wiped };
}

export type Summary = {
  finalEq: number;
  ret: number;
  bh: number[];
  pete: number[];
  bot: number[];
  peteTrades: number;
  botTrades: number;
  title: TitleId;
  emojis: string;
  assetRet: number;
};

export function summarize(g: GameState): Summary {
  const { run } = g;
  const close = run.series.close;
  const bh = buyAndHold(close, run.i0, run.iEnd);
  const pete = panicPete(close, run.i0, run.iEnd);
  const bot = rulesBot(close, run.i0, run.iEnd);
  const finalEq = g.curve[g.curve.length - 1];
  return {
    finalEq, ret: finalEq / START_CASH - 1, bh, pete: pete.curve, bot: bot.curve,
    peteTrades: pete.trades, botTrades: bot.trades,
    title: pickTitle(g.log, finalEq, bh[bh.length - 1]),
    emojis: g.log.map(stepEmoji).join(""),
    assetRet: close[run.iEnd] / close[run.i0] - 1
  };
}

/** Recent asset move into the current decision (for the hype-guru tip and mood art). */
export function recentMove(g: GameState, weeks = 6): number {
  const i = nowIndex(g);
  const j = Math.max(g.run.i0, i - weeks);
  return g.run.series.close[i] / g.run.series.close[j] - 1;
}

export function drawdownFromPeak(g: GameState): number {
  const i = nowIndex(g);
  const c = g.run.series.close;
  let peak = 0;
  for (let k = Math.max(0, g.run.i0 - 52); k <= i; k++) peak = Math.max(peak, c[k]);
  return c[i] / peak - 1;
}

export function vsTrend(g: GameState): number {
  const i = nowIndex(g);
  const c = g.run.series.close;
  const w = c.slice(Math.max(0, i - 39), i + 1);
  return c[i] / (w.reduce((a, b) => a + b, 0) / w.length) - 1;
}
