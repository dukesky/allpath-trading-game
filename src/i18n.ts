import type { Action, Slot, TitleId } from "./engine.ts";
import type { L } from "./scenarios.ts";

export type Lang = "en" | "zh";
export const tr = (l: L, lang: Lang) => l[lang];

export type PersonaId = "leek" | "guru" | "pro";

export const UI = {
  title: { en: "Bagholder Simulator", zh: "韭菜模拟器" },
  tagline: {
    en: "Real market history. Hidden dates. You make the calls. Think you'd have bought the bottom?",
    zh: "真实历史行情，隐藏年份，你来做决定。你真觉得自己能抄到底？"
  },
  play: { en: "Start trading", zh: "开始交易" },
  howTitle: { en: "How it works", zh: "怎么玩" },
  how: [
    { en: "You get $10,000 and a secret slice of real market history.", zh: "你有 $10,000，和一段被隐藏年份的真实行情。" },
    { en: "Each round you read the news, then buy, sell or hold.", zh: "每一轮看新闻，然后买、卖或拿着不动。" },
    { en: "At the end we reveal the year, and how you did against a robot that never panics.", zh: "最后揭晓是哪一年，以及你和一个从不恐慌的机器人谁赚得多。" }
  ],
  pickPersona: { en: "Who are you?", zh: "你是谁？" },
  pickAsset: { en: "What do you want to trade?", zh: "你想交易什么？" },
  back: { en: "Back", zh: "返回" },
  quit: { en: "Quit", zh: "退出" },
  scenarioN: { en: "Scenario #", zh: "剧本 #" },
  round: { en: "Round", zh: "第" },
  roundSuffix: { en: "", zh: " 轮" },
  of: { en: "of", zh: "/" },
  total: { en: "Account", zh: "账户" },
  invested: { en: "Invested", zh: "仓位" },
  cash: { en: "Cash", zh: "现金" },
  pnl: { en: "P&L", zh: "盈亏" },
  news: { en: "Breaking", zh: "突发" },
  feed: { en: "Your feed", zh: "你的信息流" },
  guruSays: { en: "Your favorite finfluencer", zh: "你最爱的财经博主" },
  data: { en: "Terminal", zh: "终端数据" },
  fromPeak: { en: "From 1-yr high", zh: "距一年高点" },
  vsTrend: { en: "Vs 40-week trend", zh: "相对 40 周均线" },
  weeksLater: { en: "weeks later", zh: "周后" },
  timeSkip: { en: "later…", zh: "后……" },
  assetMoved: { en: "Asset", zh: "标的（本轮）" },
  you: { en: "You", zh: "你" },
  youRound: { en: "You this round", zh: "你（本轮）" },
  totalReturn: { en: "Total return", zh: "总收益" },
  liquidated: {
    en: "MARGIN CALL. Your broker sold everything at the worst price.",
    zh: "爆仓了！券商在最差的价格把你全卖了。"
  },
  wipedTitle: { en: "Account wiped out", zh: "账户清零" },
  wipedBody: { en: "Game over. The whale thanks you for your contribution.", zh: "游戏结束。大鳄感谢你的贡献。" },
  seeResult: { en: "See what happened", zh: "看看发生了什么" },
  guessTitle: { en: "Before the reveal: which era was this?", zh: "揭晓前，猜猜这是哪段历史？" },
  correct: { en: "Correct! You know your history.", zh: "猜对了！历史学得不错。" },
  wrong: { en: "Nope.", zh: "猜错了。" },
  continue: { en: "Continue", zh: "继续" },
  itWas: { en: "It was", zh: "这段行情是" },
  youTraded: { en: "You traded", zh: "你交易的是" },
  howOften: { en: "How often does this happen?", zh: "这种事多久发生一次？" },
  scoreboard: { en: "You vs. everyone", zh: "你 vs 其他人" },
  bh: { en: "Did nothing (bought & held)", zh: "躺平（买入后不动）" },
  pete: { en: "Panic Pete (sells after −20%, buys back near the high)", zh: "恐慌皮特（跌 20% 割肉，涨回高点再追）" },
  bot: { en: "Rules robot (in above the 40-week average, out below)", zh: "规则机器人（在 40 周均线上方持有，下方空仓）" },
  replay: { en: "Replay: what you did", zh: "复盘：你都做了什么" },
  nextMove: { en: "next", zh: "之后" },
  lessons: { en: "What this one teaches", zh: "这一局的教训" },
  share: { en: "Share my result", zh: "分享我的战绩" },
  copied: { en: "Copied! Paste it anywhere.", zh: "已复制！去粘贴分享吧。" },
  again: { en: "Roll a new scenario", zh: "再来一局（随机剧本）" },
  retry: { en: "Replay this one", zh: "重玩这一局" },
  ctaTitle: { en: "The robot didn't predict anything", zh: "机器人什么都没预测" },
  ctaBody: {
    en: "It followed one rule written in advance and never panicked. AllPath lets you write rules like that in plain English. Code watches them every hour, an AI agent explains what it sees, and nothing trades until you approve.",
    zh: "它只是按提前写好的一条规则执行，从不恐慌。AllPath 让你用大白话写这样的规则：代码每小时盯盘，AI 解释它看到了什么，不经你批准绝不下单。"
  },
  ctaButton: { en: "Meet the AllPath Trading Agent", zh: "了解 AllPath 交易智能体" },
  disclaimer: {
    en: "Real historical weekly prices (adjusted). For learning and fun, not financial advice. Past performance says nothing certain about the future.",
    zh: "使用真实历史周线价格（已复权）。仅供学习和娱乐，不构成投资建议。历史表现不代表未来。"
  },
  shareLine: { en: "Can you beat me?", zh: "你能赢我吗？" },
  lang: { en: "中文", zh: "EN" },
  start: { en: "Start", zh: "开局" }
} satisfies Record<string, L | L[]>;

export const PERSONAS: Record<PersonaId, { name: L; desc: L; sees: L; art: string; emoji: string }> = {
  leek: {
    name: { en: "Fresh Leek", zh: "新鲜韭菜" },
    desc: { en: "Just downloaded a trading app. Zero experience, maximum confidence.", zh: "刚下载炒股 App。零经验，满分自信。" },
    sees: { en: "Sees the news and the group chat.", zh: "能看到：新闻和群聊。" },
    art: "persona-leek",
    emoji: "🥬"
  },
  guru: {
    name: { en: "Finfluencer Follower", zh: "博主信徒" },
    desc: { en: "Paid $99 for a guru's 'premium signals' group. Trusts the guru completely.", zh: "花 99 刀进了大 V 的「付费荐股群」，对老师深信不疑。" },
    sees: { en: "Sees the news, the feed, and the guru's hot take every round.", zh: "能看到：新闻、信息流，以及老师每轮的喊单。" },
    art: "persona-guru",
    emoji: "📱"
  },
  pro: {
    name: { en: "Wall Street Pro", zh: "华尔街专业人士" },
    desc: { en: "CFA, Bloomberg terminal, three monitors. Surely that helps?", zh: "CFA 持证，彭博终端，三块屏幕。总该有点用吧？" },
    sees: { en: "Sees the news plus market data: drawdown, trend, rates, volatility.", zh: "能看到：新闻和市场数据（回撤、趋势、利率、波动率）。" },
    art: "persona-pro",
    emoji: "🧑‍💼"
  }
};

export const SLOT_EMOJI: Record<Slot, string> = { index: "📊", tech: "💻", spicy: "🌶️" };

export const ACTIONS: { id: Action; emoji: string; label: L; sub: L }[] = [
  { id: "cash", emoji: "😱", label: { en: "Sell everything", zh: "全部卖出" }, sub: { en: "0% invested", zh: "空仓" } },
  { id: "half", emoji: "✂️", label: { en: "Go half in", zh: "半仓" }, sub: { en: "50% invested", zh: "50% 仓位" } },
  { id: "hold", emoji: "🗿", label: { en: "Do nothing", zh: "躺平不动" }, sub: { en: "keep as is", zh: "保持现状" } },
  { id: "all", emoji: "🛒", label: { en: "All in", zh: "满仓" }, sub: { en: "100% invested", zh: "100% 仓位" } },
  { id: "yolo", emoji: "🚀", label: { en: "YOLO on margin", zh: "加杠杆梭哈" }, sub: { en: "200%, borrowed", zh: "两倍融资" } }
];

export const TITLES: Record<TitleId, { name: L; desc: L; art: string }> = {
  harvested: {
    name: { en: "Fully Harvested", zh: "被收割干净的韭菜" },
    desc: { en: "Your account is now a stump. The whale is having a lovely dinner.", zh: "账户只剩一个根了。大鳄今晚加餐。" },
    art: "mood-rekt"
  },
  whale: {
    name: { en: "Secret Whale (or just lucky?)", zh: "隐藏大鳄（还是运气好？）" },
    desc: { en: "You beat doing nothing by a lot. Now try to do it twice in a row.", zh: "你大幅跑赢了躺平。现在试试连续赢两次。" },
    art: "whale"
  },
  fullleek: {
    name: { en: "Professional Leek", zh: "专业韭菜" },
    desc: { en: "You bought the top AND sold the bottom. A rare double. Textbook material.", zh: "高位站岗，低位割肉，双杀达成。可以写进教科书了。" },
    art: "mood-panic"
  },
  soldbottom: {
    name: { en: "Sold the Exact Bottom", zh: "精准割在地板上" },
    desc: { en: "You sold right when the news was worst, which is exactly when the bottom happens.", zh: "你在新闻最坏的时候卖了，而底部恰恰就在那时出现。" },
    art: "mood-panic"
  },
  boughttop: {
    name: { en: "Bought the Top", zh: "山顶站岗" },
    desc: { en: "You bought more right when everyone was euphoric. Enjoy the view from up there.", zh: "你在所有人最兴奋的时候加仓。山顶风景不错吧。" },
    art: "mood-moon"
  },
  coward: {
    name: { en: "Cash Is King (Coward Edition)", zh: "现金为王（怂包版）" },
    desc: { en: "You never bought anything. Safe? Sure. You also learned nothing.", zh: "你一股都没买。安全吗？当然。但你也什么都没学到。" },
    art: "mood-cash"
  },
  diamond: {
    name: { en: "Diamond Hands", zh: "钻石手" },
    desc: { en: "You kept up with doing nothing. That's harder than it sounds.", zh: "你跟上了「躺平」的收益。这比听起来难多了。" },
    art: "mood-diamond"
  },
  soldearly: {
    name: { en: "Sold Too Early", zh: "卖飞侠" },
    desc: { en: "You made real money. Doing nothing made even more. The classic retail story: take profits, then watch it keep flying.", zh: "你确实赚到钱了，但躺平赚得更多。散户经典剧情：落袋为安，然后眼睁睁看着它继续起飞。" },
    art: "mood-moon"
  },
  halfhearted: {
    name: { en: "Half-Hearted Hero", zh: "半仓侠" },
    desc: { en: "You never really committed, and still did worse than doing nothing. Half the risk, less of the reward.", zh: "你从没真正下定决心，结果还是没跑赢躺平。一半的风险，更少的收益。" },
    art: "mood-calm"
  },
  leek: {
    name: { en: "Certified Leek", zh: "认证韭菜" },
    desc: { en: "You traded a lot and did worse than doing nothing. Welcome to the club, most people are in it.", zh: "你操作了一堆，结果还不如躺平。欢迎入群，大多数人都在这里。" },
    art: "persona-leek"
  }
};

const pick = <T,>(xs: T[], seed: number) => xs[Math.abs(Math.floor(seed)) % xs.length];

/** The hype guru chases momentum, which is exactly the wrong signal at turning points. */
export function guruTip(move: number, seed: number): L {
  if (move > 0.04)
    return pick([
      { en: "🚀 GENERATIONAL BUYING OPPORTUNITY. If you're not on margin you're not serious.", zh: "🚀 百年一遇的机会！不上杠杆就是不尊重行情。" },
      { en: "🔥 This is just the beginning. 10x from here. Screenshot this.", zh: "🔥 这才刚开始，还有十倍空间。截图为证。" },
      { en: "📈 Told my premium members to back up the truck. You did, right?", zh: "📈 已经让付费群的兄弟们满仓了。你上车了吧？" }
    ], seed);
  if (move < -0.04)
    return pick([
      { en: "📉 It's going to ZERO. Get out NOW while you still can.", zh: "📉 要归零了！趁还能跑赶紧跑！" },
      { en: "🩸 I sold everything yesterday (I always sell at the right time). Cash is king.", zh: "🩸 我昨天就清仓了（我一向卖得准）。现金为王。" },
      { en: "⚠️ Crash part 2 starts Monday. My sources are never wrong.", zh: "⚠️ 周一开始第二波暴跌，我的消息从来没错过。" }
    ], seed);
  return pick([
    { en: "😎 Accumulate quietly. Big move coming. (This post is sponsored.)", zh: "😎 悄悄建仓，大行情要来了。（本条为广告）" },
    { en: "🤔 Sideways = the calm before the storm. Which direction? Join premium to find out.", zh: "🤔 横盘就是暴风雨前的宁静。往哪走？进付费群告诉你。" }
  ], seed);
}
