# Kickaxe Guitars: website

The Next.js front end for kickaxeguitars.com. Content comes from the Sanity Studio in `../studio`.

## Develop

```bash
pnpm dev
```

The site runs at http://localhost:3000. `pnpm dev` regenerates the Sanity types first (`pnpm sanity:typegen`).

## Deploy

Vercel project **kickaxe-website** (team kjheartbreakers-projects), with the root directory set to `web`. Pushes to `main` deploy to production; other branches get preview deployments. The project is on the Hobby plan, so commits must be authored with the project owner's email or Vercel blocks the deployment.
