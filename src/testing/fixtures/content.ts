import type { GalleryAlbum, RichPage, SchoolProfile, Stat, Video } from '../../contracts/index.js'
import { campus, t } from './text.js'

export const profile: SchoolProfile = {
  name: t('আদর্শ স্কুল অ্যান্ড কলেজ', 'Adarsha School & College'),
  shortName: t('আদর্শ', 'Adarsha'),
  tagline: t('জ্ঞানই আলো', 'Knowledge is light'),
  eiin: '108573',
  established: '1965',
  logo: { url: '/sample/crest.svg', width: 64, height: 64, variants: [] },
  address: t('১২ কলেজ রোড, ধানমন্ডি, ঢাকা ১২০৫', '12 College Road, Dhanmondi, Dhaka 1205'),
  phones: ['+880 2 9876543', '+880 1711 223344'],
  emails: ['info@adarsha.edu.bd'],
  social: { facebook: 'https://facebook.com/example', youtube: 'https://youtube.com/@example' },
}

export const stats: Stat[] = [
  { label: t('শিক্ষার্থী', 'Students'), value: '4,200' },
  { label: t('শিক্ষক', 'Teachers'), value: '145' },
  { label: t('পাশের হার', 'Pass rate'), value: '98%' },
  { label: t('প্রতিষ্ঠাকাল', 'Established'), value: '1965' },
]

const paragraph = (bn: string, en: string) => ({ type: 'richtext' as const, html: t(bn, en) })

export const pages: RichPage[] = [
  {
    slug: 'about', title: t('এক নজরে', 'At a Glance'), updatedAt: '2026-02-01T00:00:00.000Z',
    blocks: [
      paragraph(
        '<p>১৯৬৫ সালে প্রতিষ্ঠিত আদর্শ স্কুল অ্যান্ড কলেজ ঢাকার অন্যতম প্রাচীন শিক্ষাপ্রতিষ্ঠান। ষষ্ঠ শ্রেণি থেকে দ্বাদশ শ্রেণি পর্যন্ত বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক — তিনটি শাখায় পাঠদান করা হয়।</p>',
        '<p>Founded in 1965, Adarsha School &amp; College is among the oldest institutions in Dhaka. It teaches from Class Six to Class Twelve across three groups: Science, Business Studies and Humanities.</p>',
      ),
      {
        type: 'table', header: true,
        rows: [
          [t('বিষয়', 'Field'), t('তথ্য', 'Detail')],
          [t('ইআইআইএন', 'EIIN'), t('১০৮৫৭৩', '108573')],
          [t('প্রতিষ্ঠাকাল', 'Established'), t('১৯৬৫', '1965')],
          [t('শিক্ষা বোর্ড', 'Education board'), t('ঢাকা', 'Dhaka')],
          [t('শিফট', 'Shifts'), t('প্রভাতি ও দিবা', 'Morning and Day')],
          [t('শিক্ষার্থী সংখ্যা', 'Students'), t('৪,২০০', '4,200')],
        ],
      },
    ],
  },
  {
    slug: 'about/history', title: t('ইতিহাস', 'History'),
    blocks: [
      paragraph(
        '<p>স্থানীয় কয়েকজন শিক্ষানুরাগীর উদ্যোগে ১৯৬৫ সালে মাত্র দুটি কক্ষ ও ৪০ জন শিক্ষার্থী নিয়ে প্রতিষ্ঠানটির যাত্রা শুরু হয়।</p><p>১৯৮৪ সালে কলেজ শাখা চালু হয় এবং ১৯৯৭ সালে বিজ্ঞান বিভাগে উচ্চমাধ্যমিক পাঠদানের অনুমতি পাওয়া যায়।</p>',
        '<p>The institution began in 1965 with two rooms and forty students, on the initiative of a few local educationists.</p><p>The college section opened in 1984, and permission to teach higher secondary science followed in 1997.</p>',
      ),
      { type: 'image', image: { ...campus, alt: t('পুরোনো ভবন', 'The original building') }, caption: t('প্রতিষ্ঠার প্রথম ভবন', 'The first building') },
    ],
  },
  {
    slug: 'about/mission', title: t('লক্ষ্য ও উদ্দেশ্য', 'Mission & Vision'),
    blocks: [
      paragraph(
        '<p>আমাদের লক্ষ্য এমন শিক্ষার্থী গড়ে তোলা যারা জ্ঞানে দক্ষ, চরিত্রে সৎ এবং সমাজের প্রতি দায়বদ্ধ।</p>',
        '<p>Our aim is to form students who are capable in knowledge, honest in character and responsible towards society.</p>',
      ),
    ],
  },
  {
    slug: 'about/facilities', title: t('সুযোগ-সুবিধা', 'Facilities'),
    blocks: [
      paragraph(
        '<p>তিনটি বিজ্ঞানাগার, ১২,০০০ বইয়ের গ্রন্থাগার, মাল্টিমিডিয়া শ্রেণিকক্ষ, ছাত্রাবাস, পরিবহন ও চিকিৎসা সুবিধা রয়েছে।</p>',
        '<p>The campus has three laboratories, a library of 12,000 books, multimedia classrooms, a hostel, transport and medical facilities.</p>',
      ),
      { type: 'image', image: { ...campus, alt: t('কলেজ প্রাঙ্গণ', 'The college campus') }, caption: t('আমাদের ক্যাম্পাস', 'Our campus') },
    ],
  },
  {
    slug: 'administration/principal', title: t('অধ্যক্ষের বাণী', 'Principal’s Message'),
    blocks: [
      paragraph(
        '<p>প্রিয় শিক্ষার্থী ও অভিভাবকবৃন্দ, আদর্শ স্কুল অ্যান্ড কলেজে আপনাদের স্বাগত জানাই। ছয় দশকেরও বেশি সময় ধরে এই প্রতিষ্ঠান জ্ঞান ও মূল্যবোধের চর্চা করে আসছে।</p>',
        '<p>Dear students and guardians, welcome to Adarsha School &amp; College. For more than six decades this institution has practised both learning and values.</p>',
      ),
      { type: 'people', group: 'governing-body' },
    ],
  },
  {
    slug: 'academics', title: t('একাডেমিক', 'Academics'),
    blocks: [
      paragraph(
        '<p>ষষ্ঠ থেকে দশম শ্রেণি পর্যন্ত মাধ্যমিক এবং একাদশ–দ্বাদশ শ্রেণিতে উচ্চমাধ্যমিক পাঠদান করা হয়।</p>',
        '<p>Secondary teaching runs from Class Six to Ten, and higher secondary in Classes Eleven and Twelve.</p>',
      ),
    ],
  },
  {
    slug: 'academics/calendar', title: t('শিক্ষাপঞ্জি', 'Academic Calendar'),
    blocks: [
      {
        type: 'table', header: true,
        rows: [
          [t('মাস', 'Month'), t('কার্যক্রম', 'Activity')],
          [t('জানুয়ারি', 'January'), t('ভর্তি ও ক্লাস শুরু', 'Admission and start of classes')],
          [t('জুন', 'June'), t('অর্ধবার্ষিক পরীক্ষা', 'Half-yearly examination')],
          [t('নভেম্বর', 'November'), t('বার্ষিক পরীক্ষা', 'Annual examination')],
          [t('ডিসেম্বর', 'December'), t('ফলাফল ও বার্ষিক ক্রীড়া', 'Results and annual sports')],
        ],
      },
    ],
  },
  {
    slug: 'academics/syllabus', title: t('সিলেবাস ও বইয়ের তালিকা', 'Syllabus & Book List'),
    blocks: [
      {
        type: 'files',
        files: [
          { label: t('নবম শ্রেণির সিলেবাস', 'Class Nine syllabus'), url: '#', mimeType: 'application/pdf' },
          { label: t('দশম শ্রেণির সিলেবাস', 'Class Ten syllabus'), url: '#', mimeType: 'application/pdf' },
          { label: t('একাদশ শ্রেণির বইয়ের তালিকা', 'Class Eleven book list'), url: '#', mimeType: 'application/pdf' },
        ],
      },
    ],
  },
  {
    slug: 'admission', title: t('ভর্তি তথ্য', 'Admission Information'),
    blocks: [
      paragraph(
        '<p>প্রতি বছর ডিসেম্বর–জানুয়ারিতে ভর্তি কার্যক্রম শুরু হয়। ষষ্ঠ ও নবম শ্রেণিতে ভর্তি পরীক্ষার মাধ্যমে এবং একাদশ শ্রেণিতে বোর্ড নির্ধারিত নীতিমালা অনুসারে শিক্ষার্থী নির্বাচন করা হয়।</p>',
        '<p>Admission runs each December and January. Students are selected by entrance examination for Classes Six and Nine, and under the board policy for Class Eleven.</p>',
      ),
      {
        type: 'table', header: true,
        rows: [
          [t('শ্রেণি', 'Class'), t('ভর্তি ফি', 'Admission fee'), t('মাসিক বেতন', 'Monthly fee')],
          [t('ষষ্ঠ–অষ্টম', 'Six to Eight'), t('৩,৫০০ টাকা', 'BDT 3,500'), t('৮০০ টাকা', 'BDT 800')],
          [t('নবম–দশম', 'Nine and Ten'), t('৪,৫০০ টাকা', 'BDT 4,500'), t('১,০০০ টাকা', 'BDT 1,000')],
          [t('একাদশ–দ্বাদশ', 'Eleven and Twelve'), t('৬,০০০ টাকা', 'BDT 6,000'), t('১,৩০০ টাকা', 'BDT 1,300')],
        ],
      },
    ],
  },
  {
    slug: 'admission/fees', title: t('ফি কাঠামো', 'Fees'),
    blocks: [paragraph('<p>সকল ফি অফিস চলাকালীন সময়ে জমা দেওয়া যাবে।</p>', '<p>All fees may be paid during office hours.</p>')],
  },
]

const photo = (bn: string, en: string) => ({ ...campus, alt: t(bn, en) })

const poster = { url: '/sample/video-poster.svg', width: 640, height: 360, variants: [] }

export const videos: Video[] = [
  {
    id: 'v1', slug: 'annual-sports-highlights',
    title: t('বার্ষিক ক্রীড়া প্রতিযোগিতার ঝলক', 'Annual Sports Day highlights'),
    description: t('২০২৬ সালের বার্ষিক ক্রীড়া প্রতিযোগিতার সংক্ষিপ্ত ভিডিও।', 'A short film of the 2026 annual sports day.'),
    embedUrl: 'https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ',
    watchUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    poster, publishedAt: '2026-12-20T00:00:00.000Z', durationSeconds: 312,
  },
  {
    id: 'v2', slug: 'science-fair-tour',
    title: t('বিজ্ঞান মেলা পরিদর্শন', 'A walk through the science fair'),
    embedUrl: 'https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ',
    watchUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    poster, publishedAt: '2026-11-06T00:00:00.000Z', durationSeconds: 486,
  },
  {
    id: 'v3', slug: 'principal-welcome',
    title: t('অধ্যক্ষের স্বাগত বক্তব্য', 'Welcome from the Principal'),
    embedUrl: 'https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ',
    watchUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    poster, publishedAt: '2026-01-10T00:00:00.000Z', durationSeconds: 154,
  },
]

export const albums: GalleryAlbum[] = [
  {
    id: 'a1', slug: 'annual-sports-2026', title: t('বার্ষিক ক্রীড়া ২০২৬', 'Annual Sports 2026'),
    cover: campus, takenAt: '2026-12-18T00:00:00.000Z',
    photos: [
      photo('উদ্বোধনী কুচকাওয়াজ', 'The opening parade'),
      photo('দৌড় প্রতিযোগিতা', 'The sprint race'),
      photo('পুরস্কার বিতরণী', 'Prize distribution'),
      photo('অংশগ্রহণকারী দল', 'The participating houses'),
    ],
  },
  {
    id: 'a2', slug: 'science-fair-2026', title: t('বিজ্ঞান মেলা ২০২৬', 'Science Fair 2026'),
    cover: campus, takenAt: '2026-11-05T00:00:00.000Z',
    photos: [photo('প্রকল্প প্রদর্শনী', 'Project exhibition'), photo('বিচারকমণ্ডলী', 'The panel of judges')],
  },
  {
    id: 'a3', slug: 'victory-day-2026', title: t('বিজয় দিবস ২০২৬', 'Victory Day 2026'),
    cover: campus, takenAt: '2026-12-16T00:00:00.000Z',
    photos: [photo('পুষ্পস্তবক অর্পণ', 'Laying of flowers')],
  },
]
