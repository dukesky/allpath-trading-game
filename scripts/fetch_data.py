"""Fetch weekly closes for every scenario asset and write src/data/prices.json.

Run: uv run --with yfinance --with pandas python scripts/fetch_data.py
Each series starts one year before the scenario window (for the rules bot's
40-week moving average) and ends at the window end. Prices are split- and
dividend-adjusted (yfinance auto_adjust).
"""
import json
from datetime import date, timedelta
from pathlib import Path

import yfinance as yf

# id: (start, end, {slot: ticker})
SCENARIOS = {
    "dotcom": ("1999-11-01", "2003-12-31", {"index": "^GSPC", "tech": "QQQ", "spicy": "AMZN"}),
    "gfc": ("2007-10-01", "2010-04-30", {"index": "^GSPC", "tech": "QQQ", "spicy": "C"}),
    "covid": ("2020-01-13", "2020-12-31", {"index": "^GSPC", "tech": "QQQ", "spicy": "CCL"}),
    "hikes": ("2021-11-15", "2023-07-31", {"index": "^GSPC", "tech": "QQQ", "spicy": "ARKK"}),
    "tradewar": ("2018-09-17", "2019-06-28", {"index": "^GSPC", "tech": "QQQ", "spicy": "NVDA"}),
    "meme": ("2020-12-01", "2021-08-31", {"index": "^GSPC", "tech": "QQQ", "spicy": "GME"}),
    "grind": ("2017-01-03", "2018-02-28", {"index": "^GSPC", "tech": "QQQ", "spicy": "BTC-USD"}),
    "tariff": ("2025-01-06", "2025-09-30", {"index": "^GSPC", "tech": "QQQ", "spicy": "NVDA"}),
    "dip": ("2023-07-17", "2024-02-29", {"index": "^GSPC", "tech": "QQQ", "spicy": "TSLA"}),
}

out = {}
for sid, (start, end, slots) in SCENARIOS.items():
    pre = (date.fromisoformat(start) - timedelta(days=380)).isoformat()
    out[sid] = {"start": start, "end": end, "series": {}}
    for slot, tk in slots.items():
        df = yf.download(tk, start=pre, end=(date.fromisoformat(end) + timedelta(days=7)).isoformat(),
                         interval="1d", auto_adjust=True, progress=False)
        close = df["Close"]
        if hasattr(close, "columns"):
            close = close.iloc[:, 0]
        wk = close.resample("W-FRI").last().dropna()
        out[sid]["series"][slot] = {
            "ticker": tk,
            "dates": [d.strftime("%Y-%m-%d") for d in wk.index],
            "close": [round(float(v), 4) for v in wk.values],
        }
        print(sid, slot, tk, len(wk), wk.index[0].date(), wk.index[-1].date())

Path("src/data/prices.json").write_text(json.dumps(out, separators=(",", ":")))
