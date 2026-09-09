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

---

## The idea

Most schools have no developer. They need a site that looks professional, loads on a
mid-range Android over 3G, and is updated by a teacher or an office clerk.

And no two schools want the same design. So the platform separates the two things that
usually get tangled together:

- **Content is universal.** Every school has notices, teachers, routines, results.
  Those shapes never change.
- **Design is per-school.** Homepage, notice board, teacher list — each has several
  designs, and a school picks one per page.

Because design components never fetch and data code never renders, a new design is a new
folder that touches nothing else. That is the whole architecture in one sentence.

### Three ways to customise a school — and only three

1. **Config** — name, logo, contacts, locales, feature flags, menu
2. **Theme tokens** — colours, type, spacing
3. **Variant choice** — which design each page uses

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
| **Admission** | Admission Notice · Eligibility & Process · Apply Online · Fees · Admission Result / Merit List · Prospectus · FAQ |
| **Notice** | Academic Notice · Office Notice · News · Events · Circulars & Downloads |
| **Results** | Exam Results · Result Lookup · Board Results |
| **Students** | Students Corner · Clubs & Co-curricular · Scholarships & Stipends · Transport · Hostel · Health · Guardianship · Alumni |
| **Career** | Job Circulars · Application Process |
| **Gallery** | Photo Gallery · Video Gallery |
| **Contact** | Address & Map · Contact Form · Department Contacts |

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

## Scope

**Phase 1 — the public site.** Everything above, driven by config and external content.

**Phase 2 — the portal.** Admin manages content; teachers take attendance and enter
marks; students and guardians see routine, results and fees. The architecture is built
so phase 1 is not thrown away to get there.

Phase 1 must be genuinely useful with no login at all.

## Principles

Mobile first · fast on 3G · bilingual from day one · accessible · printable routines and
results · calm and institutional rather than flashy.

## Running it

```bash
npm install
npm run dev                        # the demo school
PUBLIC_SCHOOL=riverside npm run dev # a different school: different designs, colours, language
npm run verify                     # structure + lint + types + tests
```

Two example schools are included. They share every line of code and differ only in
their JSON: `demo` is Bangla-first with the split hero and a dense notice table;
`riverside` is English-first, maroon, with the notice-led homepage and card notices.

## Status

| Stage | State |
|---|---|
| Repository reset | Done |
| Menu research | Done |
| Architecture & conventions | Done |
| Stack decision | Astro 7 + TypeScript, server-rendered on Cloudflare |
| Foundation | Done — contracts, data, config, tokens, i18n, routing, 10 views, 13 variants |
| Enforcement | Done — boundaries, structure verifier, contract harness, 81 tests |
| Real content API | Not started — waiting on the API |

Known limitations and the ordered next steps are at the end of
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
