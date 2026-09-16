# Freeducation — A Dynamic Website Platform for Schools

One codebase. Many schools. Different designs for each. Content from an external API.

Not a theme a school forks and edits — a platform where a school is **a configuration
record**, and its look is **a choice among variants**. Nobody forks, so everybody
upgrades.

## Read these first

| Document | What it covers |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | The foundation: contracts, data keys, view-models, variants, theming, i18n, layer rules |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | The rulebook — every rule and the mechanism that enforces it |
| [docs/CONTENT.md](docs/CONTENT.md) | What the school system must supply, field by field |
| [docs/API.md](docs/API.md) | The endpoints the site calls and what they must answer |

---

## The idea

Most schools have no developer. They need a site that looks professional, loads on a
mid-range Android over 3G, and is updated by a teacher or an office clerk.

And no two schools want the same design. So the platform separates the two things that
usually get tangled together:

- **Content is universal.** Every school has notices, teachers, routines, results.
  Those shapes never change.
- **Design is per-school.** A school picks one **design set** — a named look that dresses
  every page — not a variant per page. Its notice board, teacher list and routine cannot
  end up in three different designs.

Because design components never fetch and data code never renders, a new design is a new
folder that touches nothing else. That is the whole architecture in one sentence.

### Three ways to customise a school — and only three

1. **Config** — name, logo, contacts, locales, feature flags, menu
2. **Theme tokens** — colours, type, spacing
3. **Design set** — one line, `"design": "editorial"`, and every page follows

Anything a school needs beyond these is a missing platform feature, not a reason to
fork. See ARCHITECTURE §8.

---

## Menus

Based on a survey of real Bangladeshi college sites — [Rajuk Uttara Model
College](https://www.rajukcollege.edu.bd/), [Milestone School &
College](https://www.milestonecollege.edu.bd/), [BAF Shaheen College
Kurmitola](https://bafsk.edu.bd/), [Government Mujib
College](https://govmujibcollege.edu.bd/), [Dhaka Commerce
College](https://www.dcc.edu.bd/) — rather than on assumption.

The menu is **config, not code**. Every item can be renamed, reordered, hidden or
translated per school. The structure below is the default vocabulary.

### Top utility bar

School name and EIIN · phone and email · **Bangla / English switch** · search ·
**Login** · social links · scrolling notice ticker

### Main navigation

| Menu | Children |
|---|---|
| **Home** | — |
| **About** | At a Glance · History · Mission & Vision · Facilities · Achievements · Campus |
| **Administration** | Principal · Vice Principal · Governing Body / Managing Committee · Teacher List · Officers & Staff |
| **Academics** | Programs & Departments · Class Routine · Exam Routine · Academic Calendar · Syllabus & Books · Library · Rules |
| **Admission** | Admission Information · **Apply Online** · Admission Notice · Fees |
| **Notice** | All notices · academic · office · events · events calendar |
| **Results** | Result lookup by examination and roll number |
| **Students** | Students Corner · Clubs & Co-curricular · Scholarships & Stipends · Transport · Hostel · Health · Guardianship · Alumni |
| **Career** | Job Circulars · Application Process |
| **Gallery** | Photo gallery · video gallery |
| **Contact** | Address & map · contact form · department contacts |

Highlighted separately, because they are what most visitors actually came for:
**Admission / Apply Now** and **Results**.

### What the survey changed

Five things the real sites do that a generic school template gets wrong:

- **Administration is top-level**, not buried under About. Principal, Governing Body and
  Teacher List are primary destinations in Bangladesh.
- **Notices split by audience** — Academic Notice and Office Notice are separate menus.
- **Career is a standard menu item.** Teacher and staff recruitment circulars.
- **Admission results and exam results are different things**, reached at different
  times of year by different people.
- **Facilities and co-curricular deserve real depth** — hostel, transport, guardianship,
  medical, counselling, and named clubs each get a page. Parents choose on these.

Government institutions additionally publish teacher, staff and student lists as a
transparency duty, so those are first-class list pages, not afterthoughts.

---

## Where this sits

This repository is **the public face only**. Content is authored and owned elsewhere —
in the school system's own dashboard — and reaches this site through a keyed API.

```
   your dashboard                 this repository              a visitor
  ┌────────────────┐   API key   ┌──────────────────┐        ┌──────────┐
  │ notices        │ ──────────► │ contracts        │ ─────► │ a school │
  │ teachers       │   JSON      │ designs          │  HTML  │ website  │
  │ results, menus │             │ per-school config│        └──────────┘
  └────────────────┘             └──────────────────┘
```

Nothing is authored here. There is no admin interface, no login, and no second place to
edit content — that would only duplicate the dashboard. What this repository owns is the
menu-to-page mapping, the designs, and each school's configuration.

Two generated documents describe the join, from each side:

| Document | For |
|---|---|
| [docs/CONTENT.md](docs/CONTENT.md) | **What the dashboard has to supply** — every content type, field by field, required or optional |
| [docs/API.md](docs/API.md) | **How the site asks for it** — endpoints, parameters, and a valid example response for each |

Both are generated from the site's own schemas as snapshot tests, so neither can drift
from what the code actually does.

## Principles

Mobile first · fast on 3G · bilingual from day one · accessible · printable routines and
results · calm and institutional rather than flashy.

## Running it

```bash
npm install
npm run dev                        # the demo school
PUBLIC_SCHOOL=hillview npm run dev # a different school: different designs, colours, language
npm run verify                     # structure + lint + types + tests
```

Four example schools are included. They share every line of code and differ only in
their JSON:

| School | Language | Design | Look |
|---|---|---|---|
| `demo` | Bangla-first, green | `classic` | Newsroom front page, dense notice table, alpona ornament |
| `riverside` | English-first, maroon | `journal` | Notice-led front page, carded notices, photo grid, terracotta ornament |
| `hillview` | English-first, indigo | `quiet` | Stacked front page, notice timeline, kantha ornament |
| `crestwood` | English-first, ivory | `editorial` | The premium tier: panelled blocks, ruled rows, the building leading |

Changing any of them to another look is one line:

```json
{ "design": "editorial" }
```

## Deploying

Each school is its own Cloudflare Worker, deployed by GitHub Actions on every push to
`main`. To switch it on, add two repository secrets under
**Settings → Secrets and variables → Actions**:

| Secret | Where it comes from |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → *Edit Cloudflare Workers* |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → Account ID in the sidebar |

Add `CONTENT_API_KEY` too once the content API exists; it is pushed to the Worker as a
secret, never committed.

Until those secrets exist the deploy job skips with a notice rather than failing. Add a
school to the matrix in `.github/workflows/deploy.yml` to deploy it as well.

## Status

| Stage | State |
|---|---|
| Repository reset | Done |
| Menu research | Done |
| Architecture & conventions | Done |
| Stack decision | Astro 7 + TypeScript, server-rendered on Cloudflare |
| Foundation | Done — contracts, data, config, tokens, i18n, routing, 16 views, 39 variants |
| Design sets | Done — 4 complete looks, enforced whole-site; `editorial` has its own variant for all 16 views |
| Features | Done — search, ticker, routine, results, forms, events calendar, video gallery, dark mode, images |
| Enforcement | Done — boundaries, 5 project lint rules, structure verifier, contract harness, 260 tests |
| Deployment | Workflow ready — needs two Cloudflare secrets added to the repository |
| Real content API | Adapter written and integration-tested; not yet pointed at a live backend |

The ordered next steps are at the end of
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
