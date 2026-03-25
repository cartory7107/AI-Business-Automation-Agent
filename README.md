# AI Business Automation Agent

Modern SaaS-style web app landing/dashboard for an AI automation platform.

## What's new

- Global **Trend Scanner** with searchable country selector (all countries).
- **Firecrawl-first trend mode** (optional API key) for live scraping of public trend pages.
- Automatic fallback mode when no key is set, so dashboard still works.
- Dynamic niche highlight (Gaming, Football, Education, Tech, etc.) per selected country.
- Weighted **Viral Opportunity Score** engine (40%–95%) using trend/keyword/CTR/watchtime factors.
- Auto-refresh trend panel every 6 hours.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.
