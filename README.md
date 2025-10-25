# MakeLucky
MakeLucky
## Metrics Worker (Cloudflare) – Visitors & Installs

This project includes a Cloudflare Worker that tracks totals for:
- Visitors: GET/POST at `/api/visitors` and `/api/visitors/hit`
- Installs: GET/POST at `/api/installs` and `/api/installs/hit`

Implementation:
- Durable Object `CounterDO` stores a single `value` per logical counter name (`visitors`, `installs`).
- The front-end uses `VITE_METRICS_API_BASE` to call the Worker.
- If not configured, the UI falls back to CountAPI for backwards compatibility.

### Deploy the Worker

Prereqs:
- Cloudflare account
- `wrangler` CLI installed locally, or use the provided GitHub Action

Local deploy (optional):
```powershell
# In the worker directory
cd worker
wrangler login
wrangler publish
```

GitHub Actions deploy (recommended):
1. Add repo secrets:
	- `CLOUDFLARE_API_TOKEN` (with Workers R2/DO write permissions; typically “Edit Workers”)
	- `CLOUDFLARE_ACCOUNT_ID`
2. Push or manually run workflow: `.github/workflows/deploy-worker.yml`

After deployment, note the Worker URL, e.g.:
```
https://makelucky-metrics.your-subdomain.workers.dev
```

### Configure the Frontend

Set the Worker base URL in `.env.local` (or environment appropriate file):
```
VITE_METRICS_API_BASE="https://makelucky-metrics.your-subdomain.workers.dev"
```

Then rebuild and deploy the site. The UI will:
- Show Visitors and Installs in the footer
- Increment Installs on `appinstalled` and on first standalone run (iOS)

If `VITE_METRICS_API_BASE` is not set, the UI will use CountAPI as a fallback.
