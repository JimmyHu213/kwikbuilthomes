# Database Migrations

This project uses Payload CMS 3 migrations (Drizzle-based, `@payloadcms/db-postgres`) to manage
the Postgres schema in production. Migrations live in `./migrations/` (configured via
`migrationDir` in `payload.config.ts`).

Reference: Payload docs — *Database > Migrations*
(`docs/database/migrations.mdx`, "When to run migrations > Postgres" and
"Running migrations in production").

## TL;DR

| Environment | Schema mechanism |
| --- | --- |
| Local dev (`npm run dev`) | Drizzle **push mode** against a *local/dev* database |
| Production (Vercel) | `payload migrate` in the build step (`npm run ci`) |

**Never mix the two against the same database.** Push mode is dev-only; production is
migrations-only. Payload itself warns about mixing them.

## npm scripts

```bash
npm run migrate:create my_change   # generate a migration from config changes
npm run migrate:status             # show applied vs pending (connects to $DATABASE_URL)
npm run migrate                    # run pending migrations against $DATABASE_URL — careful!
npm run ci                         # payload migrate && next build (Vercel build command)
```

All migrate scripts first run `payload:bundle-config`, which bundles `payload.config.ts` into
`.payload-config-compiled.mjs` with esbuild and points the Payload CLI at it via
`PAYLOAD_CONFIG_PATH`. This is required because the Payload CLI's `tsx` loader fails under
Node 26 strict ESM with `ERR_MODULE_NOT_FOUND` on the extensionless relative imports used
throughout `src/` (e.g. `./src/collections/Users`). The bundle step is functionally identical
to the documented plain `payload migrate` and takes ~10 ms.

Notes:

- `.payload-config-compiled.mjs` is a build artifact — it is gitignored, do not commit it.
- `esbuild` is a direct devDependency in `package.json`.
- The CLI must be run with env loaded: `set -a && source .env.local && set +a` first.

## One-time: adopting migrations on the EXISTING production database

> **The production Supabase DB already has the full schema** (it was created by dev-mode push
> sessions). The initial migration `migrations/20260611_040147_initial.ts` must therefore be
> **marked as applied, never executed**, against production. Executing it would fail on
> existing tables — and `migrate:fresh` would **drop all production data**.

### How `payload migrate` decides what to run (verified against `@payloadcms/drizzle/dist/migrate.js`)

The official docs do not provide a dedicated "mark as applied" command; the safe path follows
directly from how the adapter works:

1. `payload migrate` **skips** any migration whose `name` already has a row in the
   `payload_migrations` table.
2. Dev-mode pushes insert a marker row with `batch = -1`. If any `batch = -1` row exists,
   `payload migrate` shows an interactive *"data loss will occur — proceed?"* prompt. In a
   non-interactive CI build this blocks or aborts the deploy.

> **Snapshot freshness caveat:** the initial migration was generated from the Payload config in
> the working tree at generation time (2026-06-11). "Mark as applied" assumes the production
> schema matches that snapshot (i.e. the latest config state has been dev-pushed to prod, as has
> been the case so far). If collection configs change again before adoption, **delete and
> regenerate** the initial migration (`rm migrations/* && npm run migrate:create initial`) so the
> snapshot matches what is actually in production, and use the new filename in the SQL below.

### Adoption steps (run once, in order)

1. **Stop pointing local dev at production.** Create/point a local or branch database in
   `.env.local`'s `DATABASE_URL`. From now on, only CI touches the production DB.

2. **Mark the initial migration as applied** — run in the Supabase SQL editor against the
   production database:

   ```sql
   -- inspect first: expect only dev-push rows (batch = -1), no real migrations
   SELECT id, name, batch FROM payload_migrations;

   -- mark the initial migration as already applied (schema already exists)
   INSERT INTO payload_migrations (name, batch, created_at, updated_at)
   VALUES ('20260611_040147_initial', 1, now(), now());

   -- remove dev-push markers so `payload migrate` never raises the data-loss prompt in CI
   DELETE FROM payload_migrations WHERE batch = -1;
   ```

   The `name` must exactly match the migration filename without extension.

   **Enum alignment check:** the product `status` field now declares an explicit
   `enumName: 'enum_products_listing_status'` (without it, the adapter mapped the field and the
   drafts-internal `_status` column onto the same enum type). A production DB push-managed
   *before* this change may carry the old enum name. Verify before marking applied:

   ```sql
   SELECT t.typname, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS values
   FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
   WHERE t.typname LIKE '%products%status%' GROUP BY t.typname;
   ```

   Expected: `enum_products_listing_status = {draft,active,discontinued}` and
   `enum_products_status = {draft,published}`. If the listing enum is missing or named
   differently, run one dev push (`npm run dev` pointed at prod, one last time) to align the
   schema **before** step 2's INSERT/DELETE, or rename the type manually
   (`ALTER TYPE ... RENAME TO enum_products_listing_status`).

3. **Set SMTP env vars in Vercel production env** (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
   `SMTP_PASS`, `EMAIL_FROM_ADDRESS`). `payload.config.ts` now **throws at config evaluation in
   production when `SMTP_HOST` is missing** (to prevent silent email loss via Ethereal), so the
   build — which evaluates the config — will fail until these are set. This is intentional.

4. **Set the Vercel Build Command** (Project Settings → Build & Development) to:

   ```bash
   npm run ci
   ```

   This is the documented approach for Vercel: run `payload migrate` against the production
   `DATABASE_URL` before `next build`. (The docs' `prodMigrations`-on-startup alternative was
   rejected: it is for long-running servers and slows serverless cold starts on Vercel, per the
   docs' own warning.)

5. **Verify**: the next deploy's build log should show
   `payload migrate` reporting the initial migration as already applied (skipped) and
   "No migrations to run." style output, then a normal Next build.

## Day-to-day workflow for schema changes

1. Edit collections/globals in `src/`. Run `npm run dev` — push mode syncs your **local** dev DB
   automatically. Do **not** run `npm run migrate` against this dev DB.
2. When the feature is complete, generate a migration:

   ```bash
   set -a && source .env.local && set +a
   npm run migrate:create my_feature_name
   ```

3. Review the generated SQL in `migrations/<timestamp>_my_feature_name.ts` (always eyeball it —
   especially `DROP`/`ALTER` statements), and commit the `.ts`, `.json` and updated
   `migrations/index.ts` together with the config change.
4. Open a PR. On deploy, `npm run ci` runs the pending migration against production before
   building. If the migration fails, the deploy is rejected and production is untouched (each
   migration runs in a transaction).

## Do not

- Do not run `npm run migrate` while `DATABASE_URL` points at production unless you are
  intentionally migrating production from your machine.
- Do not run `migrate:fresh`, `migrate:reset`, or `migrate:refresh` against production — these
  drop or roll back schema/data.
- Do not let dev mode (`npm run dev`) run against the production `DATABASE_URL` — push mode will
  mutate the production schema and reintroduce `batch = -1` marker rows.
- Do not edit an already-deployed migration file; create a new migration instead.
