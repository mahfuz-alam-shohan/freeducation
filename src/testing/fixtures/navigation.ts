import type { MenuItem, Navigation, ViewType } from '../../contracts/index.js'
import { t } from './text.js'

/** Every page on the site is one of these entries — the menu is the sitemap. */
const item = (
  id: string, bn: string, en: string, path: string, view: ViewType,
  extra: Partial<MenuItem> = {},
): MenuItem => ({
  id, label: t(bn, en), path, view,
  params: {}, visible: true, highlighted: false, children: [],
  ...extra,
})

export const navigation: Navigation = {
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
        item('admin-principal', 'অধ্যক্ষের বাণী', 'Principal’s Message', 'administration/principal', 'rich-page'),
        item('admin-governing', 'পরিচালনা পর্ষদ', 'Governing Body', 'administration', 'person-list', { params: { group: 'governing-body' } }),
        item('admin-teachers', 'শিক্ষকবৃন্দ', 'Teacher List', 'administration/teachers', 'person-list', { params: { group: 'teachers' } }),
        item('admin-staff', 'কর্মকর্তা ও কর্মচারী', 'Officers & Staff', 'administration/staff', 'person-list', { params: { group: 'staff' } }),
      ],
    }),

    item('academics', 'একাডেমিক', 'Academics', 'academics', 'rich-page', {
      children: [
        item('acad-routine', 'ক্লাস রুটিন', 'Class Routine', 'academics/routine', 'routine'),
        item('acad-calendar', 'শিক্ষাপঞ্জি', 'Academic Calendar', 'academics/calendar', 'rich-page'),
        item('acad-syllabus', 'সিলেবাস ও বই', 'Syllabus & Books', 'academics/syllabus', 'rich-page'),
      ],
    }),

    item('admission', 'ভর্তি', 'Admission', 'admission', 'rich-page', {
      highlighted: true,
      children: [
        item('adm-info', 'ভর্তি তথ্য', 'Admission Information', 'admission', 'rich-page'),
        item('adm-notice', 'ভর্তি বিজ্ঞপ্তি', 'Admission Notice', 'notice/admission', 'notice-list', { params: { category: 'admission' } }),
        item('adm-fees', 'ফি কাঠামো', 'Fees', 'admission/fees', 'rich-page'),
      ],
    }),

    item('notice', 'নোটিশ', 'Notice', 'notice', 'notice-list', {
      children: [
        item('notice-all', 'সব নোটিশ', 'All Notices', 'notice', 'notice-list'),
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
    item('f-routine', 'ক্লাস রুটিন', 'Class Routine', 'academics/routine', 'routine'),
    item('f-results', 'ফলাফল', 'Results', 'results', 'result-lookup'),
    item('f-contact', 'যোগাযোগ', 'Contact', 'contact', 'contact'),
  ],
}
