import { describe, expect, it } from "vitest";
import data from "../src/data/prices.json";
import { SCENARIOS } from "../src/scenarios.ts";
import { applyAction, makeRun, startGame, summarize } from "../src/game.ts";
import { START_CASH, equity, panicPete, pickTitle, rebalance, rulesBot, simulatePeriod, type ScenarioData } from "../src/engine.ts";

const D = data as Record<string, ScenarioData>;

describe("portfolio math", () => {
  it("rebalance keeps equity and sets exposure", () => {
    const p = rebalance({ cash: 10_000, shares: 0, debt: 0 }, 50, 1);
    expect(p.shares).toBe(200);
    expect(equity(p, 50)).toBe(10_000);
    const lev = rebalance(p, 50, 2);
    expect(lev.debt).toBe(10_000);
    expect(equity(lev, 50)).toBeCloseTo(10_000);
  });

  it("margin call liquidates when equity falls below 25% of the position", () => {
    const p = rebalance({ cash: 10_000, shares: 0, debt: 0 }, 100, 2);
    const res = simulatePeriod(p, [100, 60], 0, 1);
    expect(res.liquidatedAt).toBe(1);
    expect(res.p.shares).toBe(0);
    expect(res.curve[0]).toBeGreaterThanOrEqual(0);
  });

  it("panic pete sells after a 20% drop and the rules bot follows the trend", () => {
    const close = [...Array(30).fill(100), 120, 90, 80, 70, 120, 130];
    expect(panicPete(close, 29, close.length - 1).trades).toBeGreaterThan(1);
    expect(rulesBot(close, 29, close.length - 1).curve.length).toBe(close.length - 29);
  });
});

describe("scenarios", () => {
  it.each(SCENARIOS.map((s) => [s.id, s] as const))("%s has data, 6+ decisions and bilingual text", (id, sc) => {
    expect(D[id]).toBeDefined();
    for (const slot of ["index", "tech", "spicy"] as const) {
      const run = makeRun(sc, D[id], slot);
      expect(run.decisions.length).toBe(sc.steps.length);
      expect(run.decisions[0]).toBe(run.i0);
      let g = startGame(run);
      while (!g.done) g = applyAction(g, "hold");
      expect(g.curve.length).toBe(run.iEnd - run.i0 + 1);
      expect(summarize(g).finalEq).toBe(START_CASH); // never invested
    }
    for (const st of sc.steps) {
      expect(st.headline.en && st.headline.zh && st.feed.zh && st.pro.zh).toBeTruthy();
    }
  });

  it("codes are unique", () => {
    expect(new Set(SCENARIOS.map((s) => s.code)).size).toBe(SCENARIOS.length);
  });
});

describe("titles", () => {
  const base = { equityBefore: 1, equityAfter: 1, assetMove: 0, liquidated: false } as const;
  it("selling the marked bottom is called out", () => {
    const log = [
      { ...base, action: "all" as const, expBefore: 0, expAfter: 1 },
      { ...base, action: "cash" as const, expBefore: 1, expAfter: 0, mark: "bottom" as const }
    ];
    expect(pickTitle(log, 8000, 9000)).toBe("soldbottom");
  });
  it("a big winner who trailed buy-and-hold sold too early", () => {
    const log = [{ ...base, action: "all" as const, expBefore: 0, expAfter: 1 }, { ...base, action: "cash" as const, expBefore: 1, expAfter: 0 }];
    expect(pickTitle(log, 67_669, 114_000)).toBe("soldearly");
  });
  it("wiped accounts are harvested", () => {
    expect(pickTitle([], 50, 9000)).toBe("harvested");
  });
});

describe("asset-specific marks", () => {
  it("buying the meme-stock peak week only counts as 'bought the top' for the meme stock", () => {
    const sc = SCENARIOS.find((s) => s.id === "meme")!;
    const play = (slot: "tech" | "spicy") => {
      let g = startGame(makeRun(sc, D.meme, slot));
      for (const a of ["half", "half", "all"] as const) g = applyAction(g, a);
      return g.log[2].mark;
    };
    expect(play("spicy")).toBe("top");
    expect(play("tech")).toBeUndefined();
  });
});
