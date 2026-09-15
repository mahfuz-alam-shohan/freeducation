import type { Person } from '../../contracts/index.js'
import { portrait, t } from './text.js'

const person = (
  id: string, group: string, order: number,
  name: [string, string], designation: [string, string],
  extra: Partial<Person> = {},
): Person => ({
  id, group, order,
  name: t(name[0], name[1]),
  designation: t(designation[0], designation[1]),
  ...extra,
})

export const people: Person[] = [
  // Governing body
  person('g1', 'governing-body', 1, ['জনাব রফিকুল ইসলাম', 'Mr Rafiqul Islam'], ['সভাপতি', 'Chairman'], { photo: portrait }),
  person('g2', 'governing-body', 2, ['ড. নাজমা বেগম', 'Dr Nazma Begum'], ['সহ-সভাপতি', 'Vice Chairman']),
  person('g3', 'governing-body', 3, ['জনাব আমিনুল হক', 'Mr Aminul Haque'], ['সদস্য সচিব', 'Member Secretary']),
  person('g4', 'governing-body', 4, ['বেগম শিরিন আক্তার', 'Begum Shirin Akhter'], ['অভিভাবক সদস্য', 'Guardian Member']),
  person('g5', 'governing-body', 5, ['জনাব কামরুল হাসান', 'Mr Kamrul Hasan'], ['দাতা সদস্য', 'Donor Member']),
  person('g6', 'governing-body', 6, ['ড. ফারহানা ইয়াসমিন', 'Dr Farhana Yasmin'], ['শিক্ষক প্রতিনিধি', 'Teacher Representative']),

  // Teachers
  person('t1', 'teachers', 1, ['মোঃ আনিসুর রহমান', 'Md Anisur Rahman'], ['অধ্যক্ষ', 'Principal'],
    { photo: portrait, department: t('প্রশাসন', 'Administration'), email: 'principal@adarsha.edu.bd' }),
  person('t2', 'teachers', 2, ['ড. সাবরিনা চৌধুরী', 'Dr Sabrina Chowdhury'], ['উপাধ্যক্ষ', 'Vice Principal'],
    { photo: portrait, department: t('প্রশাসন', 'Administration') }),
  person('t3', 'teachers', 3, ['সেলিনা আক্তার', 'Selina Akhter'], ['সহকারী অধ্যাপক', 'Assistant Professor'],
    { department: t('পদার্থবিজ্ঞান', 'Physics'), email: 'selina@adarsha.edu.bd' }),
  person('t4', 'teachers', 4, ['মোঃ শাহজাহান আলী', 'Md Shahjahan Ali'], ['সহকারী অধ্যাপক', 'Assistant Professor'],
    { photo: portrait, department: t('গণিত', 'Mathematics') }),
  person('t5', 'teachers', 5, ['রুবিনা পারভীন', 'Rubina Parvin'], ['প্রভাষক', 'Lecturer'],
    { department: t('ইংরেজি', 'English') }),
  person('t6', 'teachers', 6, ['আবু বকর সিদ্দিক', 'Abu Bakar Siddique'], ['প্রভাষক', 'Lecturer'],
    { photo: portrait, department: t('রসায়ন', 'Chemistry') }),
  person('t7', 'teachers', 7, ['নাসরিন সুলতানা', 'Nasrin Sultana'], ['সহকারী শিক্ষক', 'Assistant Teacher'],
    { department: t('বাংলা', 'Bangla') }),
  person('t8', 'teachers', 8, ['মোঃ জাহিদুল ইসলাম', 'Md Zahidul Islam'], ['সহকারী শিক্ষক', 'Assistant Teacher'],
    { photo: portrait, department: t('জীববিজ্ঞান', 'Biology') }),
  person('t9', 'teachers', 9, ['তাহমিনা রহমান', 'Tahmina Rahman'], ['সহকারী শিক্ষক', 'Assistant Teacher'],
    { department: t('তথ্য ও যোগাযোগ প্রযুক্তি', 'ICT') }),
  person('t10', 'teachers', 10, ['মোঃ ইলিয়াস হোসেন', 'Md Elias Hossain'], ['সহকারী শিক্ষক', 'Assistant Teacher'],
    { photo: portrait, department: t('ইসলাম শিক্ষা', 'Islamic Studies') }),
  person('t11', 'teachers', 11, ['শারমিন জাহান', 'Sharmin Jahan'], ['সহকারী শিক্ষক', 'Assistant Teacher'],
    { department: t('সমাজবিজ্ঞান', 'Social Science') }),
  person('t12', 'teachers', 12, ['মোঃ রাশেদুল করিম', 'Md Rashedul Karim'], ['শারীরিক শিক্ষক', 'Physical Instructor'],
    { department: t('শারীরিক শিক্ষা', 'Physical Education') }),

  // Officers and staff
  person('s1', 'staff', 1, ['আব্দুল করিম', 'Abdul Karim'], ['প্রধান হিসাবরক্ষক', 'Chief Accountant'],
    { phone: '+880 1711 000001' }),
  person('s2', 'staff', 2, ['মোসাঃ রাহেলা খাতুন', 'Mst Rahela Khatun'], ['অফিস সহকারী', 'Office Assistant']),
  person('s3', 'staff', 3, ['মোঃ সোহেল রানা', 'Md Sohel Rana'], ['গ্রন্থাগারিক', 'Librarian'],
    { photo: portrait }),
  person('s4', 'staff', 4, ['জরিনা বেগম', 'Jorina Begum'], ['ল্যাব সহকারী', 'Laboratory Assistant']),
]
