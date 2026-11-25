// Plays every scenario × asset with scripted player archetypes and prints outcomes.
// Run: node scripts/simulate.ts
import data from "../src/data/prices.json" with { type: "json" };
import { SCENARIOS } from "../src/scenarios.ts";
import { makeRun, startGame, applyAction, summarize, recentMove, type GameState } from "../src/game.ts";
import type { Action, ScenarioData, Slot } from "../src/engine.ts";

type Bot = { name: string; act: (g: GameState) => Action };
const BOTS: Bot[] = [
  { name: "holder", act: (g) => (g.step === 0 ? "all" : "hold") },
  { name: "leek", act: (g) => { const m = recentMove(g); return g.step === 0 ? "all" : m < -0.1 ? "cash" : m > 0.08 ? "all" : "hold"; } },
  { name: "dipbuy", act: (g) => { const m = recentMove(g); return g.step === 0 ? "half" : m < -0.1 ? "all" : m > 0.15 ? "half" : "hold"; } },
  { name: "yolo", act: () => "yolo" },
  { name: "random", act: () => (["cash", "half", "hold", "all", "yolo"] as Action[])[Math.floor(Math.random() * 5)] },
];
const pct = (x: number) => (x >= 0 ? "+" : "") + (x * 100).toFixed(0) + "%";
const titles: Record<string, number> = {};
for (const sc of SCENARIOS) {
  for (const slot of ["index", "tech", "spicy"] as Slot[]) {
    const run = makeRun(sc, (data as Record<string, ScenarioData>)[sc.id], slot);
    let line = `${sc.id.padEnd(9)} ${slot.padEnd(6)} steps=${run.decisions.length} weeks=${run.iEnd - run.i0}`;
    let first = true;
    for (const bot of BOTS) {
      let g = startGame(run);
      while (!g.done) g = applyAction(g, bot.act(g));
      const s = summarize(g);
      if (first) { line += ` | B&H ${pct(s.bh.at(-1)! / 1e4 - 1)} Pete ${pct(s.pete.at(-1)! / 1e4 - 1)} Bot ${pct(s.bot.at(-1)! / 1e4 - 1)} ||`; first = false; }
      line += ` ${bot.name} ${pct(s.ret)} ${s.emojis} ${s.title};`;
      titles[s.title] = (titles[s.title] ?? 0) + 1;
    }
    console.log(line);
  }
}
console.log(titles);
