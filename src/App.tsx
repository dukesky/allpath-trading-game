import { useEffect, useMemo, useRef, useState } from "react";
import rawData from "./data/prices.json";
import { SCENARIOS, type Scenario } from "./scenarios.ts";
import { type Action, type ScenarioData, type Slot, START_CASH, exposure, equity, verdict } from "./engine.ts";
import {
  type GameState, type Run, applyAction, drawdownFromPeak, makeRun, nowIndex, recentMove, startGame, summarize, vsTrend
} from "./game.ts";
import { ACTIONS, PERSONAS, type Lang, type PersonaId, SLOT_EMOJI, TITLES, UI, guruTip, tr } from "./i18n.ts";
import { EquityChart, PriceChart } from "./Chart.tsx";
import { drawShareCard } from "./shareCard.ts";

const DATA = rawData as Record<string, ScenarioData>;
const BASE = import.meta.env.BASE_URL;
const SITE = "https://trading.all-path.com";
const GAME_URL = `${SITE}/game`;

const ART_FALLBACK: Record<string, string> = {
  hero: "🥬", "persona-leek": "🥬", "persona-guru": "📱", "persona-pro": "🧑‍💼", "mood-moon": "🚀",
  "mood-calm": "🍵", "mood-panic": "😱", "mood-rekt": "✂️", "mood-cash": "🏖️", "mood-diamond": "💎",
  robot: "🤖", whale: "🐋"
};

function Art({ name, className = "", alt = "" }: { name: string; className?: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [name]);
  if (failed)
    return (
      <div className={`art art-fallback ${className}`} aria-hidden={!alt}>
        <span>{ART_FALLBACK[name] ?? "🥬"}</span>
      </div>
    );
  return <img className={`art ${className}`} src={`${BASE}art/${name}.webp`} alt={alt} onError={() => setFailed(true)} />;
}

const money = (x: number) =>
  "$" + Math.round(x).toLocaleString("en-US");
const tone = (x: number) => (Math.abs(x) < 0.005 ? "flat" : x > 0 ? "up" : "down");
const pct = (x: number, digits = 0) => `${x >= 0 ? "+" : "−"}${Math.abs(x * 100).toFixed(digits)}%`;

type Screen =
  | { kind: "title" }
  | { kind: "persona" }
  | { kind: "asset"; scenario: Scenario }
  | { kind: "play" }
  | { kind: "guess" }
  | { kind: "result" };

function readParams(): { code?: number; slot?: Slot } {
  const q = new URLSearchParams(window.location.search);
  const code = Number(q.get("s"));
  const slot = q.get("a") as Slot | null;
  return {
    code: SCENARIOS.some((s) => s.code === code) ? code : undefined,
    slot: slot && ["index", "tech", "spicy"].includes(slot) ? slot : undefined
  };
}

function loadLang(): Lang {
  try {
    const saved = localStorage.getItem("bagsim-lang");
    if (saved === "en" || saved === "zh") return saved;
  } catch { /* storage blocked */ }
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function loadPlayed(): string[] {
  try { return JSON.parse(localStorage.getItem("bagsim-played") ?? "[]"); } catch { return []; }
}

function randomScenario(exclude?: string): Scenario {
  const played = loadPlayed();
  let pool = SCENARIOS.filter((s) => !played.includes(s.id) && s.id !== exclude);
  if (!pool.length) pool = SCENARIOS.filter((s) => s.id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function App() {
  const [lang, setLang] = useState<Lang>(loadLang);
  const [screen, setScreen] = useState<Screen>({ kind: "title" });
  const [persona, setPersona] = useState<PersonaId>("leek");
  const [game, setGame] = useState<GameState | null>(null);
  const [guess, setGuess] = useState<string | null>(null);
  const params = useMemo(readParams, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.lang = lang;
    document.title = `${tr(UI.title, lang)} · AllPath`;
    try { localStorage.setItem("bagsim-lang", lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [screen.kind]);

  const t = (l: { en: string; zh: string }) => tr(l, lang);

  const begin = (scenario: Scenario, slot: Slot) => {
    setGame(startGame(makeRun(scenario, DATA[scenario.id], slot)));
    setGuess(null);
    setScreen({ kind: "play" });
  };

  // A shared link (?s=<code>&a=<slot>) fixes the first scenario so friends play the same one.
  const [deepLink, setDeepLink] = useState(params);
  const choosePersona = (p: PersonaId) => {
    setPersona(p);
    const fixed = deepLink.code ? SCENARIOS.find((s) => s.code === deepLink.code) : undefined;
    if (fixed) {
      setDeepLink({});
      if (deepLink.slot) return begin(fixed, deepLink.slot);
      return setScreen({ kind: "asset", scenario: fixed });
    }
    setScreen({ kind: "asset", scenario: randomScenario() });
  };

  const finish = (g: GameState) => {
    try {
      const played = new Set(loadPlayed());
      played.add(g.run.scenario.id);
      localStorage.setItem("bagsim-played", JSON.stringify([...played]));
    } catch { /* ignore */ }
    setScreen({ kind: "guess" });
  };

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href={SITE}>
          <img src={`${BASE}allpath-mark.png`} alt="" width={28} height={28} />
          <span>AllPath</span>
        </a>
        <button className="chip" onClick={() => setLang(lang === "en" ? "zh" : "en")}>
          {t(UI.lang)}
        </button>
      </header>

      {screen.kind === "title" && <TitleScreen t={t} onPlay={() => setScreen({ kind: "persona" })} />}
      {screen.kind === "persona" && (
        <PersonaScreen t={t} onPick={choosePersona} onBack={() => setScreen({ kind: "title" })} />
      )}
      {screen.kind === "asset" && (
        <AssetScreen t={t} scenario={screen.scenario} onPick={(slot) => begin(screen.scenario, slot)} onBack={() => setScreen({ kind: "persona" })} />
      )}
      {screen.kind === "play" && game && (
        <PlayScreen
          t={t}
          lang={lang}
          game={game}
          persona={persona}
          onAct={(a) => setGame(applyAction(game, a))}
          onFinish={() => finish(game)}
          onQuit={() => setScreen({ kind: "title" })}
        />
      )}
      {screen.kind === "guess" && game && (
        <GuessScreen t={t} scenario={game.run.scenario} guess={guess} onGuess={setGuess} onNext={() => setScreen({ kind: "result" })} />
      )}
      {screen.kind === "result" && game && (
        <ResultScreen
          t={t}
          lang={lang}
          game={game}
          guessedRight={guess === game.run.scenario.id}
          onAgain={() => setScreen({ kind: "asset", scenario: randomScenario(game.run.scenario.id) })}
          onRetry={() => begin(game.run.scenario, game.run.slot)}
        />
      )}
      <footer className="foot">{t(UI.disclaimer)}</footer>
    </div>
  );
}

type T = (l: { en: string; zh: string }) => string;

function TitleScreen({ t, onPlay }: { t: T; onPlay: () => void }) {
  return (
    <main className="screen title-screen">
      <Art name="hero" className="hero-art" alt="A nervous leek trader at a desk while a whale in a suit holds a sickle behind it" />
      <h1 className="game-title">{t(UI.title)}</h1>
      <p className="lede">{t(UI.tagline)}</p>
      <button className="btn btn-primary btn-big" onClick={onPlay}>{t(UI.play)}</button>
      <section className="panel how">
        <h2>{t(UI.howTitle)}</h2>
        <ol>
          {UI.how.map((h, k) => <li key={k}>{t(h)}</li>)}
        </ol>
      </section>
    </main>
  );
}

function PersonaScreen({ t, onPick, onBack }: { t: T; onPick: (p: PersonaId) => void; onBack: () => void }) {
  return (
    <main className="screen">
      <button className="link-back" onClick={onBack}>← {t(UI.back)}</button>
      <h2 className="screen-h">{t(UI.pickPersona)}</h2>
      <div className="stack">
        {(Object.keys(PERSONAS) as PersonaId[]).map((id) => {
          const p = PERSONAS[id];
          return (
            <button key={id} className="pick-card" onClick={() => onPick(id)}>
              <Art name={p.art} className="pick-art" />
              <span className="pick-text">
                <strong>{t(p.name)}</strong>
                <span>{t(p.desc)}</span>
                <em>{t(p.sees)}</em>
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}

function AssetScreen({ t, scenario, onPick, onBack }: { t: T; scenario: Scenario; onPick: (s: Slot) => void; onBack: () => void }) {
  return (
    <main className="screen">
      <button className="link-back" onClick={onBack}>← {t(UI.back)}</button>
      <p className="scenario-tag">{t(UI.scenarioN)}{scenario.code} · ???</p>
      <h2 className="screen-h">{t(UI.pickAsset)}</h2>
      <div className="stack">
        {(["index", "tech", "spicy"] as Slot[]).map((slot) => (
          <button key={slot} className={`pick-card asset-${slot}`} onClick={() => onPick(slot)}>
            <span className="asset-emoji" aria-hidden>{SLOT_EMOJI[slot]}</span>
            <span className="pick-text">
              <strong>{t(scenario.assets[slot].hidden).replace(/^🌶️\s*/, "")}</strong>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}

function moodFor(g: GameState): string {
  const last = g.log[g.log.length - 1];
  if (!last) return "mood-calm";
  if (last.liquidated) return "mood-rekt";
  const ch = last.equityBefore > 0 ? last.equityAfter / last.equityBefore - 1 : 0;
  if (last.expAfter === 0) return last.assetMove > 0.08 ? "mood-panic" : "mood-cash";
  if (ch > 0.08) return "mood-moon";
  if (ch < -0.08) return "mood-panic";
  return "mood-calm";
}

function PlayScreen(props: {
  t: T; lang: Lang; game: GameState; persona: PersonaId;
  onAct: (a: Action) => void; onFinish: () => void; onQuit: () => void;
}) {
  const { t, lang, game, persona, onAct, onFinish, onQuit } = props;
  const { run } = game;
  const sc = run.scenario;
  const iNow = nowIndex(game);
  const price = run.series.close[iNow];
  const eq = Math.max(0, equity(game.p, price));
  const ex = exposure(game.p, price);
  const last = game.log[game.log.length - 1];
  const prevNow = game.step > 0 ? run.decisions[game.step - 1] : run.i0;
  const [skip, setSkip] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const act = (a: Action) => {
    if (busy) return;
    const next = game.step + 1 < run.decisions.length ? run.decisions[game.step + 1] : run.iEnd;
    setBusy(true);
    setSkip(next - run.decisions[game.step]);
    timer.current = window.setTimeout(() => {
      onAct(a);
      setSkip(null);
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  const step = sc.steps[game.step];
  const move = recentMove(game, 4);

  return (
    <main className="screen play">
      <div className="play-head">
        <button className="link-back" onClick={onQuit}>✕ {t(UI.quit)}</button>
        <span className="scenario-tag">{t(UI.scenarioN)}{sc.code} · {SLOT_EMOJI[run.slot]}</span>
      </div>
      <div className="pips" aria-label={`${t(UI.round)} ${Math.min(game.step + 1, run.decisions.length)} ${t(UI.of)} ${run.decisions.length}`}>
        {run.decisions.map((_, k) => (
          <span key={k} className={`pip ${k < game.step ? "done" : k === game.step && !game.done ? "now" : ""}`} />
        ))}
      </div>

      {last && (
        <div className={`move-banner ${last.liquidated ? "rekt" : ""}`} role="status">
          <span>⏩ {run.decisions[game.step - 1] !== undefined ? (iNow - run.decisions[game.step - 1]) : ""} {t(UI.weeksLater)}</span>
          <span>{t(UI.assetMoved)} <b className={tone(last.assetMove)}>{pct(last.assetMove)}</b></span>
          <span>{t(UI.youRound)} <b className={tone(last.equityBefore > 0 ? last.equityAfter / last.equityBefore - 1 : 0)}>{pct(last.equityBefore > 0 ? last.equityAfter / last.equityBefore - 1 : 0)}</b></span>
          {last.liquidated && <p className="rekt-line">💀 {t(UI.liquidated)}</p>}
        </div>
      )}

      {game.done ? (
        <section className="panel end-panel">
          <Art name={game.wiped ? "mood-rekt" : moodFor(game)} className="end-art" />
          {game.wiped && <h2>{t(UI.wipedTitle)}</h2>}
          {game.wiped && <p>{t(UI.wipedBody)}</p>}
          <p className="big-number">{money(eq)}</p>
          <p className="end-total">{t(UI.totalReturn)} <span className={tone(eq / START_CASH - 1)}>{pct(eq / START_CASH - 1)}</span></p>
          <button className="btn btn-primary btn-big" onClick={onFinish}>{t(UI.seeResult)}</button>
        </section>
      ) : (
        <>
          <section className="manga">
            <Art name={moodFor(game)} className="manga-art" />
            <div className="manga-text">
              <span className="manga-tag">{t(UI.news)}</span>
              <p>{t(step.headline)}</p>
            </div>
          </section>

          {persona !== "pro" && (
            <div className="bubble">
              <span className="bubble-who">{t(UI.feed)}</span>
              {t(step.feed)}
            </div>
          )}
          {persona === "guru" && (
            <div className="bubble guru">
              <span className="bubble-who">📱 {t(UI.guruSays)}</span>
              {t(guruTip(move, game.step * 7 + sc.code))}
            </div>
          )}
          {persona === "pro" && (
            <div className="terminal">
              <span className="bubble-who">{t(UI.data)}</span>
              <div className="term-row">
                <span>{t(UI.fromPeak)}</span><b className={drawdownFromPeak(game) < -0.005 ? "down" : ""}>{pct(drawdownFromPeak(game), 1)}</b>
                <span>{t(UI.vsTrend)}</span><b className={vsTrend(game) >= 0 ? "up" : "down"}>{pct(vsTrend(game), 1)}</b>
              </div>
              <p>{t(step.pro)}</p>
            </div>
          )}

          <section className="panel chart-panel">
            <div className="chart-title">{SLOT_EMOJI[run.slot]} {t(sc.assets[run.slot].hidden).replace(/^🌶️\s*/, "")}</div>
            <PriceChart close={run.series.close} i0={run.i0} iNow={iNow} iEnd={run.iEnd} markers={game.markers} prevNow={prevNow} />
          </section>

          <section className="wallet">
            <div><span>{t(UI.total)}</span><b>{money(eq)}</b></div>
            <div><span>{t(UI.invested)}</span><b>{Math.round(ex * 100)}%</b></div>
            <div><span>{t(UI.pnl)}</span><b className={tone(eq / START_CASH - 1)}>{pct(eq / START_CASH - 1)}</b></div>
          </section>

          <section className="actions" aria-label="Your move">
            {ACTIONS.map((a) => {
              const isHoldAtStart = a.id === "hold" && game.step === 0;
              const label = isHoldAtStart ? { en: "Wait in cash", zh: "先观望" } : a.label;
              const emoji = isHoldAtStart ? "🪑" : a.emoji;
              return (
                <button key={a.id} className={`act act-${a.id}`} disabled={busy} onClick={() => act(a.id)}>
                  <span className="act-emoji" aria-hidden>{emoji}</span>
                  <span className="act-label">{t(label)}</span>
                  <span className="act-sub">{t(a.sub)}</span>
                </button>
              );
            })}
          </section>
        </>
      )}

      {skip !== null && (
        <div className="skip" aria-live="polite">
          <span>⏩ {skip} {lang === "zh" ? "周" : "weeks"} {t(UI.timeSkip)}</span>
        </div>
      )}
    </main>
  );
}

function GuessScreen({ t, scenario, guess, onGuess, onNext }: {
  t: T; scenario: Scenario; guess: string | null; onGuess: (id: string) => void; onNext: () => void;
}) {
  const options = useMemo(() => {
    const others = SCENARIOS.filter((s) => s.id !== scenario.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others, scenario].sort(() => Math.random() - 0.5);
  }, [scenario]);
  return (
    <main className="screen">
      <h2 className="screen-h">{t(UI.guessTitle)}</h2>
      <div className="stack">
        {options.map((o) => {
          const state = guess === null ? "" : o.id === scenario.id ? "right" : o.id === guess ? "wrong" : "dim";
          return (
            <button key={o.id} className={`guess ${state}`} disabled={guess !== null} onClick={() => onGuess(o.id)}>
              {t(o.title)}
            </button>
          );
        })}
      </div>
      {guess !== null && (
        <>
          <p className="guess-msg">{guess === scenario.id ? `🎯 ${t(UI.correct)}` : `🙃 ${t(UI.wrong)}`}</p>
          <button className="btn btn-primary btn-big" onClick={onNext}>{t(UI.continue)}</button>
        </>
      )}
    </main>
  );
}

const shareUrl = (run: Run) => `${GAME_URL}?s=${run.scenario.code}&a=${run.slot}`;

function shareText(t: T, run: Run, emojis: string, ret: number, bh: number, bot: number, titleName: string) {
  return [
    `🥬 ${t(UI.title)} · ${t(UI.scenarioN)}${run.scenario.code} ${SLOT_EMOJI[run.slot]}`,
    `${emojis}`,
    `${t(UI.you)}: ${pct(ret)} | ${t({ en: "Do nothing", zh: "躺平" })}: ${pct(bh)} | 🤖 ${pct(bot)}`,
    `"${titleName}"`,
    t(UI.shareLine)
  ].join("\n");
}

function ResultScreen(props: {
  t: T; lang: Lang; game: GameState; guessedRight: boolean; onAgain: () => void; onRetry: () => void;
}) {
  const { t, lang, game, onAgain, onRetry } = props;
  const s = useMemo(() => summarize(game), [game]);
  const sc = game.run.scenario;
  const title = TITLES[s.title];
  const [copied, setCopied] = useState(false);
  const bhRet = s.bh[s.bh.length - 1] / START_CASH - 1;
  const peteRet = s.pete[s.pete.length - 1] / START_CASH - 1;
  const botRet = s.bot[s.bot.length - 1] / START_CASH - 1;
  const rows = [
    { key: "you", label: `🥬 ${t(UI.you)}`, ret: s.ret },
    { key: "bh", label: `🗿 ${t(UI.bh)}`, ret: bhRet },
    { key: "pete", label: `😱 ${t(UI.pete)}`, ret: peteRet },
    { key: "bot", label: `🤖 ${t(UI.bot)}`, ret: botRet }
  ].sort((a, b) => b.ret - a.ret);
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.ret)), 0.01);

  // Pre-render the result card so the share sheet opens within the tap (iOS needs that).
  const [card, setCard] = useState<File | null>(null);
  useEffect(() => {
    let alive = true;
    drawShareCard({
      lang, artUrl: `${BASE}art/${title.art}.webp`, gameTitle: t(UI.title),
      scenarioLine: `${t(UI.scenarioN)}${sc.code} ${SLOT_EMOJI[game.run.slot]}`,
      titleName: t(title.name), titleDesc: t(title.desc), finalEq: s.finalEq, ret: s.ret,
      bhLabel: `🗿 ${t({ en: "Do nothing", zh: "躺平" })}`, bhRet, botLabel: "🤖", botRet,
      emojis: s.emojis, challenge: t(UI.shareLine), url: shareUrl(game.run)
    }).then((blob) => {
      if (alive && blob) setCard(new File([blob], "bagholder-simulator.png", { type: "image/png" }));
    });
    return () => { alive = false; };
  }, [lang, s, sc.code, game.run, title, bhRet, botRet]); // eslint-disable-line react-hooks/exhaustive-deps

  const cardUrl = useMemo(() => (card ? URL.createObjectURL(card) : null), [card]);
  useEffect(() => () => { if (cardUrl) URL.revokeObjectURL(cardUrl); }, [cardUrl]);
  const isPhone = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const doShare = async () => {
    const text = shareText(t, game.run, s.emojis, s.ret, bhRet, botRet, t(title.name));
    const url = shareUrl(game.run);
    try {
      if (navigator.share && isPhone) {
        if (card && navigator.canShare?.({ files: [card] })) {
          await navigator.share({ files: [card], text: `${text} ${url}` });
        } else {
          await navigator.share({ text, url });
        }
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch { /* user cancelled */ }
  };
  const saveCard = () => {
    if (!card) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(card);
    a.download = card.name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  return (
    <main className="screen result">
      <section className="panel title-card">
        <Art name={title.art} className="title-art" />
        <p className="title-name">{t(title.name)}</p>
        <p className="title-desc">{t(title.desc)}</p>
        <p className="big-number">
          {money(START_CASH)} → <span className={s.ret >= 0 ? "up" : "down"}>{money(s.finalEq)}</span>
        </p>
        <p className="emoji-row" aria-label="Round by round">{s.emojis}</p>
      </section>

      <section className="panel reveal">
        <Art name={`sc-${sc.id}`} className="reveal-art" />
        <p className="reveal-k">{t(UI.itWas)}</p>
        <h2>{t(sc.title)}</h2>
        <p className="reveal-period">{t(sc.period)}</p>
        <p><b>{t(UI.youTraded)}{t({ en: ": ", zh: "：" })}</b> {game.run.slot === "spicy" ? t(sc.assets.spicy.reveal) : t(sc.assets[game.run.slot].reveal)} ({t({ en: "this game: ", zh: "本局区间 " })}{pct(s.assetRet)})</p>
        <p><b>{t(UI.howOften)}</b>{" "} {t(sc.rarity)}</p>
      </section>

      <section className="panel">
        <h3>{t(UI.scoreboard)}</h3>
        <ul className="board">
          {rows.map((r) => (
            <li key={r.key} className={`row-${r.key}`}>
              <span className="board-label">{r.label}</span>
              <span className="board-bar">
                <i className={r.ret >= 0 ? "pos" : "neg"} style={{ width: `${(Math.abs(r.ret) / maxAbs) * 100}%` }} />
              </span>
              <b className={r.ret >= 0 ? "up" : "down"}>{pct(r.ret)}</b>
            </li>
          ))}
        </ul>
        <EquityChart lines={[
          { values: s.bh, cls: "eq-bh" },
          { values: s.pete, cls: "eq-pete" },
          { values: s.bot, cls: "eq-bot" },
          { values: game.curve, cls: "eq-you" }
        ]} />
        <p className="legend"><i className="lg-you" />{t(UI.you)} <i className="lg-bh" />🗿 <i className="lg-pete" />😱 <i className="lg-bot" />🤖</p>
      </section>

      <section className="panel">
        <h3>{t(UI.replay)}</h3>
        <ol className="replay">
          {game.log.map((l, k) => {
            const step = sc.steps[k];
            const a = ACTIONS.find((x) => x.id === l.action)!;
            const v = verdict(l);
            const first = t(step.headline).split(/(?<=[.!?。！？])\s*/)[0];
            return (
              <li key={k} className={`rp rp-${v}`}>
                <div className="rp-head">
                  <span className="rp-v" aria-hidden>{v === "good" ? "👍" : v === "bad" ? "🤦" : "😐"}</span>
                  <span className="rp-what">{a.emoji} {t(k === 0 && l.action === "hold" ? { en: "Waited in cash", zh: "先观望" } : a.label)}</span>
                  <span className="rp-next">{t(UI.nextMove)} <b className={l.assetMove >= 0 ? "up" : "down"}>{pct(l.assetMove)}</b></span>
                </div>
                <p className="rp-news">{first}</p>
                {step.hindsight && <p className="rp-hind">🔮 {t(step.hindsight)}</p>}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="panel">
        <h3>{t(UI.lessons)}</h3>
        <ul className="lessons">
          {sc.lessons.map((l, k) => <li key={k}>{t(l)}</li>)}
        </ul>
      </section>

      <div className="result-actions">
        <button className="btn btn-primary btn-big" onClick={doShare}>{copied ? t(UI.copied) : t(UI.share)}</button>
        <button className="btn" onClick={saveCard} disabled={!card}>🖼️ {t(UI.saveCard)}</button>
        {cardUrl && <img className="card-preview" src={cardUrl} alt={t(UI.saveCard)} />}
        <button className="btn btn-big" onClick={onAgain}>🎲 {t(UI.again)}</button>
        <button className="btn btn-quiet" onClick={onRetry}>{t(UI.retry)}</button>
      </div>

      <section className="panel cta">
        <Art name="robot" className="cta-art" />
        <h3>{t(UI.ctaTitle)}</h3>
        <p>{t(UI.ctaBody)}</p>
        {botRet < bhRet - 0.05 && <p>{t(UI.ctaRobotLost)}</p>}
        <a className="btn btn-dark" href={`${SITE}/?ref=bagsim${lang === "zh" ? "-zh" : ""}`}>{t(UI.ctaButton)}</a>
      </section>
    </main>
  );
}
