
# acclerators.club — Web3 & AI Directory

Zero-backend, Next.js 14 + Tailwind directory to list Web3 projects, AI startups, and investors.
Search + filters + local CSV/JSON import (saved to your browser).

## Quick Start (Vercel)
1) Create a new GitHub repo and upload this folder, or drag & drop the ZIP into Vercel "Deploy" (Import Project).
2) On Vercel, accept defaults. Framework: **Next.js**. Node 18+.
3) Deploy. That's it.

## Local Dev
```bash
npm i
npm run dev
```

## Add / Edit Listings
- Edit JSON files in `/data/*.json`, commit & redeploy.
- Or, on the site, use **Import** to paste CSV/JSON (kept in your browser only).
- JSON fields:
  - **Project**: id, name, url, description, category ("Web3"/"AI"), chain, sector, stage, region, tags[]
  - **Investor**: id, name, url, chequeMinUSD, chequeMaxUSD, stages[], focus[], region, notes

## Notes
- No backend. Perfect for a lightweight public directory.
- You can attach a custom domain `acclerators.club` in Vercel's Dashboard after deploy.
