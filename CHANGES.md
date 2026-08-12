# Redesign Changelog

## Update 7 — three icon badges that were missed entirely, plus a real CSS bug

You flagged three spots still showing flat/broken icons. Traced each one instead of
guessing:

- **Entry's header badge** — this section uses its own square badge (`rounded-xl`),
  different from the circular hero-badge pattern the other 8 sections share. It was
  never touched by any of the earlier gradient passes because none of my mechanical
  scripts were looking for that shape. Fixed directly.
- **Exit's stat icons + Leadership Signal lightbulb** — both render through a local
  `IconCircle` helper function that I never located. I'd only fixed the *other* icon
  path in that same file (the inline per-item badges under "signal items"), so it
  looked like Exit was "half done" without an obvious reason why. Fixed the helper
  function itself, so every icon that calls it — all 5 stat cards and the big
  lightbulb — is now covered in one place.
- **Version History's badge was invisible — a real bug, not just "still flat".**
  It used a Tailwind gradient utility (`bg-gradient-to-br from-slate-600 to-slate-800`)
  *together with* the `icon-gradient` class — but both set the same CSS property
  (`background-image`), so one completely overwrote the other instead of blending.
  The result: a badge with no visible base color underneath, just a faint overlay —
  which is exactly the washed-out look in the screenshot. Fixed by switching to a
  plain grey `background-color` (`#475569`, slate) as you asked, which composes
  correctly with the gradient overlay instead of fighting it. Also swept the rest of
  the app for the same `icon-gradient` + `bg-gradient-to-*` combination — this was
  the only place it occurred.

Also caught in the same sweep: `GovernanceTab.tsx`'s small numbered step badges
(the 1/2/3/4 circles in the Cadence cards) had a solid color fill but no gradient —
added for consistency.

**How this was checked:** rather than only inspecting the 3 reported spots, ran a
pattern search across every section file for any rounded, centered, colored container
that didn't yet have `icon-gradient` applied, to catch other instances of the same
"reusable helper function never located" mistake before they turned into another
round of bug reports. Two false-positive categories were intentionally left alone:
outline-only badges with no fill (a gradient has no surface to sit on), and the small
white ring nested inside each hero badge (decorative, not its own elevated surface).

---

## Update 6 — glossy/3D reverted, replaced with a flat gradient fill instead

The 3D/glossy treatment from Update 5 is gone. Kept the same architecture (a CSS class
layered on top of each badge's existing background color, so no per-badge JS changes
were needed) but swapped what it does:

- `.icon-glossy` → `.icon-gradient` (`globals.css`): removed the radial highlight blob
  (the "glass shine") and the `position/overflow` scaffolding it needed. What's left is
  just a soft diagonal tint — lighter at the top-left, a touch darker at the bottom-right
  — for some color depth without looking like a rendered 3D sphere.
- `shadow-glossy` / `shadow-glossy-sm` tokens removed from `tailwind.config.js` entirely
  (they were pure inset "raised bezel" shadows — the main driver of the 3D look). All 35
  badges now use the plain `shadow-badge` (large) / `shadow-soft` (small) elevation
  tokens that already existed for everything else in the app.

All 35 spots from Update 5 (every section, the Leadership sub-tabs, the shared
`ui/index.tsx` components, sidebar/header avatar, floating home button) carry the new
flat gradient fill. Nothing structural changed otherwise — icon sizes, the Home/Executive
zoom-out from Update 5, and Executive's outline-ring-to-filled-circle icons all stay as
they were; this update only touches the surface treatment.

---

## Update 5 — Home/Executive zoomed out, glossy 3D icons everywhere

**Home & Executive felt oversized because they were oversized** — these two use their
own unique "banner" header layout rather than the hero-badge pattern shared by the other
8 sections, so they never got touched by the earlier sizing-consistency pass. Reduced,
file by file:

- `HomeSection.tsx`: title `text-4xl md:text-6xl` → `text-3xl md:text-5xl`; the three
  full-width banner buttons (Executive Snapshot / Recruitment / Leadership Action) went
  from `px-8 py-7` to `px-6 py-5`, their icon circles from 64px → 56px, headings from
  `text-2xl md:text-3xl` → `text-xl md:text-2xl`; the 6-card lifecycle grid's icon
  circles went from 80px → 64px with tighter padding and gap.
- `ExecutiveSection.tsx`: the Directorate banner padding and icon (80px → 56px) reduced
  to match; the 5 KPI cards shrunk from `min-h-[320px]` to `min-h-[250px]` (320 was
  itself a side-effect of an earlier normalization pass that assumed these cards needed
  as much room as the richer donut-chart cards elsewhere — they don't), their icon
  circles from a 96px **outline ring** to a 64px **filled** circle (also fixes an
  inconsistency — every other icon badge in the app is a filled circle, this was the
  only outlined one), and the value text from `text-4xl` → `text-3xl`.

**Icons and symbols now have a glossy/3D treatment**, added as two reusable primitives:
- `.icon-glossy` (`globals.css`) — a diagonal light-to-dark gradient layered over
  whatever background color the badge already has, plus a soft radial highlight blob
  near the top-left (the "glass reflection" look).
- `shadow-glossy` / `shadow-glossy-sm` (`tailwind.config.js`) — an inset top highlight +
  inset bottom shade (the raised bezel effect) combined with the existing outer
  elevation shadow, sized for large (badge headers) vs. small (in-card icons) badges.

Applied to **35 icon badges** across every section, the Leadership sub-tabs, the shared
`ui/index.tsx` components (so anything built on `SectionPageHeader`/`LeadershipSignal`/
`IconBadge`/`HomeButton` gets it automatically), the sidebar/header avatar, and the
floating home button. Left alone: `EntrySection`'s `CardIcon` (a bare icon with no
background — no surface for gloss to land on) and outline-only badges with no fill
(e.g. Cost/Exit's signal-item ring icons) — gradient overlays don't read well without
a solid surface underneath.

---

## Update 4 — Version History wasn't recording anything (root cause + fix)

**What was wrong:** the audit logging I built in Update 1 was wired into
`src/app/api/admin/update-section/route.ts` and `src/app/api/admin/publish/route.ts` —
but the admin dashboard UI (`src/app/admin/dashboard/page.tsx` → `submitData()`) actually
calls a **different** endpoint: `POST /api/admin/sections`, with `{ section_key, content,
publish }` in the body, where `publish: true/false` decides draft-save vs. publish within
one route. I built the logging into the wrong file without first tracing which endpoint
the UI actually calls — the two routes I touched are dead code the app never runs.

**How I found it:** checked live Supabase directly (0 rows in `audit_logs`, despite a
real edit at 11:29 UTC), then pulled real Vercel runtime logs for that exact timestamp,
which showed `POST /api/admin/sections` — a route I'd never looked at — instead of
`update-section`. Fetched that file straight from your public GitHub repo to confirm,
then confirmed my local copy matched exactly before editing.

**Fix:** wired `logAudit()` into `src/app/api/admin/sections/route.ts` instead — in both
the update-existing-row and insert-new-row branches, logging `action: 'publish'` or
`'draft_save'` depending on the `publish` flag already in the request. `section_key`
comes directly from the request body here (this route doesn't need the extra
`dashboard_sections` round-trip the old one did).

**Left as-is, not deleted:** `update-section/route.ts` and `publish/route.ts` still
have their (unused) logging calls — harmless dead code, but flagging it in case you
want to clean those files up later since nothing calls them.

**Note for existing data:** history starts from your next save — the edits made
before this fix (including the 11:29 UTC one that prompted this investigation)
were never logged and can't be recovered retroactively.

---

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
