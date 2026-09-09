# Freeducation — A Free Website Template for Schools

A clean, reusable website template that **any school can adopt and launch quickly**.
Every school gets the same well-built site; only the content changes — school name,
logo, colours, photos, notices, teachers, classes and contact details.

This repository was reset to a blank slate. This document is the plan we build from.

---

## 1. What we are building

**One template, many schools.**

Most schools do not have a developer. They need a website that looks professional,
works on a cheap phone with slow internet, and can be updated by a teacher or an
office clerk without touching code.

So the template is built around three ideas:

1. **Configure, don't code.** A school fills in its details in one place — name,
   address, logo, colours, phone numbers, social links — and the whole site updates.
2. **Content over layout.** Notices, events, teachers, gallery photos and results are
   data. The layout never has to be edited to publish a new notice.
3. **Works everywhere.** Fast on 3G, readable on a small phone, printable, and
   accessible for people using screen readers or larger text.

### Who uses the site

| Visitor | What they came for |
|---|---|
| Parents / guardians | Admission info, fees, notices, exam results, contact numbers |
| Prospective students | What the school teaches, facilities, how to apply |
| Current students | Routine, syllabus, notices, results, downloads |
| Teachers & staff | Notices, calendar, internal links |
| Alumni & community | News, events, gallery, giving back |
| Education officials | Basic institution info, EIIN/registration data, governing body |

---

## 2. Site structure and menus

The navigation is deliberately shallow — **eight top-level items**, each with a small
dropdown. A parent should reach anything in two clicks.

### Top utility bar (above the main menu)

A thin strip carrying the things people hunt for:

- School name / EIIN or registration number
- Phone and email
- **Language switch** (English / Bangla — the template is bilingual from day one)
- **Search**
- **Login** (student / teacher / admin portal)
- Social media icons
- A scrolling **notice ticker** for urgent announcements

### Main navigation

**1. Home**
The landing page. Hero banner with the school's photo and tagline, latest notices,
upcoming events, quick links (Admission, Results, Routine, Notice), a short "about"
strip, principal's photo and message snippet, achievement counters (students,
teachers, pass rate, years running), and a photo strip.

**2. About**
- Overview / At a Glance — founding year, EIIN, board, shifts, student count
- History
- Mission, Vision & Values
- Message from the Principal
- Message from the Chairman / Governing Body
- Governing Body / Managing Committee — names, roles, photos
- Teachers & Staff — searchable directory by department
- Campus & Facilities — labs, library, playground, canteen, hostel, transport
- Achievements & Recognition
- Former Principals / Honour Board

**3. Academics**
- Programs & Curriculum — Primary, Junior, Secondary, Higher Secondary
- Departments / Groups — Science, Business Studies, Humanities
- Class Routine (timetable, per class and section)
- Syllabus & Book List (downloadable per class)
- Academic Calendar
- Examination System & Grading
- Library
- Co-curricular Activities

**4. Admission**
- Admission Notice & Important Dates
- Eligibility & Criteria
- **Apply Online** — the application form
- Fees & Payment Structure
- Prospectus & Forms (downloads)
- Admission Results / Merit List
- FAQ

**5. Students**
- Student Portal (login)
- Rules & Code of Conduct
- Uniform & Dress Code
- Attendance Policy
- Clubs & Societies — scouts, debate, sports, cultural
- Scholarships & Stipends
- Transport
- Health & Counselling
- Alumni

**6. Notice & Events**
- Notice Board — the full archive, filterable and searchable
- News & Announcements
- Events Calendar
- Circulars & Downloads (forms, routines, results in PDF)
- Tenders / Public Notices

**7. Gallery**
- Photo Albums (by event or year)
- Video Gallery
- Campus Tour

**8. Contact**
- Address with an embedded map
- Phone, email, office hours
- Contact form
- Department / office-wise contacts
- How to reach us

### Highlighted action buttons

Two buttons sit apart from the menu, styled to stand out, because they are what most
visitors actually want:

- **Admission / Apply Now**
- **Results**

### Footer

Four columns plus a bottom bar:

- **About** — logo, one-paragraph description, social icons
- **Quick Links** — Admission, Notice, Routine, Results, Gallery, Contact
- **Useful Links** — Ministry of Education, Education Board, Textbook Board, national
  portal (each configurable per country/region)
- **Contact** — address, phone, email, small map
- **Bottom bar** — copyright, privacy policy, terms, "Built with Freeducation"

---

## 3. Pages to build (phase 1 — the public website)

| # | Page | Notes |
|---|---|---|
| 1 | Home | Hero, notices, events, quick links, stats, gallery strip |
| 2 | About / Overview | At-a-glance table + history + mission |
| 3 | Principal's Message | Photo, signature, message |
| 4 | Governing Body | Card grid |
| 5 | Teachers & Staff | Filterable directory + individual profile |
| 6 | Facilities | Icon grid with photos |
| 7 | Academics overview | Program cards |
| 8 | Class Routine | Responsive timetable, printable |
| 9 | Syllabus & Books | Per-class download list |
| 10 | Academic Calendar | Month view + list view |
| 11 | Admission | Info + dates + fees table |
| 12 | Apply Online | Multi-step form with validation |
| 13 | Notice Board | List + detail, search, category filter, PDF attachments |
| 14 | Events | Calendar + detail page |
| 15 | Results | Roll/registration lookup |
| 16 | Gallery | Album grid + lightbox |
| 17 | Contact | Form + map + directions |
| 18 | Search results | Site-wide search |
| 19 | 404 / error | Friendly fallback |

## 4. Phase 2 — the school portal (behind login)

Once the public site is solid, the same codebase grows a private area:

- **Admin** — manage notices, events, teachers, classes, gallery, site settings
- **Teacher** — attendance, marks entry, class materials
- **Student / Guardian** — routine, results, fees status, downloads
- Role-based access, so a teacher never sees admin settings

Phase 1 must be genuinely useful on its own, without any of this.

---

## 5. How a school adopts the template

1. Copy the repository.
2. Edit **one config file** — school name, logo, colours, contact details, menu
   items it wants to hide, language.
3. Replace the sample photos.
4. Add notices, teachers and classes as content.
5. Deploy.

Nothing above requires editing a page layout. If a school has no hostel, it switches
that menu item off in config rather than deleting code.

## 6. Design principles

- **Mobile first.** Most parents open the site on a phone.
- **Fast.** Small pages, compressed images, no heavy frameworks on the public site.
- **Accessible.** Proper headings, contrast, keyboard navigation, alt text, larger-text
  support.
- **Bilingual.** Every label comes from a translation file, never hardcoded.
- **Printable.** Routines, notices and results print cleanly.
- **Calm and institutional.** Trustworthy, not flashy — a school site, not a startup
  landing page.

---

## 7. Status

| Stage | State |
|---|---|
| Repository reset | Done |
| Site structure & menus | This document |
| Tech stack decision | Next |
| Phase 1 build | Not started |

Next step: agree on the structure above, then choose the stack and start building the
Home page and the shared header/footer/navigation.
