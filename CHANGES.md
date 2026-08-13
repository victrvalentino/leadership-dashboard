# Redesign Changelog

## Update 28 — welcome popup now shows every time, not once per day

Removed the `localStorage`-based "once per calendar day" gate entirely from
`WelcomeModal.tsx`. It now shows unconditionally every time the component mounts.

**Worth knowing — this is a real behavioral trade-off, not just a bug fix:** a page
refresh and a fresh React mount are mechanically the same event, so there's no way to
distinguish "show on refresh" from "show on every fresh render" — any persistence
mechanism that survives a refresh (which is what the previous once-per-day version
did, on purpose) would by definition also block it from reappearing on refresh. Removing
the gate is the only way to satisfy "always show on refresh."

The side effect: since `HomeSection` remounts fresh every time you navigate to Home
from another section (`page.tsx` uses `key={page}` specifically so React treats each
section switch as a full remount, not a re-render), the popup will now also appear
every time you click "Home" in the sidebar during normal use — not just after login or
a hard refresh. If that turns out to be more often than you want in practice, a more
targeted version is possible (e.g., only suppressing it for in-app sidebar navigation
while still showing on genuine page loads), but that needs a way to tell those two cases
apart, which the current login flow doesn't provide on its own — flagging this now
rather than silently building something narrower than what was asked for.

---

## Update 27 — Executive Snapshot KPI cards: consistent spacing rhythm

Found the actual cause of the "not neat" spacing: the gaps between elements
(label → divider → value → divider → footer) weren't just tight, they were
genuinely inconsistent — 0px between label and the first divider, 0px between that
divider and the value, then 4px before the second divider, then 12px before the
footer. Four different gap sizes including two literal zeros in the same short
stack of elements.

Rebuilt with one consistent scale: 12px after the icon, 8px around both dividers
consistently, 12px before the footer (12 / 8 / 8 / 8 / 12) — symmetric, with the
larger gaps at the two "section boundaries" (icon and footer) and even smaller gaps
around the value in between. Cards grow by about 14px to accommodate the added
spacing; since they use `min-height` rather than a fixed height, this is absorbed
cleanly and all five cards still match each other exactly.

---

## Update 26 — Executive Snapshot: blended Directorate icon, removed Leadership Insight chevron

- **Directorate banner icon**: was a vivid purple (`#6D4FD1`) that stood out sharply
  against the dark navy banner (`#0F0C40 → #1B1464`). Changed to `#2E2A70` — a lighter
  shade from the same navy/indigo family as the banner itself, rather than a different
  hue entirely, so it now reads as "part of the banner" instead of an accent color
  competing with it.
- **Leadership Insight banner**: removed the trailing `>` chevron after the trend/alert
  icons — matches the same removal already done on Entry, Experience, and Development's
  equivalent banners; Executive's was the one section this hadn't reached yet since it
  uses two icons plus a chevron rather than a lone chevron, so it needed its own check.
  Removed the now-unused `ChevronRight` import.

---

## Update 25 — watermark had vanished entirely — a real regression from the last fix, now fixed

Moving the watermark to `position: fixed` (Update 24) was correct, but the restructuring
around it introduced a new bug: the wrapper div I created for the rest of the app
(`<div className="relative z-10 flex h-screen ... bg-slate-50">`) carried its own opaque
`bg-slate-50` background covering the *entire* screen. Since that div sits at `z-10`,
above the watermark's `z-0`, its full-screen opaque background painted directly over the
watermark everywhere — not just where cards happen to sit, the whole thing, which is why
it disappeared completely rather than just being mispositioned.

The fix: removed that `bg-slate-50` from the wrapper. It was redundant anyway —
`layout.tsx`'s `<body>` already carries `bg-slate-50` globally, so the wrapper doesn't
need its own copy. With it gone, the wrapper's genuinely empty areas (the margins around
cards inside `<main>`, which have no background color of their own) are transparent, so
the watermark shows through in the gaps exactly like your reference — while the sidebar,
header, and every card still correctly paint over it where they actually sit.

---

## Update 24 — watermark wasn't actually centered — fixed the real cause

The previous update's watermark used `position: absolute` *inside* `<main>`, which is
the scrollable container. That meant it was positioned relative to the top of each
section's content, not the visible screen — so on any page taller than one screen, it
would scroll away with the rest of the content rather than staying put. That's the
actual reason it read as "not middle enough": it was never anchored to the viewport at
all.

Moved it to `position: fixed` with `top-1/2 -translate-y-1/2`, which centers it on the
visible screen and keeps it there regardless of scroll position or how long a given
section's content is — the real meaning of "middle" here.

Also restructured the stacking to remove the last bit of ambiguity: the watermark is
now a top-level sibling of the whole app shell (not nested inside `<main>`), with an
explicit `z-0`. Everything real — sidebar, header, all section content, the floating
chat button, modals — is wrapped in one `relative z-10` container. Two siblings, two
explicit z-index values, no dependence on DOM paint order or nested-stacking-context
reasoning. `right-16` keeps it clearly on the right side rather than dead-center of the
screen, matching "middle right."

---

## Update 23 — blue logo watermark on every section, added once at the shared layout level

New asset: `public/logo-icon-blue.png` — same icon-only silhouette used for the login
page watermark (Update 21), recolored blue (`#2563EB`) instead of white by reusing its
existing alpha mask, rather than reprocessing from the original photo.

Added to `src/app/page.tsx`, **not** duplicated into each of the 11+ section files —
`<main>` is the one shared wrapper every section already renders through, so one change
here makes the watermark appear consistently everywhere without touching Home,
Executive, Recruitment, Entry, Experience, Development, Turnover, Exit, Cost,
Leadership, or Version History individually. If the position or size ever needs
adjusting, it's a one-line change in one file, not eleven.

Layering was handled explicitly rather than relying on DOM order: `<main>` is now
`relative`, the watermark sits at `z-0` inside it, and each section's actual content
renders inside a `z-10` wrapper. This guarantees the watermark stays behind every card
and panel regardless of what a given section renders, rather than depending on paint
order happening to work out — confirmed no existing `absolute`-positioned elements
(like Governance's numbered step badges) would be affected by `<main>` becoming a
positioning context, since they already anchor to their own closer parent.

---

## Update 22 — real profile photos in the contact popup

`ContactModal.tsx`'s four contacts now show actual photos instead of colored
initials circles. Assets saved to `public/contacts/` (debora.jpg, ilham.jpg,
vania.jpg, victor.jpg) — Victor's original was 1280×1280 (94KB) while the other
three were already properly-sized 225×225 thumbnails, so resized his down to
240×240 to match; checked the result before finalizing to confirm his face stayed
well-centered after the crop rather than assuming it would.

Built with a fallback: if a photo ever fails to load (missing file, bad path), it
reverts to the original colored-initials circle instead of showing a broken-image
icon — the `initials()` helper and per-contact `color` are both still there, just
now serving as the safety net rather than the default.

---

## Update 21 — real logo watermark, clickable email icon, Cost rebalance, premium gradients

**1. Login page watermark** — was a hand-drawn SVG approximation (my own guess at an
"S" curve). Replaced with the real logo, cropped to just the icon mark (no "ESB" text —
found the exact pixel column where the icon ends and the text begins by scanning alpha
density column-by-column, rather than eyeballing a crop). Saved as a second asset,
`public/logo-icon-white.png`, separate from the full lockup used in the sidebar/login
header — using the full lockup here would have ghosted "ESB" text into the watermark,
which the reference didn't show.

**2. Contact popup mail icon** — this was actually already functional (the whole
contact row has always been a `mailto:` link, icon included), but it didn't *look*
clickable — no visual affordance. Gave the icon its own circular button treatment with
a hover state, so it's now unambiguous that it's the click target, while the rest of
the row stays clickable too.

**3. Cost section rebalanced, not just resized** — shrinking the icon alone while
keeping the icon+value side-by-side (as literally asked) would have risked longer
currency values ("Rp 28.1B") overflowing that tight row, since Cost is the one section
where values share horizontal space with the icon rather than sitting on their own row
below it. Restructured to stack icon-above-value instead — smaller icon (64px → 44px),
much bigger value (28-30px → **36px**, finally reaching the app-wide standard this
section could never safely hit before). This also structurally guarantees no overflow
regardless of value length, and better serves "emphasize the number" than a side-by-side
resize would have — a number alone on its own row reads as more prominent than one
sharing space with an icon.

**4. Premium gradient backgrounds, all sections** — added `.panel-gradient` to
`globals.css`: a barely-there diagonal shift from pure white to a whisper of cool gray
(`150deg, #fff → #fafbfd → #f3f6f9`), replacing flat `bg-white` on every genuine card
and panel — 37 of them, across every section including the Leadership sub-tabs and
Version History. Deliberately left flat white: icon-circle badges, the sticky header
bar, input-style elements, and internal content wrappers that sit inside an
already-gradient-treated parent (adding a second gradient there would just look like a
visible seam). Also caught a real gap in the process: Executive's 5 KPI cards had **no
background at all** — just a border and shadow floating over the page's own background
color — which was likely contributing to the "flat"/inconsistent impression on its own,
independent of the gradient question. Fixed alongside everything else.

---

## Update 20 — normalized icon and value sizing across every "Key Metrics" card

Earlier passes unified container widths, title sizes, and header badges (Update 17), but
never checked the sizing *inside* each section's metric cards — icon circles and value
numbers had drifted section by section as each one got its own redesign pass. Audited
every section's actual icon diameter and value font-size and found real outliers:

| Section | Icon (was → now) | Value (was → now) |
|---|---|---|
| Executive | 64px (no change) | 30px → **36px** |
| Entry | 64px (no change) | 48px → **36px** |
| Experience | 56px → **64px** | 30px → **36px** |
| Development | 80px → **64px** | 48px → **36px** |
| Turnover | 64px (already correct) | 36px (already correct) |
| Exit | 64px (already correct) | 36px (already correct) |
| Cost | 64px (no change) | 24-26px → **28-30px*** |

\* Cost's values are currency strings ("Rp 2.34B", "Rp 847M") sharing a horizontal row
with the icon, unlike every other section where the value sits on its own row below the
icon with the full card width available. Jumping straight to 36px risked overflowing
that tight row. Bumped it most of the way there (28-30px) rather than the full amount,
to close the gap without risking broken/clipped text — flagging this as the one
deliberate partial fix rather than a full match.

Also checked and intentionally left alone: Development's secondary detail-box icon
(56px) and Executive/Cost's small secondary signal icons (44-48px) — these are
genuinely smaller *by role* (secondary/detail elements, not the primary card icon), not
inconsistencies. Entry's and Exit's donut-chart center text already matched each other
exactly. Card padding (p-4 vs p-5) left as-is — a minor, largely content-driven
difference between denser 6-column and roomier 4-column layouts, not a real "zoom"
driver like the icon/font issues were.

---

## Update 19 — Turnover/Exit/Cost panels: white with drop shadow, matching Experience

Last update lightened these panels to a faint tint (~18% color). This update goes
further, per your reference screenshot of Experience's "Key Metrics" panel: pure white
background, a subtle border, and `shadow-soft` — exactly Experience's actual panel
class (`bg-white border border-gray-100 shadow-soft`), copied directly rather than
approximated. Applied to both panels in each section (the metrics grid wrapper and the
Leadership Insight/Signal panel) — 6 panels total across the three sections:

- `TurnoverSection.tsx`: both the Key Metrics wrapper and Leadership Insight panel
- `ExitSection.tsx`: both the Exit Intelligence panel and Leadership Signal panel
- `CostSection.tsx`: both the Workforce Economics panel and Leadership Signal panel

Removed the now-unused `PANEL` color constants from `ExitSection.tsx` and
`CostSection.tsx` since nothing references them anymore. `ActionBoxTab.tsx` (Leadership
Action) was left untouched — this request named only Turnover, Exit, and Cost, unlike
the broader "all four" instruction in Update 17.

---

## Update 18 — real logo asset + 9 targeted fixes

**Real logo, not a hand-drawn approximation.** Your uploaded PNG had a solid white
background (not transparent), so a CSS filter alone couldn't isolate the shape — I
processed it directly: removed the white background and recolored the mark to pure
white with proper anti-aliased alpha (based on distance-from-white per pixel, not a
flat threshold, so edges stay smooth rather than jagged). Rendered a test preview on
navy to confirm it looked clean before wiring it in. Saved as
`public/logo-esb-white.png`, replacing the hand-drawn SVG approximation in both
`Sidebar.tsx` and the login page — this is now your actual logo shape, not my
best-guess recreation of it.

Eight smaller fixes, all confirmed against what you flagged specifically:

1. **Executive Snapshot** — added spacing (`mt-3` on the footer zone, small gap above
   the divider) so the People icon / LOW / HIGH / Rp / MEDIUM badges sit lower, with
   real breathing room below the value number instead of crowding it.
2. **Recruitment** — Remarks, This Week Update, and Next Action numbered lists switched
   from `list-inside` to `list-outside` with proper padding. `list-inside` is a classic
   CSS trap: when text wraps to a second line, the wrapped line starts flush-left
   instead of aligning under the first line's text, which is exactly the "not neat"
   look you were seeing.
3. **Entry** — removed both the `<` `>` pagination arrows from the Key Metrics panel
   and the `>` from the Leadership Signal banner, plus the now-unused icon imports.
4. **Experience** — removed the `>` from the Leadership Signal banner.
5. **Development** — "DEVELOPMENT" label in the purple badge reduced from 10px to 8px
   (it's the longest label of any section badge, so it was sitting tighter against the
   edges than the others); removed the `>` from its Leadership Signal banner too.
6. **Turnover / Exit / Cost / Action Box** — all four panel background tints (orange,
   pink, teal, orange) recomputed to a much lighter blend (~82% white-mixed instead of
   the original saturated pastel) — "only a bit sense of the color," as asked, rather
   than a solid fill.
7. **Leadership Action** title changed back to orange (I'd made it neutral dark in the
   previous update to match its reference image literally — you're overriding that
   here, which is a legitimate call since you're looking at the live result).
8. **Contact popup** — "PEX" reverted to "PBX." I'd flagged this as an assumption last
   time specifically so it'd be easy to correct — confirmed now, fixed.

---

## Update 17 — Development/Turnover/Exit/Cost/Leadership redesigned, chat popup, global consistency

The biggest batch yet — 5 sections against 7 reference images, plus three cross-cutting
requests (icon gradients everywhere, uniform sizing, and a new contact popup). Handled
in two turns; here's everything that landed.

**New: Chat contact popup** — the floating bottom-right button is now a chat icon
instead of Home (`src/app/page.tsx`), opening `src/components/ContactModal.tsx`. Shows
all 4 PEX representatives with mailto: links. **Judgment call**: you wrote "PBX
representative," but since this app consistently uses "PEX"/"People Experience"
terminology everywhere else (including the "PX" avatar in your Governance Model
reference), I treated that as PEX in the popup title. Flagging clearly in case "PBX" was
intentional — easy one-line fix either way.

**Development, Turnover, Exit, Cost, Leadership Action** — all five already had solid
functionality in place (Development's target-bar chart, Turnover's real recharts line
chart + bar lists, Exit's donut + multi-item signal row, Cost's two line charts + donut).
None of that logic changed — this was about matching each section's actual reference
image, which turned out to **differ from section to section** rather than following one
single rule:
- Header badge shape unified to the plain rounded-square pattern (icon directly visible,
  no inner ring) across all five — previously each used the older circle-in-square hero
  pattern.
- Title colors matched **per reference as shown**, not forced to one rule: Development
  and Leadership Action use neutral dark titles; Turnover, Exit, and Cost use their
  section's own color (orange/red/teal) — because that's genuinely what each reference
  image shows, even though they're inconsistent with each other.
- Icon fill style also matched per reference: Turnover converted from solid-color fill
  to a light tonal tint (its reference clearly shows this); Exit and Cost's solid fills
  were already correct and left alone (their references show solid fill).
- Added "Updated as of [date]" to all five headers — none of them had it before.
- Development's outer panel changed from a light purple tint to white, its "Key Metrics"
  label simplified from flanking lines to plain text, and its Leadership Signal banner
  rebuilt with a trailing chevron (kept the light purple tint here specifically, since
  that's what its reference shows — unlike Entry/Experience, which use white).
- Cost's outline-only signal icons (transparent circle, border only) converted to filled
  tonal circles so they could carry the gradient treatment.
- Leadership's 3 sub-tabs (Risk Heatmap, Action Box, Governance) already matched their
  references closely from earlier polish work — added the small "Key Metrics" tag to
  Risk Heatmap (present in its reference, missing before). Governance's Partnership
  handshake circle stays as an intentional outline-only exception — it's shown that way
  in its own reference, distinct from every other (filled) badge around it.
- Confirmed "CANDENCE" in your Governance reference is a typo in the mockup — the actual
  code already spells it "Cadence" correctly, no change needed.

**Global gradient pass** — swept the *entire* codebase (every section, layout component,
and modal) for any circular/rounded icon container missing the `icon-gradient` class.
Found and fixed real gaps: Entry's `CardIcon` (pale green circles) was missing it
entirely, and `WelcomeModal`'s wave-emoji circle too. Everything else that came up in
the sweep was confirmed as correctly excluded — navigation arrows, close buttons, plain
text buttons, and the one intentional outline exception in Governance.

**"Same zoom size"** — confirmed all 10 main sections share identical title sizing
(`text-3xl md:text-4xl`) and badge dimensions (80px rounded-square). `VersionHistorySection`
was still on the older, larger sizing from before this whole redesign effort started —
brought it in line with everything else.

---

## Update 16 — Experience redesigned; same conversion as Entry, less work needed

This section already had the right chart components in place (`DonutChart` with legend,
`SimpleHBar` progress rows, `CircularProgress` rings) — they already closely matched
your reference, so none of that logic changed. This was mostly a restyle around them,
following the same pattern as the Entry update:

- **Stopped using `KeyMetricsHeader`/`LeadershipSignal`** (custom inline markup instead),
  for the same reason as Entry — your reference's layout (left-aligned label, no
  flanking lines; chevron-ended signal banner) doesn't match what those shared
  components produce, and changing the shared versions would've affected
  `DevelopmentSection`, which is now the only remaining user of both and is untouched.
- **Icon style**: changed from a white circle with a blue border to a pale blue tonal
  fill (`#E8EFFE`) — same treatment as Entry, and what your reference shows here too.
- **Card labels**: darkened from blue to neutral dark gray, and added a short divider
  beneath each one (between the label and the chart/list below it) — six cards, one
  divider each, all inserted the same way.
- **Header & panel**: badge shape changed from the circle-in-square hero pattern to the
  plain rounded-square badge (matching Entry); title neutralized from blue to dark;
  subtitle lightened and its fallback text updated to "Experience and engagement
  overview"; added "Updated as of" with a calendar icon; the "Key Metrics" panel
  background changed from a light blue tint to white; divider under the header changed
  from blue to gray. No pagination arrows here — your reference for this section didn't
  show any, unlike Entry's.
- **Leadership Signal**: background from blue-tinted to white, added the trailing
  chevron.

---

## Update 15 — Entry redesigned; stopped using two shared components on purpose

`KeyMetricsHeader` and `LeadershipSignal` (from `ui/index.tsx`) are also used by
`DevelopmentSection` and `ExperienceSection`, and your reference's layout for both —
left-aligned "Key Metrics" label with pagination arrows instead of a centered label
with flanking lines, and a chevron-ended signal banner instead of a plain one — didn't
match what those shared components produce. Modifying the shared components would have
changed Development and Experience too, which weren't part of this ask. So `EntrySection.tsx`
now has its own inline markup for both instead, and the shared components themselves are
untouched — confirmed by grepping `ui/index.tsx` for changes before packaging.

- **Icon style**: changed from a bare icon with no background to a pale green circle
  (`#E7F5EA`) with a green icon inside — a lighter, "tonal" treatment that's different
  from the solid-fill-white-icon style used everywhere else, but it's what your
  reference clearly shows, so it's intentional here specifically.
- **Header**: title color changed from green to neutral dark, subtitle lightened, added
  the "Updated as of [date]" row (wasn't present in this section before — now uses the
  same shared endpoint Home/Executive/Recruitment use), divider changed from green to
  gray. Also updated the *fallback* default title/subtitle text (only shown when no CMS
  content exists) from "Entry (Hiring & Onboarding)" / "Are We Bringing the Right People
  In?" to "Entry" / "Hiring and onboarding metrics" to match your reference — actual CMS
  content, if set, displays exactly as before.
- **Key Metrics panel**: background changed from a light green tint to white with a
  subtle border, matching the neutral-panel direction used in Executive/Recruitment.
  Added the left-aligned "Key Metrics" label + two circular arrow buttons on the right,
  matching your reference. **These arrows are intentionally inert** — Entry has exactly
  4 fixed metrics that already fit in one row, so there's nothing to actually page
  through. Styled them visibly muted (light gray, `cursor-default`, no click handler)
  rather than making them look clickable and do nothing, which would be misleading.
  Card labels darkened from light gray to bold dark gray to match.
- **Leadership Signal**: background changed from green-tinted to white, added a trailing
  chevron — same treatment as Executive's Leadership Insight banner. Kept the icon
  itself solid green (not tonal) since that's what the reference shows there.
- Removed an unused `GREEN_DARK` constant left over from the component it replaced.

---

## Update 14 — Recruitment redesigned; KPI pills and department tabs were already close

This one needed less work than the others — the 6 KPI pills and the department tab row
already matched your reference closely from an earlier pass, so those were left mostly
alone. **All department-switching logic, data fetching, and the `stats`/`positions`/
`thisWeek`/`keyInsight`/`nextAction` bindings are completely untouched** — every change
below is styling only.

- **Header badge**: switched from the circle-in-square "hero badge" pattern (used by
  Turnover, Exit, etc.) to the plain rounded-square badge pattern from `EntrySection` —
  icon directly visible, no inner ring — matching what's in your reference.
- **Title & subtitle**: title color changed from pink to neutral dark (matching Home/
  Executive), subtitle changed from bold dark to lighter gray. "Updated as of" moved to
  the top-right corner with a calendar icon, same position/style as Home and Executive.
  This still reads from the same `d.updatedAs` CMS field as before — didn't switch it
  to the shared `/api/dashboard/last-updated` endpoint Home/Executive use, since this
  one's already wired to real per-record admin data and changing that would be a
  data-source change, not a styling one.
- **Department tabs**: active tab changed from a top-rounded rectangle to a fully
  rounded pill, and removed the underline that ran across the whole tab row — both
  closer to the reference.
- **Table header**: was a solid pink fill with white text; now a light gray background
  with dark text, matching the neutral-header direction used elsewhere. Row text
  recolored to differentiate: Position and Lead Time keep a pink accent color, Level/HC/
  Remarks are now neutral dark gray (previously everything in the row was the same
  orange-brown regardless of column).
- **Insight panel**: header changed from a solid pink banner reading "Insight" to a
  lightbulb icon + label, matching how "insight" callouts look everywhere else in the
  app. Group titles ("This Week Update", "Key Insight", "Next Action") changed from
  centered to left-aligned; the actual insight text changed from a dark orange-brown to
  neutral gray, so only the section titles carry color now, not every line.
- Removed an unused `ORANGE_TEXT` color constant left over from the styling it replaced.

---

## Update 13 — Executive Snapshot rebuilt to match the reference, aligned with Home's language

You gave the OK to lean on Home's patterns where it made sense, so this reused several
pieces directly rather than inventing parallel ones:

- **Title block**: was centered with no subtitle and no "Updated as of" line at all.
  Now left-aligned title + subtitle + right-aligned "Updated as of [date]" with a
  calendar icon — identical structure to Home, including the same
  `/api/dashboard/last-updated` fetch (this section wasn't calling that endpoint
  before, so the date was simply missing).
- **Directorate banner**: icon circle changed from a translucent white/15 ring to a
  solid purple fill (`#6D4FD1`) matching the reference, and the flat navy background
  became a subtle two-tone gradient for a bit more depth.
- **KPI cards**: Total Headcount's background changed from a light teal tint to plain
  white, matching the reference (it's the only one of the five that isn't tinted). The
  underline beneath each label now picks up that card's own accent color at low opacity
  instead of a generic gray, so the color-coding reads through the whole card, not just
  the icon.
- **Leadership Insight banner**: label color changed from purple to the same dark navy
  used for its icon (was two different colors doing the same job), and added a chevron
  after the two trend/alert icons — matching both the reference and the same
  divider-icon-chevron affordance used on Home's `FeatureRow`. This one stays visual
  only (not wired to navigate anywhere) since there's no single obvious destination for
  it the way Home's rows have one each.

---

## Update 12 — Home rebuilt to match the reference, plus Sidebar & Header updated to match

**Scope note:** the reference image showed the whole page — sidebar and topbar included,
not just the content area. Since `Sidebar.tsx` and `Header.tsx` are shared across every
page, matching the reference "100%" meant updating those too, not just `HomeSection.tsx`
— otherwise Home would look right but every other page would still show the old dark
sidebar, and the app would feel like two different products depending which page you're
on. Flagging this clearly since it's a bigger blast radius than "redesign Home" implies.

**`Sidebar.tsx`:**
- Added the "S" + "ESB" logo mark above the "People Experience / Leadership Dashboard"
  text (reused the same SVG approximation built for the login page).
- Home's identity color changed from gray (`#374151`) to blue (`#1565C0`) to match the
  reference's active-state treatment.
- Active nav item restyled from a solid color fill + white text to a light tint of the
  item's own color (`${color}14` — ~8% opacity) + colored text, matching the softer
  look in the reference. Every icon (active or not) now always shows its own identity
  color, matching how Recruitment/Entry/Experience/etc. already behaved.

**`Header.tsx`:** avatar circle changed from `bg-indigo-800` to the app's primary blue
(`#1565C0`) to match. Everything else here was already close to the reference, so left
alone.

**`HomeSection.tsx`** — full rewrite:
- Title block is now left-aligned (was centered) with "Updated as of..." moved into the
  same row, right-aligned, with a calendar icon — was previously its own separate line
  above the title.
- Removed the dotted-line `SectionDivider` treatment entirely; "Lifecycle Intelligence"
  is now a plain bold label with a single line extending right, matching the reference.
- The three featured rows (Executive Snapshot, Recruitment Dashboard, Leadership Action
  Focus) rebuilt as a new shared `FeatureRow` component: white or lightly-tinted
  background (Executive is white; Recruitment gets a light rose tint; Leadership gets a
  light cream tint), title case instead of ALL CAPS, and a new right-side affordance —
  a vertical divider, an outlined preview icon, and a chevron — that didn't exist before.
- The 6-card lifecycle grid: labels changed from ALL CAPS to title case, removed the
  colored underline rule beneath each label, cards changed from a cream tint to white,
  and added a small arrow icon at the bottom of each card (present in the reference,
  missing before).

---

## Update 11 — welcome modal on Home, shown once per day

New `src/components/WelcomeModal.tsx`, rendered inside `HomeSection.tsx`. Matches the
reference structure (waving-hand badge, "Welcome to One Leadership Dashboard.", the
date line, the tagline, the tip box) but restyled with the same restrained, soft-shadow
language as the rest of this redesign rather than a literal pixel copy — you'd said
that was fine.

- **Date is fully dynamic** — computed from the visitor's own clock via `new Date()`,
  formatted as "Thursday, 13th August 2026" with correct ordinal suffixes (1st, 2nd,
  3rd, 11th–13th as an exception, 21st, etc. — verified all of these directly before
  shipping). Never hardcoded.
- **Shows once per calendar day**, not once per session and not on every visit to Home.
  Tracked via `localStorage` (`ld-welcome-shown-date`), compared against today's date —
  so it reappears each new day rather than nagging on every navigation back to Home.
  If `localStorage` is unavailable (e.g. private browsing), it just doesn't show rather
  than erroring.
- Dismiss via the X button, clicking the backdrop, or pressing Escape — all three mark
  today as "seen." Body scroll is locked while it's open.
- Entrance is a soft fade + scale-up (220–300ms), not an abrupt snap — consistent with
  the `section-enter` motion already used for section switches and category expand/
  collapse elsewhere in the app.

---

## Update 10 — login page rebuilt to match the reference image

Rebuilt `admin/login/page.tsx` to match the provided reference as closely as possible.
Auth logic (`handleLogin`, `handleForgotPassword`, cookie-setting, error handling) is
byte-for-byte unchanged — only the JSX markup changed. What's new:

- **ESB logo mark** added at the top of the left panel — a rounded-square outline badge
  with a stylized "S" glyph, next to "ESB" text. **This is an approximation**, not your
  actual vector logo — I don't have that file, so I built an SVG that's visually close
  to the reference screenshot. If you have the real logo as an SVG or PNG, send it and
  I'll drop it in for a pixel-exact match.
- Feature bullets now match the reference exactly: icons (Users, Navigation, ShieldCheck)
  and copy ("Clarity across workforce health / and organizational performance.", etc.),
  each with a bold headline line + a lighter continuation line.
- Added the short blue underline accent below the subtitle, and a large `Quote` icon
  above the closing tagline ("A clearer picture of our people...") — both present in
  the reference but missing from the previous version.
- Background: added a faint oversized "S" watermark shape and repositioned the glow to
  concentrate at the bottom-right corner, matching the reference more closely than the
  previous generic blurred circles.
- **New footer row** on the right panel — "© [current year] ESB. All rights reserved."
  and "Secure sign-in" with a shield icon, both absent before. Year is computed from
  the visitor's clock rather than hardcoded.

---

## Update 9 — collapse/expand extended one level deeper, to each section row

Update 8 made the three category headers (Lifecycle Sections, Leadership Action,
Recruitment Departments) collapsible. This extends the same behavior one level down:
every individual section row inside a category — Executive Snapshot, Entry, Turnover,
each Recruitment department, etc. — now has its own chevron toggle in the top-right
corner too, independent of its category and every other row.

`SectionRow` in `VersionHistorySection.tsx` now holds its own `open` state. The title
and Changed/Unchanged pill stay visible either way (that's the at-a-glance summary);
what collapses is the detail underneath — the Draft Saved/Published entries with editor
and timestamp for changed sections, or the "Last changed on..." line for unchanged ones.

Default state per row: sections **with a change today start expanded** (the reason
you're on this page), sections with **no change start collapsed** (nothing urgent to
see, one click away if you want it). The existing per-entry "View field changes" toggle
nested inside changed sections is untouched and still works independently — clicking
a row's chevron doesn't affect whatever field-change detail you had open inside it.

## Update 8 — every category on Version History can now minimize/expand

Previously only "Recruitment Departments" could be collapsed — "Lifecycle Sections" and
"Leadership Action" were always fully expanded with no toggle at all. All three category
headers now have a chevron icon in the top-right corner (`VersionHistorySection.tsx`,
`GroupBlock` component): click anywhere on the header to minimize or expand that
category's list of sections. Rotates 180° when open, matches the hover style already
used elsewhere in the app.

Default states on page load: **Lifecycle Sections** and **Leadership Action** start
expanded (the content people look at first), **Recruitment Departments** starts
collapsed (unchanged from before — 9 rows is a lot to greet you with by default).
Whatever you expand also gets the same subtle fade-in used for section-switch
navigation elsewhere in the app.

---

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
