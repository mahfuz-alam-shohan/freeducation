import type { ClassRef, ExamRef, ResultRecord, Routine } from '../../contracts/index.js'
import { t } from './text.js'

export const classes: ClassRef[] = [
  { id: 'nine', label: t('নবম শ্রেণি', 'Class Nine') },
  { id: 'ten', label: t('দশম শ্রেণি', 'Class Ten') },
  { id: 'eleven', label: t('একাদশ শ্রেণি', 'Class Eleven') },
]

const cell = (bn: string, en: string, teacher: [string, string], room: string) =>
  ({ subject: t(bn, en), teacher: t(teacher[0], teacher[1]), room })

const selina: [string, string] = ['সেলিনা আক্তার', 'Selina Akhter']
const shahjahan: [string, string] = ['মোঃ শাহজাহান আলী', 'Md Shahjahan Ali']
const rubina: [string, string] = ['রুবিনা পারভীন', 'Rubina Parvin']
const abuBakar: [string, string] = ['আবু বকর সিদ্দিক', 'Abu Bakar Siddique']

const days = [
  t('রবিবার', 'Sunday'), t('সোমবার', 'Monday'), t('মঙ্গলবার', 'Tuesday'),
  t('বুধবার', 'Wednesday'), t('বৃহস্পতিবার', 'Thursday'),
]

const periods = [
  { label: t('১ম', '1st'), startsAt: '09:00', endsAt: '09:45' },
  { label: t('২য়', '2nd'), startsAt: '09:45', endsAt: '10:30' },
  { label: t('৩য়', '3rd'), startsAt: '10:30', endsAt: '11:15' },
  { label: t('৪র্থ', '4th'), startsAt: '11:35', endsAt: '12:20' },
  { label: t('৫ম', '5th'), startsAt: '12:20', endsAt: '13:05' },
]

export const routines: Record<string, Routine> = {
  nine: {
    classRef: classes[0]!, days, periods,
    grid: [
      [cell('বাংলা', 'Bangla', selina, '201'), cell('গণিত', 'Mathematics', shahjahan, '204'), null, cell('ইংরেজি', 'English', rubina, '201'), cell('আইসিটি', 'ICT', selina, 'Lab 1')],
      [cell('ইংরেজি', 'English', rubina, '201'), null, cell('পদার্থবিজ্ঞান', 'Physics', selina, 'Lab 2'), cell('বাংলা', 'Bangla', selina, '201'), cell('গণিত', 'Mathematics', shahjahan, '204')],
      [cell('রসায়ন', 'Chemistry', abuBakar, 'Lab 3'), cell('গণিত', 'Mathematics', shahjahan, '204'), cell('বাংলা', 'Bangla', selina, '201'), null, cell('শারীরিক শিক্ষা', 'Physical Education', shahjahan, 'Ground')],
      [cell('জীববিজ্ঞান', 'Biology', abuBakar, 'Lab 3'), cell('ইংরেজি', 'English', rubina, '201'), cell('গণিত', 'Mathematics', shahjahan, '204'), cell('রসায়ন', 'Chemistry', abuBakar, 'Lab 3'), null],
      [cell('আইসিটি', 'ICT', selina, 'Lab 1'), cell('বাংলা', 'Bangla', selina, '201'), cell('ইংরেজি', 'English', rubina, '201'), cell('পদার্থবিজ্ঞান', 'Physics', selina, 'Lab 2'), cell('গণিত', 'Mathematics', shahjahan, '204')],
    ],
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  ten: {
    classRef: classes[1]!, days: days.slice(0, 4), periods: periods.slice(0, 4),
    grid: [
      [cell('গণিত', 'Mathematics', shahjahan, '205'), cell('জীববিজ্ঞান', 'Biology', abuBakar, 'Lab 3'), cell('বাংলা', 'Bangla', selina, '202'), null],
      [cell('ইংরেজি', 'English', rubina, '202'), null, cell('রসায়ন', 'Chemistry', abuBakar, 'Lab 3'), cell('গণিত', 'Mathematics', shahjahan, '205')],
      [cell('পদার্থবিজ্ঞান', 'Physics', selina, 'Lab 2'), cell('বাংলা', 'Bangla', selina, '202'), null, cell('ইংরেজি', 'English', rubina, '202')],
      [cell('আইসিটি', 'ICT', selina, 'Lab 1'), cell('গণিত', 'Mathematics', shahjahan, '205'), cell('জীববিজ্ঞান', 'Biology', abuBakar, 'Lab 3'), cell('বাংলা', 'Bangla', selina, '202')],
    ],
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  eleven: {
    classRef: classes[2]!, days: days.slice(0, 3), periods: periods.slice(0, 3),
    grid: [
      [cell('পদার্থবিজ্ঞান', 'Physics', selina, 'Lab 2'), cell('রসায়ন', 'Chemistry', abuBakar, 'Lab 3'), cell('উচ্চতর গণিত', 'Higher Mathematics', shahjahan, '301')],
      [cell('ইংরেজি', 'English', rubina, '301'), cell('বাংলা', 'Bangla', selina, '301'), null],
      [cell('জীববিজ্ঞান', 'Biology', abuBakar, 'Lab 3'), null, cell('আইসিটি', 'ICT', selina, 'Lab 1')],
    ],
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
}

export const exams: ExamRef[] = [
  { id: 'half-yearly-2026', label: t('অর্ধবার্ষিক ২০২৬', 'Half-yearly 2026') },
  { id: 'annual-2026', label: t('বার্ষিক ২০২৬', 'Annual 2026') },
  { id: 'test-2026', label: t('নির্বাচনী ২০২৬', 'Test Examination 2026') },
]

const grade = (bn: string, en: string, letter: string, points: number) =>
  ({ name: t(bn, en), grade: letter, points })

export const results: ResultRecord[] = [
  {
    roll: '101', exam: t('অর্ধবার্ষিক ২০২৬', 'Half-yearly 2026'),
    studentName: t('তানভীর হাসান', 'Tanvir Hasan'), className: t('নবম শ্রেণি', 'Class Nine'),
    gpa: '5.00', publishedAt: '2026-07-10T00:00:00.000Z',
    subjects: [
      grade('বাংলা', 'Bangla', 'A+', 5),
      grade('ইংরেজি', 'English', 'A+', 5),
      grade('গণিত', 'Mathematics', 'A+', 5),
      grade('পদার্থবিজ্ঞান', 'Physics', 'A+', 5),
      grade('রসায়ন', 'Chemistry', 'A+', 5),
      grade('জীববিজ্ঞান', 'Biology', 'A+', 5),
    ],
  },
  {
    roll: '102', exam: t('অর্ধবার্ষিক ২০২৬', 'Half-yearly 2026'),
    studentName: t('মেহজাবিন চৌধুরী', 'Mehzabin Chowdhury'), className: t('নবম শ্রেণি', 'Class Nine'),
    gpa: '4.50', publishedAt: '2026-07-10T00:00:00.000Z',
    subjects: [
      grade('বাংলা', 'Bangla', 'A', 4),
      grade('ইংরেজি', 'English', 'A+', 5),
      grade('গণিত', 'Mathematics', 'A', 4),
      grade('পদার্থবিজ্ঞান', 'Physics', 'A+', 5),
    ],
  },
  {
    roll: '103', exam: t('বার্ষিক ২০২৬', 'Annual 2026'),
    studentName: t('সাদিয়া ইসলাম', 'Sadia Islam'), className: t('দশম শ্রেণি', 'Class Ten'),
    gpa: '4.89', publishedAt: '2026-12-22T00:00:00.000Z',
    subjects: [
      grade('বাংলা', 'Bangla', 'A+', 5),
      grade('ইংরেজি', 'English', 'A', 4),
      grade('গণিত', 'Mathematics', 'A+', 5),
    ],
  },
]
