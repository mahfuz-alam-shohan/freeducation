import type { Notice, SchoolEvent } from '../../contracts/index.js'
import { campus, t } from './text.js'

const pdf = (bn: string, en: string) => ({ label: t(bn, en), url: '#', mimeType: 'application/pdf' })

export const notices: Notice[] = [
  {
    id: 'n1', slug: 'admission-2026', category: 'admission', pinned: true,
    title: t('২০২৬ শিক্ষাবর্ষে একাদশ শ্রেণিতে ভর্তি বিজ্ঞপ্তি', 'Class XI admission notice for the 2026 session'),
    summary: t('অনলাইনে আবেদন শুরু ১০ জানুয়ারি, শেষ তারিখ ৩১ জানুয়ারি।', 'Online applications open on 10 January and close on 31 January.'),
    body: t(
      '<p>বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক — তিনটি শাখাতেই ভর্তি চলবে। বিস্তারিত সময়সূচি ও আসনসংখ্যা সংযুক্ত বিজ্ঞপ্তিতে দেওয়া আছে।</p><p>ভর্তি সংক্রান্ত যেকোনো জিজ্ঞাসার জন্য কলেজ অফিসে যোগাযোগ করুন।</p>',
      '<p>Admission is open in all three groups — Science, Business Studies and Humanities. The full schedule and seat numbers are in the attached circular.</p><p>For any question about admission, please contact the college office.</p>',
    ),
    publishedAt: '2026-01-05T04:00:00.000Z',
    attachments: [pdf('ভর্তি বিজ্ঞপ্তি', 'Admission circular'), pdf('আসন বিন্যাস', 'Seat plan')],
  },
  {
    id: 'n2', slug: 'half-yearly-routine', category: 'academic', pinned: true,
    title: t('অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশ', 'Half-yearly examination routine published'),
    summary: t('পরীক্ষা শুরু ২০ জুন, সকাল ১০টা।', 'Examinations begin on 20 June at 10am.'),
    publishedAt: '2026-05-28T04:00:00.000Z', attachments: [pdf('পরীক্ষার রুটিন', 'Examination routine')],
  },
  {
    id: 'n3', slug: 'office-closure', category: 'office', pinned: false,
    title: t('ঈদুল ফিতর উপলক্ষে অফিস বন্ধের বিজ্ঞপ্তি', 'Office closure notice for Eid-ul-Fitr'),
    summary: t('৮ এপ্রিল থেকে ১৪ এপ্রিল পর্যন্ত অফিস বন্ধ থাকবে।', 'The office will remain closed from 8 to 14 April.'),
    publishedAt: '2026-04-11T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n4', slug: 'lecturer-recruitment', category: 'career', pinned: false,
    title: t('প্রভাষক নিয়োগ বিজ্ঞপ্তি', 'Lecturer recruitment circular'),
    summary: t('পদার্থবিজ্ঞান ও গণিত বিভাগে দুটি শূন্য পদ।', 'Two vacancies in the Physics and Mathematics departments.'),
    publishedAt: '2026-03-02T04:00:00.000Z', attachments: [pdf('আবেদন ফরম', 'Application form')],
  },
  {
    id: 'n5', slug: 'tuition-fee-schedule', category: 'office', pinned: false,
    title: t('মাসিক বেতন পরিশোধের সময়সূচি', 'Monthly tuition payment schedule'),
    summary: t('প্রতি মাসের ১০ তারিখের মধ্যে বেতন পরিশোধ করতে হবে।', 'Fees must be paid by the 10th of each month.'),
    publishedAt: '2026-02-18T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n6', slug: 'science-fair-call', category: 'academic', pinned: false,
    title: t('বিজ্ঞান মেলায় অংশগ্রহণের আহ্বান', 'Call for entries to the science fair'),
    summary: t('দলগত প্রকল্প জমা দেওয়ার শেষ তারিখ ২৫ অক্টোবর।', 'Team projects must be submitted by 25 October.'),
    publishedAt: '2026-09-20T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n7', slug: 'class-nine-registration', category: 'academic', pinned: false,
    title: t('নবম শ্রেণির রেজিস্ট্রেশন সংক্রান্ত নির্দেশনা', 'Instructions for Class Nine registration'),
    publishedAt: '2026-08-12T04:00:00.000Z', attachments: [pdf('নির্দেশিকা', 'Guidelines')],
  },
  {
    id: 'n8', slug: 'guardian-meeting', category: 'general', pinned: false,
    title: t('অভিভাবক সমাবেশ', 'Guardians’ meeting'),
    summary: t('৫ সেপ্টেম্বর সকাল ১১টায় কলেজ মিলনায়তনে।', 'On 5 September at 11am in the college auditorium.'),
    publishedAt: '2026-08-28T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n9', slug: 'library-hours', category: 'office', pinned: false,
    title: t('গ্রন্থাগারের নতুন সময়সূচি', 'New library opening hours'),
    publishedAt: '2026-07-02T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n10', slug: 'scholarship-results', category: 'academic', pinned: false,
    title: t('উপবৃত্তির ফলাফল প্রকাশ', 'Stipend results published'),
    summary: t('নির্বাচিত শিক্ষার্থীদের তালিকা অফিসে টাঙানো হয়েছে।', 'The list of selected students is posted at the office.'),
    publishedAt: '2026-06-14T04:00:00.000Z', attachments: [pdf('ফলাফল তালিকা', 'Result list')],
  },
  {
    id: 'n11', slug: 'office-assistant-vacancy', category: 'career', pinned: false,
    title: t('অফিস সহকারী নিয়োগ বিজ্ঞপ্তি', 'Office assistant recruitment circular'),
    publishedAt: '2026-05-05T04:00:00.000Z', attachments: [],
  },
  {
    id: 'n12', slug: 'admission-merit-list', category: 'admission', pinned: false,
    title: t('একাদশ শ্রেণির প্রথম মেধাতালিকা', 'Class XI first merit list'),
    summary: t('নির্বাচিত শিক্ষার্থীদের ভর্তি ১২ ফেব্রুয়ারির মধ্যে সম্পন্ন করতে হবে।', 'Selected students must complete admission by 12 February.'),
    publishedAt: '2026-02-05T04:00:00.000Z', attachments: [pdf('মেধাতালিকা', 'Merit list')],
  },
]

export const events: SchoolEvent[] = [
  {
    id: 'e1', slug: 'annual-sports-2026',
    title: t('বার্ষিক ক্রীড়া প্রতিযোগিতা', 'Annual Sports Day'),
    description: t('<p>সকাল ৮টা থেকে দিনব্যাপী।</p>', '<p>All day, starting at 8am.</p>'),
    startsAt: '2026-12-18T03:00:00.000Z', location: t('কলেজ মাঠ', 'College ground'), cover: campus,
  },
  {
    id: 'e2', slug: 'science-fair-2026',
    title: t('বিজ্ঞান মেলা', 'Science Fair'),
    startsAt: '2026-11-05T03:00:00.000Z', location: t('কলেজ মিলনায়তন', 'College auditorium'),
  },
  {
    id: 'e3', slug: 'annual-cultural-night',
    title: t('বার্ষিক সাংস্কৃতিক সন্ধ্যা', 'Annual Cultural Night'),
    startsAt: '2026-12-20T12:00:00.000Z', location: t('কলেজ মিলনায়তন', 'College auditorium'),
  },
  {
    id: 'e4', slug: 'debate-competition',
    title: t('আন্তঃশ্রেণি বিতর্ক প্রতিযোগিতা', 'Inter-class Debate Competition'),
    startsAt: '2026-10-12T04:00:00.000Z',
  },
  {
    id: 'e5', slug: 'victory-day',
    title: t('মহান বিজয় দিবস উদযাপন', 'Victory Day Observance'),
    startsAt: '2026-12-16T02:30:00.000Z', location: t('কলেজ প্রাঙ্গণ', 'College campus'),
  },
]
