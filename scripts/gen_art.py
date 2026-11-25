"""Generate cartoon art through OpenRouter. Key from $OPENROUTER_API_KEY or this repo's .env.local (never printed).

Usage: python scripts/gen_art.py <name> [<name> ...]   (names from PROMPTS; 'all' = every missing one)
If art/raw/hero.png exists it is passed as a style/character reference for the others.
"""
import base64, json, sys, urllib.request, concurrent.futures as cf
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
import os
ENV = ROOT / ".env.local"
KEY = os.environ.get("OPENROUTER_API_KEY") or next(
    l.split("=", 1)[1].strip().strip("\"'") for l in ENV.read_text().splitlines() if l.startswith("OPENROUTER_API_KEY="))
MODEL = "google/gemini-3-pro-image"

STYLE = ("Style: cute chibi anime cartoon, thick clean dark-brown outlines, flat cel shading, warm palette "
         "(cream #f8f1e4 background, tangerine orange #ff6b35, butter yellow, leek green, soft navy accents), "
         "humorous meme energy, sticker-like composition, crisp, high contrast. "
         "Absolutely NO text, letters, numbers, logos or watermarks anywhere in the image.")
LEEK = ("the hero: a cute anthropomorphic green leek (Chinese scallion) character with big sparkly anime eyes, "
        "a white bulb body, spiky green leaf hair, tiny arms and legs, wearing a small tangerine-orange hoodie")
WHALE = "a huge smug blue whale in a pinstripe suit and sunglasses holding a giant golden sickle"
ROBOT = "a friendly round cream-and-orange robot with one antenna, a calm smile and a clipboard"

PROMPTS = {
    "hero": (f"Wide banner illustration (16:9). Center-left: {LEEK}, sitting at a tiny trading desk with three glowing monitors "
             f"showing wild red and green zigzag charts, sweating nervously but grinning. Looming behind on the right: {WHALE}, "
             f"eyeing the leek like a farmer at harvest time. A small field of other leeks in the background. Funny, warm. {STYLE}", "16:9"),
    "persona-leek": (f"Square character portrait: {LEEK}, totally clueless and hopeful, holding a phone with a trading app, a sparkle above its head, fresh dew drops on its leaves. Plain cream background. {STYLE}", "1:1"),
    "persona-guru": (f"Square character portrait: the same leek character but wearing a backwards cap and sunglasses, holding a phone showing a shouting influencer video with rocket emojis-like rockets flying out (drawn, not text), eyes swirly with hype. Plain cream background. {STYLE}", "1:1"),
    "persona-pro": (f"Square character portrait: the same leek character dressed as a Wall Street professional: tiny navy suit, tie, round glasses, holding a coffee and a thick binder, confident smirk, a Bloomberg-like terminal glow behind (no text). Plain cream background. {STYLE}", "1:1"),
    "mood-moon": (f"Square sticker: {LEEK} riding a cartoon rocket to the moon, ecstatic, money bills flying, stars. {STYLE}", "1:1"),
    "mood-calm": (f"Square sticker: {LEEK} sipping tea calmly in front of a gently wavy chart line, zen, relaxed half-closed eyes. {STYLE}", "1:1"),
    "mood-panic": (f"Square sticker: {LEEK} screaming in panic, hands on cheeks, red downward arrows crashing around it, leaves wilting, sweat drops flying. {STYLE}", "1:1"),
    "mood-rekt": (f"Square sticker: {LEEK} has been harvested: cut short to a stubby stump, holding an empty wallet with a moth flying out, while {WHALE} walks away happily carrying a basket of cut leeks. Comedic, not gory. {STYLE}", "1:1"),
    "mood-cash": (f"Square sticker: {LEEK} lounging on a beach chair under an umbrella holding a suitcase of cash, wearing sunglasses, smug, a stormy chart far in the background. {STYLE}", "1:1"),
    "mood-diamond": (f"Square sticker: {LEEK} with glowing diamond hands, standing heroically in a storm while red arrows bounce off, determined face. {STYLE}", "1:1"),
    "robot": (f"Square sticker: {ROBOT} standing next to {LEEK}, the robot calmly pointing at a simple written-plan scroll (no text, just squiggles) while the leek looks surprised. {STYLE}", "1:1"),
    "whale": (f"Square sticker: {WHALE}, grinning and sharpening the sickle, sitting on a pile of gold coins. {STYLE}", "1:1"),
    "sc-dotcom": (f"Wide reveal illustration (16:9): late-1990s dot-com bubble. {LEEK} in a 90s windbreaker on a giant soap bubble filled with beige CRT computers, dial-up modems and a sock puppet, the bubble starting to pop; floppy disks raining. {STYLE}", "16:9"),
    "sc-gfc": (f"Wide reveal illustration (16:9): 2008 financial crisis. A tower of cartoon houses built like Jenga blocks collapsing onto a crumbling bank with columns; {LEEK} running away holding a for-sale sign; {WHALE} holding an umbrella of bailout money. {STYLE}", "16:9"),
    "sc-covid": (f"Wide reveal illustration (16:9): 2020 pandemic crash. {LEEK} wearing a face mask, barricaded at home behind a fortress of toilet paper rolls, laptop showing a chart dropping like a cliff then shooting up; a lonely cruise ship in the window. {STYLE}", "16:9"),
    "sc-hikes": (f"Wide reveal illustration (16:9): 2022 inflation and rate hikes. A giant stern cartoon owl central banker (generic, not a real person) turning a huge rate dial up, while {LEEK} watches a unicorn-shaped balloon of tech stocks deflating; price tags on groceries shooting up. {STYLE}", "16:9"),
    "sc-tradewar": (f"Wide reveal illustration (16:9): trade war. Two giant cartoon shipping containers boxing each other with tariff gloves, {LEEK} stuck in the middle holding a tiny white flag, Christmas decorations in the background (December crash). {STYLE}", "16:9"),
    "sc-meme": (f"Wide reveal illustration (16:9): 2021 meme stock mania. A crowd of cartoon apes and leeks in a retro video-game store riding rockets, {LEEK} holding a diamond, a sweaty hedge-fund whale getting squeezed in a giant lemon juicer. {STYLE}", "16:9"),
    "sc-grind": (f"Wide reveal illustration (16:9): 2017 calm bull market and crypto mania. {LEEK} on a slow peaceful escalator going up, while next to it a shiny golden coin rocket explodes into fireworks then nosedives; a bored bear sleeping. {STYLE}", "16:9"),
    "sc-tariff": (f"Wide reveal illustration (16:9): 2025 tariff shock and AI boom. {LEEK} on a wild rollercoaster made of tariff tickets plunging then launching up into a glowing AI microchip sun. {STYLE}", "16:9"),
    "sc-dip": (f"Wide reveal illustration (16:9): an ordinary 10% stock market correction. {LEEK} stepping over a small pothole on a long upward hiking trail, overreacting dramatically, while snails stroll past calmly. {STYLE}", "16:9"),
}

def call(name):
    prompt, aspect = PROMPTS[name]
    content = [{"type": "text", "text": prompt}]
    ref = ROOT / "art/raw/hero.png"
    if name != "hero" and ref.exists():
        content.insert(0, {"type": "image_url", "image_url": {"url": "data:image/png;base64," + base64.b64encode(ref.read_bytes()).decode()}})
        content[1]["text"] = "Use the attached image ONLY as the reference for character design and art style (same leek, same whale, same line work and palette). New scene: " + prompt
    body = {"model": MODEL, "modalities": ["image", "text"], "messages": [{"role": "user", "content": content}],
            "image_config": {"aspect_ratio": aspect}}
    req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(body).encode(),
                                 headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json",
                                          "HTTP-Referer": "https://trading.all-path.com", "X-Title": "AllPath Bagholder Sim"})
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.load(r)
    imgs = data["choices"][0]["message"].get("images") or []
    if not imgs:
        return f"{name}: NO IMAGE {str(data)[:300]}"
    url = imgs[0]["image_url"]["url"]
    (ROOT / f"art/raw/{name}.png").write_bytes(base64.b64decode(url.split(",", 1)[1]))
    return f"{name}: ok"

names = sys.argv[1:]
if names == ["all"]:
    names = [n for n in PROMPTS if not (ROOT / f"art/raw/{n}.png").exists()]
with cf.ThreadPoolExecutor(6) as ex:
    for res in ex.map(lambda n: (lambda: call(n))() if True else None, names):
        print(res, flush=True)
