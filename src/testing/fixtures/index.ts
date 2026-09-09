import type {
  ClassRef, ExamRef, GalleryAlbum, Navigation, Notice, Person, ResultRecord, RichPage, Routine,
  SchoolEvent, SchoolProfile, SearchHit, Stat,
} from '../../contracts/index.js'

const t = (bn: string, en: string) => ({ bn, en })

const profile: SchoolProfile = {
  name: t('আদর্শ স্কুল অ্যান্ড কলেজ', 'Adarsha School & College'),
  shortName: t('আদর্শ', 'Adarsha'),
  tagline: t('জ্ঞানই আলো', 'Knowledge is light'),
  eiin: '108573',
  established: '1965',
  address: t('১২ কলেজ রোড, ঢাকা ১২০৫', '12 College Road, Dhaka 1205'),
  phones: ['+880 2 9876543'],
  emails: ['info@adarsha.edu.bd'],
  social: { facebook: 'https://facebook.com/example', youtube: 'https://youtube.com/@example' },
}

const stats: Stat[] = [
  { label: t('শিক্ষার্থী', 'Students'), value: '4,200' },
  { label: t('শিক্ষক', 'Teachers'), value: '145' },
  { label: t('পাশের হার', 'Pass rate'), value: '98%' },
  { label: t('প্রতিষ্ঠাকাল', 'Established'), value: '1965' },
]

/** Menu item helper — every page in the site is one of these entries. */
const item = (
  id: string, bn: string, en: string, path: string, view: Navigation['primary'][number]['view'],
  extra: Partial<Navigation['primary'][number]> = {},
) => ({
  id, label: t(bn, en), path, view,
  params: {}, visible: true, highlighted: false, children: [],
  ...extra,
})

const navigation: Navigation = {
  utility: [
    // Reachable but not shown as a menu entry: the header renders its own search box.
    item('search', 'খুঁজুন', 'Search', 'search', 'search', { visible: false }),
    item('login', 'লগইন', 'Login', 'login', 'external-link', { externalUrl: '#' }),
  ],
  primary: [
    item('home', 'হোম', 'Home', '', 'home'),
    item('about', 'পরিচিতি', 'About', 'about', 'rich-page', {
      children: [
        item('about-glance', 'এক নজরে', 'At a Glance', 'about', 'rich-page'),
        item('about-history', 'ইতিহাস', 'History', 'about/history', 'rich-page'),
        item('about-mission', 'লক্ষ্য ও উদ্দেশ্য', 'Mission & Vision', 'about/mission', 'rich-page'),
        item('about-facilities', 'সুযোগ-সুবিধা', 'Facilities', 'about/facilities', 'rich-page'),
      ],
    }),
    item('administration', 'প্রশাসন', 'Administration', 'administration', 'person-list', {
      params: { group: 'governing-body' },
      children: [
        item('admin-principal', 'অধ্যক্ষ', 'Principal', 'administration/principal', 'rich-page'),
        item('admin-governing', 'পরিচালনা পর্ষদ', 'Governing Body', 'administration', 'person-list', { params: { group: 'governing-body' } }),
        item('admin-teachers', 'শিক্ষকবৃন্দ', 'Teacher List', 'administration/teachers', 'person-list', { params: { group: 'teachers' } }),
        item('admin-staff', 'কর্মকর্তা ও কর্মচারী', 'Officers & Staff', 'administration/staff', 'person-list', { params: { group: 'staff' } }),
      ],
    }),
    item('academics', 'একাডেমিক', 'Academics', 'academics', 'rich-page', {
      children: [
        item('acad-routine', 'ক্লাস রুটিন', 'Class Routine', 'academics/routine', 'routine'),
        item('acad-calendar', 'শিক্ষাপঞ্জি', 'Academic Calendar', 'academics/calendar', 'rich-page'),
        item('acad-syllabus', 'সিলেবাস', 'Syllabus & Books', 'academics/syllabus', 'rich-page'),
      ],
    }),
    item('admission', 'ভর্তি', 'Admission', 'admission', 'rich-page', {
      highlighted: true,
      children: [
        item('adm-notice', 'ভর্তি বিজ্ঞপ্তি', 'Admission Notice', 'notice/admission', 'notice-list', { params: { category: 'admission' } }),
        item('adm-fees', 'ফি কাঠামো', 'Fees', 'admission/fees', 'rich-page'),
      ],
    }),
    item('notice', 'নোটিশ', 'Notice', 'notice', 'notice-list', {
      children: [
        item('notice-academic', 'একাডেমিক নোটিশ', 'Academic Notice', 'notice/academic', 'notice-list', { params: { category: 'academic' } }),
        item('notice-office', 'অফিস নোটিশ', 'Office Notice', 'notice/office', 'notice-list', { params: { category: 'office' } }),
        item('notice-events', 'অনুষ্ঠান', 'Events', 'events', 'event-list'),
      ],
    }),
    item('results', 'ফলাফল', 'Results', 'results', 'result-lookup'),
    item('gallery', 'গ্যালারি', 'Gallery', 'gallery', 'gallery-albums'),
    item('career', 'ক্যারিয়ার', 'Career', 'career', 'notice-list', { params: { category: 'career' } }),
    item('contact', 'যোগাযোগ', 'Contact', 'contact', 'contact'),
  ],
  footer: [
    item('f-notice', 'নোটিশ', 'Notice', 'notice', 'notice-list'),
    item('f-admission', 'ভর্তি', 'Admission', 'admission', 'rich-page'),
    item('f-contact', 'যোগাযোগ', 'Contact', 'contact', 'contact'),
  ],
}

const notices: Notice[] = [
  {
    id: 'n1', slug: 'admission-2026', category: 'admission', pinned: true,
    title: t('২০২৬ শিক্ষাবর্ষে একাদশ শ্রেণিতে ভর্তি বিজ্ঞপ্তি', 'Class XI admission notice for the 2026 session'),
    summary: t('অনলাইনে আবেদন শুরু ১০ জানুয়ারি।', 'Online applications open on 10 January.'),
    body: t('<p>বিস্তারিত সময়সূচি সংযুক্ত বিজ্ঞপ্তিতে দেখুন।</p>', '<p>See the attached circular for the full schedule.</p>'),
    publishedAt: '2026-01-05T04:00:00.000Z',
    attachments: [{ label: t('ভর্তি বিজ্ঞপ্তি', 'Admission circular'), url: '#', mimeType: 'application/pdf' }],
  },
  {
    id: 'n2', slug: 'half-yearly-routine', category: 'academic', pinned: false,
    title: t('অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশ', 'Half-yearly examination routine published'),
    summary: t('পরীক্ষা শুরু ২০ জুন।', 'Examinations begin on 20 June.'),
    publishedAt: '2026-05-28T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n3', slug: 'office-closure', category: 'office', pinned: false,
    title: t('অফিস বন্ধ থাকার বিজ্ঞপ্তি', 'Office closure notice'),
    publishedAt: '2026-04-11T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n4', slug: 'lecturer-recruitment', category: 'career', pinned: false,
    title: t('প্রভাষক নিয়োগ বিজ্ঞপ্তি', 'Lecturer recruitment circular'),
    summary: t('পদার্থবিজ্ঞান ও গণিত বিভাগে।', 'For the Physics and Mathematics departments.'),
    publishedAt: '2026-03-02T04:00:00.000Z', attachments: [],
  },
]

const people: Person[] = [
  { id: 'p1', group: 'governing-body', order: 1, name: t('জনাব রফিকুল ইসলাম', 'Mr Rafiqul Islam'), designation: t('সভাপতি', 'Chairman') },
  { id: 'p2', group: 'governing-body', order: 2, name: t('ড. নাজমা বেগম', 'Dr Nazma Begum'), designation: t('সদস্য', 'Member') },
  { id: 'p3', group: 'teachers', order: 1, name: t('মোঃ আনিসুর রহমান', 'Md Anisur Rahman'), designation: t('অধ্যক্ষ', 'Principal'), department: t('প্রশাসন', 'Administration') },
  { id: 'p4', group: 'teachers', order: 2, name: t('সেলিনা আক্তার', 'Selina Akhter'), designation: t('সহকারী অধ্যাপক', 'Assistant Professor'), department: t('পদার্থবিজ্ঞান', 'Physics') },
  { id: 'p5', group: 'staff', order: 1, name: t('আব্দুল করিম', 'Abdul Karim'), designation: t('হিসাবরক্ষক', 'Accountant') },
]

const pages: RichPage[] = [
  {
    slug: 'about', title: t('এক নজরে', 'At a Glance'), updatedAt: '2026-02-01T00:00:00.000Z',
    blocks: [
      { type: 'richtext', html: t('<p>১৯৬৫ সালে প্রতিষ্ঠিত এই প্রতিষ্ঠান ঢাকার অন্যতম প্রাচীন শিক্ষাপ্রতিষ্ঠান।</p>', '<p>Founded in 1965, the institution is among the oldest in Dhaka.</p>') },
      { type: 'table', header: true, rows: [
        [t('বিষয়', 'Field'), t('তথ্য', 'Detail')],
        [t('ইআইআইএন', 'EIIN'), t('১০৮৫৭৩', '108573')],
        [t('প্রতিষ্ঠাকাল', 'Established'), t('১৯৬৫', '1965')],
      ] },
    ],
  },
  { slug: 'about/history', title: t('ইতিহাস', 'History'), blocks: [{ type: 'richtext', html: t('<p>প্রতিষ্ঠানের ইতিহাস।</p>', '<p>The history of the institution.</p>') }] },
  { slug: 'about/mission', title: t('লক্ষ্য ও উদ্দেশ্য', 'Mission & Vision'), blocks: [] },
  { slug: 'about/facilities', title: t('সুযোগ-সুবিধা', 'Facilities'), blocks: [{ type: 'richtext', html: t('<p>লাইব্রেরি, ল্যাব, পরিবহন ও ছাত্রাবাস।</p>', '<p>Library, laboratories, transport and hostel.</p>') }] },
  { slug: 'academics', title: t('একাডেমিক', 'Academics'), blocks: [] },
  { slug: 'admission', title: t('ভর্তি তথ্য', 'Admission Information'), blocks: [{ type: 'richtext', html: t('<p>ভর্তি সংক্রান্ত সাধারণ তথ্য।</p>', '<p>General admission information.</p>') }] },
  { slug: 'administration/principal', title: t('অধ্যক্ষের বাণী', "Principal's Message"), blocks: [{ type: 'richtext', html: t('<p>শুভেচ্ছা।</p>', '<p>Greetings.</p>') }] },
]

const events: SchoolEvent[] = [
  { id: 'e1', slug: 'annual-sports-2026', title: t('বার্ষিক ক্রীড়া প্রতিযোগিতা', 'Annual Sports Day'), startsAt: '2026-12-18T03:00:00.000Z', location: t('কলেজ মাঠ', 'College ground') },
  { id: 'e2', slug: 'science-fair-2026', title: t('বিজ্ঞান মেলা', 'Science Fair'), startsAt: '2026-11-05T03:00:00.000Z' },
]

const albums: GalleryAlbum[] = [
  { id: 'a1', slug: 'annual-sports-2026', title: t('বার্ষিক ক্রীড়া ২০২৬', 'Annual Sports 2026'), photos: [], takenAt: '2026-12-18T00:00:00.000Z' },
]

const classes: ClassRef[] = [
  { id: 'nine', label: t('নবম শ্রেণি', 'Class Nine') },
  { id: 'ten', label: t('দশম শ্রেণি', 'Class Ten') },
]

const subject = (bn: string, en: string, teacher: [string, string]) =>
  ({ subject: t(bn, en), teacher: t(teacher[0], teacher[1]) })

const routines: Record<string, Routine> = {
  nine: {
    classRef: classes[0]!,
    days: [t('রবিবার', 'Sunday'), t('সোমবার', 'Monday'), t('মঙ্গলবার', 'Tuesday')],
    periods: [
      { label: t('১ম', '1st'), startsAt: '09:00', endsAt: '09:45' },
      { label: t('২য়', '2nd'), startsAt: '09:45', endsAt: '10:30' },
      { label: t('৩য়', '3rd'), startsAt: '10:30', endsAt: '11:15' },
    ],
    grid: [
      [subject('বাংলা', 'Bangla', ['সেলিনা আক্তার', 'Selina Akhter']), subject('গণিত', 'Mathematics', ['মোঃ আনিসুর রহমান', 'Md Anisur Rahman']), null],
      [subject('ইংরেজি', 'English', ['সেলিনা আক্তার', 'Selina Akhter']), null, subject('পদার্থবিজ্ঞান', 'Physics', ['সেলিনা আক্তার', 'Selina Akhter'])],
      [null, subject('রসায়ন', 'Chemistry', ['মোঃ আনিসুর রহমান', 'Md Anisur Rahman']), subject('বাংলা', 'Bangla', ['সেলিনা আক্তার', 'Selina Akhter'])],
    ],
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  ten: {
    classRef: classes[1]!,
    days: [t('রবিবার', 'Sunday'), t('সোমবার', 'Monday')],
    periods: [
      { label: t('১ম', '1st'), startsAt: '09:00', endsAt: '09:45' },
      { label: t('২য়', '2nd'), startsAt: '09:45', endsAt: '10:30' },
    ],
    grid: [
      [subject('গণিত', 'Mathematics', ['মোঃ আনিসুর রহমান', 'Md Anisur Rahman']), subject('জীববিজ্ঞান', 'Biology', ['সেলিনা আক্তার', 'Selina Akhter'])],
      [subject('ইংরেজি', 'English', ['সেলিনা আক্তার', 'Selina Akhter']), null],
    ],
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
}

const exams: ExamRef[] = [
  { id: 'half-yearly-2026', label: t('অর্ধবার্ষিক ২০২৬', 'Half-yearly 2026') },
  { id: 'annual-2026', label: t('বার্ষিক ২০২৬', 'Annual 2026') },
]

const results: ResultRecord[] = [
  {
    roll: '101', exam: t('অর্ধবার্ষিক ২০২৬', 'Half-yearly 2026'),
    studentName: t('তানভীর হাসান', 'Tanvir Hasan'), className: t('নবম শ্রেণি', 'Class Nine'),
    gpa: '5.00', publishedAt: '2026-07-10T00:00:00.000Z',
    subjects: [
      { name: t('বাংলা', 'Bangla'), grade: 'A+', points: 5 },
      { name: t('ইংরেজি', 'English'), grade: 'A+', points: 5 },
      { name: t('গণিত', 'Mathematics'), grade: 'A+', points: 5 },
    ],
  },
  {
    roll: '102', exam: t('অর্ধবার্ষিক ২০২৬', 'Half-yearly 2026'),
    studentName: t('মেহজাবিন চৌধুরী', 'Mehzabin Chowdhury'), className: t('নবম শ্রেণি', 'Class Nine'),
    gpa: '4.50', publishedAt: '2026-07-10T00:00:00.000Z',
    subjects: [
      { name: t('বাংলা', 'Bangla'), grade: 'A', points: 4 },
      { name: t('ইংরেজি', 'English'), grade: 'A+', points: 5 },
    ],
  },
]

/** Naive substring search across the sample content, mirroring what a backend would do. */
function search(query: string): SearchHit[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  const matches = (text: Record<string, string> | undefined) =>
    Object.values(text ?? {}).some(value => value.toLowerCase().includes(needle))

  return [
    ...notices.filter(n => matches(n.title) || matches(n.summary))
      .map((n): SearchHit => ({ title: n.title, path: `notice/${n.slug}`, kind: 'notice', snippet: n.summary, date: n.publishedAt })),
    ...pages.filter(p => matches(p.title))
      .map((p): SearchHit => ({ title: p.title, path: p.slug, kind: 'page' })),
    ...people.filter(p => matches(p.name) || matches(p.designation))
      .map((p): SearchHit => ({ title: p.name, path: 'administration/teachers', kind: 'person', snippet: p.designation })),
    ...events.filter(e => matches(e.title))
      .map((e): SearchHit => ({ title: e.title, path: `events/${e.slug}`, kind: 'event', date: e.startsAt })),
  ]
}

export const fixtures = {
  profile, stats, navigation, notices, people, pages, events, albums,
  classes, routines, exams, results, search,
}
