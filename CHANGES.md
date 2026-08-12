# Redesign Changelog

## Update 3 — Version History now shows every section, changed or not

Previously the history page was a flat activity feed — only sections with a save/publish
that day showed up. Changed to a full per-section status board instead.

**Discovered while building this:** `dashboard_sections` actually has 19 rows, not 10 —
Recruitment alone has 8 department sub-sections behind it (`recruitment_account_management`,
`recruitment_ceo_office`, etc.), and the 3 Leadership sub-tabs (Risk Heatmap, Action Box,
Governance) each have their own row too. Pulled the section list live from that table
instead of hardcoding it, so this won't silently miss sections if more get added later.

- `src/app/api/dashboard/history/route.ts` — now returns **every** section for the chosen
  date. Each one includes `changedToday` (bool), the day's audit entries if any, and —
  for unchanged sections — `lastChange` (when it was last touched and by whom), so
  "unchanged" still carries useful context instead of just being blank.
- `src/components/sections/VersionHistorySection.tsx` — rebuilt around three groups
  matching the sidebar's own grouping (Lifecycle Sections, Leadership Action, Recruitment
  Departments). Recruitment's 9 rows are collapsed by default with a "X changed" badge on
  the group header, so the page doesn't turn into a 19-row wall on days with no recruitment
  activity. Each section shows a green "Changed" or a muted "Unchanged" pill; unchanged
  sections show "Last changed [date] by [editor]" when history exists.
- Section colors are a curated map matching the real per-section brand colors used
  elsewhere in the app (Experience blue, Turnover orange, etc.) rather than
  `dashboard_sections.theme_color`, which turned out to be the same default indigo
  (`#6366F1`) on every row — it's never actually been customized per section.

---

## Update 2 — font fix, Leadership sub-tabs, login redesign

**Font bug fix (root cause of "still not Nunito"):** the `@import` for Google Fonts
in `globals.css` was placed *after* `@tailwind base/components/utilities`. Per the CSS
spec, `@import` must be the first rule in a stylesheet or browsers are required to
ignore it — so Nunito silently never loaded and everything fell back to the system
font. Fixed properly by switching to `next/font/google` in `layout.tsx` (self-hosted
at build time, no external runtime request, no ordering footguns, no ad-blocker risk).
`tailwind.config.js` and `globals.css` now reference the generated `--font-nunito`
CSS variable instead of the font name string.

> Note: this sandbox's network is allowlisted and can't reach `fonts.googleapis.com`,
> so I validated this change with `tsc --noEmit` (clean, no errors) instead of a full
> `next build`. `next/font/google` is a standard, widely-used Next.js pattern — it will
> fetch normally on Vercel and on your machine, both of which have normal internet access.

**Leadership Action sub-tabs redesigned** (`RiskHeatmapTab.tsx`, `ActionBoxTab.tsx`,
`GovernanceTab.tsx`, `LeadershipSection.tsx`) — these were missed in the first pass
since they live in their own `leadership/` subfolder. Changes: `font-black` →
`font-extrabold` throughout (same heavy-weight-everywhere issue as the main sections),
upgraded card shadows to `shadow-soft`/`shadow-badge` with matching borders, added
depth to icon circle badges, and a subtle shadow on the active tab pill. Left the
per-row `icon` fields as-is (Risk Heatmap rows and Governance benefits let the admin
type any icon value via the CMS form — likely emoji today — so this stayed a content/data
decision rather than a code change; only the surrounding chrome was polished).

**Login page redesigned** (`src/app/admin/login/page.tsx`) — rebuilt as a split panel:
left side is a navy-to-blue gradient brand panel (title, three feature bullets, a short
tagline), right side is the actual sign-in form with icon-prefixed inputs and a real
show/hide password toggle (new, small addition). **All existing auth logic is untouched
byte-for-byte** — `handleLogin`, `handleForgotPassword`, the cookie-setting, the
`is_active`/role checks — only the JSX markup changed. Also fixed a naming inconsistency:
the old login page said "ESB Leadership Intelligence Platform" while the header and page
metadata elsewhere say "One Leadership Dashboard" — now consistent everywhere.

Not restyled: `src/app/admin/reset-password/page.tsx` still uses the old centered-card
look. Left out of scope since it wasn't part of what was asked, but it'll now look
visually inconsistent sitting next to the new login page — worth a matching pass later.

---

## Update 1 — original redesign pass


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
