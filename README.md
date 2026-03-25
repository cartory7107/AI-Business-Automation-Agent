# AI Business Automation Agent

Modern SaaS-style web app landing/dashboard for an AI automation platform.

## New Trend Intelligence Upgrades

- Global **searchable country selector** (all countries via ISO region list).
- Country-aware trend scanner for:
  - Trending topic
  - Keyword strength
  - Viral opportunity score
  - Best upload time window
- Weighted viral score engine (bounded **40%–95%**) using:
  - trend strength
  - keyword demand
  - competitor gap
  - CTR prediction
  - watchtime prediction
- Dynamic niche highlight (Gaming / Football / Education / etc.) based on selected country.
- Real-time API wiring hooks for:
  - YouTube Data API v3
  - RapidAPI YouTube-style trending endpoint (optional)
- 6-hour auto-refresh loop.
- Thumbnail intelligence insights based on currently trending patterns.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Real-time API setup

In the Trend Scanner panel, provide:

1. **YouTube Data API v3 key** (Google Cloud project required)
2. **RapidAPI key + host** (optional fallback)

Without API keys, the app uses a realistic weighted fallback model.
