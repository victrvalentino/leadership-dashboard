# Redesign Changelog

## 1. Typography
- Swapped Inter → **Nunito** (`tailwind.config.js`, `globals.css`), weights 400–900.

## 2. Shadows / depth
- Added reusable shadow tokens in `tailwind.config.js`: `shadow-soft`, `shadow-elevated`, `shadow-badge`.
- Applied to: hero icon badges (all sections), `MetricCard`, `LeadershipSignal` icon,
  sidebar logo/nav, floating home button, and local card wrappers that previously used
  a flat `shadow-sm`.

## 3. Version History (new)
- No new tables needed — `public.audit_logs` already existed, unused.
- `src/lib/diffContent.ts` — computes top-level field diffs between two content snapshots.
- `src/lib/auditLog.ts` — shared logger, called from both save and publish routes.
- `src/app/api/admin/update-section/route.ts` — now logs a `draft_save` audit entry per save.
- `src/app/api/admin/publish/route.ts` — now logs a `publish` audit entry per section published.
- `src/app/api/dashboard/history/route.ts` (new) — `GET ?date=YYYY-MM-DD`, returns that day's
  entries plus a 60-day list of active dates.
- `src/components/sections/VersionHistorySection.tsx` (new) — date picker + timeline, with
  a "Recent activity" quick-jump row and an expandable per-field before/after view.
- Added to sidebar nav under "Leadership Action" group, and to `Header.tsx` page-title map.

**Note:** history starts accumulating from the next save/publish — there's nothing to show
for past dates since no audit trail existed before this change.

## 4. Section-switch animation
- `globals.css`: `@keyframes section-enter` (fade + 8px rise, 0.32s), respects
  `prefers-reduced-motion`.
- Applied via the existing `key={page}` remount point in `src/app/page.tsx`.

## 5. Consistent sizing across sections (root cause of the "zoom" mismatch)
Before: most sections used `max-w-6xl mx-auto px-6 py-10 space-y-6`, but **Experience** and
**Development** used a tighter `max-w-[1120px] px-4 py-2 space-y-5`, and Entry/Home/Recruitment/
Executive each had their own slightly different padding/width. All 10 sections now share the
exact same container class. Card `min-h` values (290px / 340px outliers) normalized to 320px
to match the shared `MetricCard`.

## 6. Visual refresh (shared components + hero headers)
- `src/components/ui/index.tsx`: refined `SectionPageHeader`, `MetricCard`, `StatusBadge`,
  `LeadershipSignal`, `KeyMetricsHeader`, `HomeButton` — softer borders, deeper/layered
  shadows, tighter tracking, rounded-full status pills. Added a shared `IconBadge` helper.
- The 7 sections using the duplicated "hero header" pattern (Cost, Development, Exit,
  Experience, Leadership, Recruitment, Turnover) got the same badge shadow, softened inner
  ring, and heading weight/tracking applied directly, since they don't yet consume the shared
  `SectionPageHeader` component (left as-is structurally to minimize risk — see "Not done").

## Security notes (unrelated to the redesign, found while reading the code)
- **`.env.local` was included in the uploaded zip**, including `SUPABASE_SERVICE_ROLE_KEY`.
  Recommend rotating that key in Supabase → Project Settings → API, since it's now sat in an
  uploaded file outside your usual secret storage.
- `npm install` flagged **Next.js 14.2.5 has a known security vulnerability** with a patch
  available. Worth a deliberate upgrade pass separate from this visual redesign.
- `src/lib/supabase.ts` and `src/lib/auth.ts` have leftover `console.log` calls that print
  cookie/session details — harmless locally, but worth stripping before your next deploy
  since they'll show up in Vercel's function logs.

## Not done / intentionally out of scope
- The 7 sections above still duplicate their hero-header JSX rather than calling the shared
  `SectionPageHeader` component. Consolidating them is a natural follow-up but touches more
  lines per file — flagged rather than done silently, to keep this change-set reviewable.
- No changes to `sectionConfig.ts`, `mappers.ts`, `dashboardData.ts`, or any API route beyond
  `update-section` and `publish` — data shapes and admin editing flow are untouched.
