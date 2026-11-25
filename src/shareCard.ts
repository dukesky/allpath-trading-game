// Draws the shareable result card (1080x1440 PNG) on a canvas.
// Scenario name stays hidden so friends can play it unspoiled.

export type CardInput = {
  lang: "en" | "zh";
  artUrl: string;
  gameTitle: string;
  scenarioLine: string; // e.g. "剧本 #4 🌶️"
  earnedLine: string; // e.g. "我获得了称号"
  titleName: string;
  titleDesc: string;
  finalEq: number;
  ret: number;
  bhLabel: string;
  bhRet: number;
  botLabel: string;
  botRet: number;
  emojis: string;
  challenge: string;
  url: string;
};

const W = 1080;
const H = 1440;
const INK = "#2b1d14";
const CREAM = "#f8f1e4";
const PAPER = "#fffaf0";
const TANGERINE = "#ff6b35";
const BUTTER = "#ffd166";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Sticker box: hard offset shadow + thick outline, like the in-game cards. */
function sticker(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.fillStyle = INK;
  roundRect(ctx, x + 12, y + 12, w, h, r);
  ctx.fill();
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, cjk: boolean): string[] {
  const tokens = cjk ? [...text] : text.split(/(\s+)/);
  const lines: string[] = [];
  let line = "";
  for (const tok of tokens) {
    const next = line + tok;
    if (ctx.measureText(next).width > maxW && line.trim()) {
      lines.push(line.trim());
      line = tok.trimStart();
    } else line = next;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

const pct = (x: number) => `${x >= 0 ? "+" : "−"}${Math.abs(x * 100).toFixed(0)}%`;
const money = (x: number) => "$" + Math.round(x).toLocaleString("en-US");

export async function drawShareCard(input: CardInput): Promise<Blob | null> {
  const zh = input.lang === "zh";
  const display = zh ? '900 {s}px "Noto Sans SC", sans-serif' : '400 {s}px "Dela Gothic One", "Noto Sans SC", sans-serif';
  const body = zh ? '700 {s}px "Noto Sans SC", sans-serif' : '700 {s}px "M PLUS Rounded 1c", "Noto Sans SC", sans-serif';
  const font = (tpl: string, s: number) => tpl.replace("{s}", String(s));
  const up = zh ? "#e5484d" : "#3f8f22";
  const down = zh ? "#3f8f22" : "#e5484d";

  try {
    await document.fonts?.ready;
    await Promise.all([document.fonts?.load(font(display, 60)), document.fonts?.load(font(body, 40))]);
  } catch { /* draw with fallbacks */ }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background: cream with a dot grid.
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(43,29,20,0.08)";
  for (let y = 18; y < H; y += 36) for (let x = 18; x < W; x += 36) ctx.fillRect(x, y, 3, 3);

  // Header line.
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = font(display, 56);
  ctx.fillStyle = TANGERINE;
  ctx.lineWidth = 6;
  ctx.strokeStyle = INK;
  ctx.strokeText(input.gameTitle, 64, 120);
  ctx.fillText(input.gameTitle, 64, 120);
  ctx.font = font(body, 34);
  ctx.fillStyle = "#6b5545";
  ctx.textAlign = "right";
  ctx.fillText(input.scenarioLine, W - 64, 116);

  // Main card.
  const cx = 64, cy = 170, cw = W - 128, ch = 1010;
  sticker(ctx, cx, cy, cw, ch, 44, BUTTER);

  const art = await loadImage(input.artUrl);
  const as = 400;
  const ax = (W - as) / 2, ay = cy + 50;
  sticker(ctx, ax, ay, as, as, 36, PAPER);
  if (art) {
    ctx.save();
    roundRect(ctx, ax + 4, ay + 4, as - 8, as - 8, 32);
    ctx.clip();
    ctx.drawImage(art, ax + 4, ay + 4, as - 8, as - 8);
    ctx.restore();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = font(body, 30);
  ctx.fillStyle = "#6b5545";
  ctx.fillText(input.earnedLine, W / 2, ay + as + 62, cw - 60);
  ctx.fillStyle = INK;
  ctx.font = font(display, 72);
  ctx.fillText(input.titleName, W / 2, ay + as + 138, cw - 60);

  ctx.font = font(body, 32);
  ctx.fillStyle = "#4a3828";
  const descLines = wrap(ctx, input.titleDesc, cw - 140, zh).slice(0, 2);
  descLines.forEach((l, i) => ctx.fillText(l, W / 2, ay + as + 192 + i * 44));

  // Money line.
  const my = ay + as + 316;
  ctx.font = font(display, 64);
  const left = money(10_000) + "  →  ";
  const right = money(input.finalEq);
  const lw = ctx.measureText(left).width;
  const rw = ctx.measureText(right).width;
  const startX = W / 2 - (lw + rw) / 2;
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.fillText(left, startX, my);
  ctx.fillStyle = input.ret >= 0 ? up : down;
  ctx.fillText(right, startX + lw, my);

  // Comparison row.
  ctx.textAlign = "center";
  ctx.font = font(body, 34);
  ctx.fillStyle = INK;
  const cmp = `${zh ? "你" : "You"} ${pct(input.ret)}   ·   ${input.bhLabel} ${pct(input.bhRet)}   ·   🤖 ${pct(input.botRet)}`;
  ctx.fillText(cmp, W / 2, my + 70, cw - 60);

  ctx.font = '64px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.fillText(input.emojis, W / 2, my + 170, cw - 80);

  // Footer: challenge + link.
  sticker(ctx, 64, 1240, W - 128, 140, 32, INK);
  ctx.fillStyle = PAPER;
  ctx.font = font(display, 44);
  ctx.fillText(input.challenge, W / 2, 1298, W - 200);
  ctx.font = font(body, 32);
  ctx.fillStyle = BUTTER;
  ctx.fillText(input.url.replace(/^https?:\/\//, ""), W / 2, 1350, W - 200);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9));
}
