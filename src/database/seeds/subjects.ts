import { Subject } from '../models';

export const DEFAULT_SUBJECTS: Omit<Subject, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Bangla',
    code: 'BAN',
    description: 'Bangla Language and Literature - NCTB Curriculum',
    category: 'core',
    class_level: '6-12',
    group: undefined,
    icon: 'fas fa-language',
    color: '#DC2626',
    is_active: true,
    sort_order: 1
  },
  {
    name: 'English',
    code: 'ENG',
    description: 'English Language and Literature - NCTB Curriculum',
    category: 'core',
    class_level: '6-12',
    group: undefined,
    icon: 'fas fa-globe',
    color: '#059669',
    is_active: true,
    sort_order: 2
  },
  {
    name: 'Mathematics',
    code: 'MAT',
    description: 'Mathematics - NCTB Curriculum',
    category: 'core',
    class_level: '6-12',
    group: undefined,
    icon: 'fas fa-calculator',
    color: '#7C3AED',
    is_active: true,
    sort_order: 3
  },
  {
    name: 'Physics',
    code: 'PHY',
    description: 'Physics - NCTB Science Curriculum',
    category: 'core',
    class_level: '9-12',
    group: 'science',
    icon: 'fas fa-atom',
    color: '#0891B2',
    is_active: true,
    sort_order: 4
  },
  {
    name: 'Chemistry',
    code: 'CHE',
    description: 'Chemistry - NCTB Science Curriculum',
    category: 'core',
    class_level: '9-12',
    group: 'science',
    icon: 'fas fa-flask',
    color: '#0277BD',
    is_active: true,
    sort_order: 5
  },
  {
    name: 'Biology',
    code: 'BIO',
    description: 'Biology - NCTB Science Curriculum',
    category: 'core',
    class_level: '9-12',
    group: 'science',
    icon: 'fas fa-dna',
    color: '#16A085',
    is_active: true,
    sort_order: 6
  },
  {
    name: 'Higher Mathematics',
    code: 'HMT',
    description: 'Higher Mathematics - NCTB Advanced Curriculum',
    category: 'elective',
    class_level: '11-12',
    group: 'science',
    icon: 'fas fa-square-root-alt',
    color: '#9333EA',
    is_active: true,
    sort_order: 7
  },
  {
    name: 'ICT',
    code: 'ICT',
    description: 'Information and Communication Technology - NCTB Curriculum',
    category: 'core',
    class_level: '6-12',
    group: undefined,
    icon: 'fas fa-laptop',
    color: '#FF6B35',
    is_active: true,
    sort_order: 8
  },
  {
    name: 'Religion',
    code: 'REL',
    description: 'Religious Studies - NCTB Curriculum',
    category: 'core',
    class_level: '6-12',
    group: undefined,
    icon: 'fas fa-pray',
    color: '#F59E0B',
    is_active: true,
    sort_order: 9
  },
  {
    name: 'Agricultural Studies',
    code: 'AGR',
    description: 'Agricultural Studies - NCTB Curriculum',
    category: 'elective',
    class_level: '9-12',
    group: undefined,
    icon: 'fas fa-seedling',
    color: '#10B981',
    is_active: true,
    sort_order: 10
  },
  {
    name: 'Bangladesh & Global Studies',
    code: 'BGS',
    description: 'Bangladesh and Global Studies - NCTB Social Science Curriculum',
    category: 'core',
    class_level: '9-12',
    group: 'arts',
    icon: 'fas fa-globe-asia',
    color: '#EF4444',
    is_active: true,
    sort_order: 11
  },
  {
    name: 'Accounting',
    code: 'ACC',
    description: 'Accounting - NCTB Commerce Curriculum',
    category: 'core',
    class_level: '11-12',
    group: 'commerce',
    icon: 'fas fa-coins',
    color: '#3B82F6',
    is_active: true,
    sort_order: 12
  },
  {
    name: 'Finance',
    code: 'FIN',
    description: 'Finance and Banking - NCTB Commerce Curriculum',
    category: 'core',
    class_level: '11-12',
    group: 'commerce',
    icon: 'fas fa-chart-line',
    color: '#10B981',
    is_active: true,
    sort_order: 13
  },
  {
    name: 'Business Entrepreneurship',
    code: 'BEN',
    description: 'Business Entrepreneurship - NCTB Commerce Curriculum',
    category: 'core',
    class_level: '11-12',
    group: 'commerce',
    icon: 'fas fa-briefcase',
    color: '#F59E0B',
    is_active: true,
    sort_order: 14
  },
  {
    name: 'General Science',
    code: 'GSC',
    description: 'General Science - NCTB Junior Curriculum',
    category: 'core',
    class_level: '6-8',
    group: undefined,
    icon: 'fas fa-microscope',
    color: '#6366F1',
    is_active: true,
    sort_order: 15
  }
];

export const SUBJECT_CATEGORIES = [
  { value: 'core', label: 'Core Subject' },
  { value: 'elective', label: 'Elective Subject' },
  { value: 'optional', label: 'Optional Subject' }
];

export const CLASS_LEVELS = [
  { value: '6', label: 'Class 6' },
  { value: '7', label: 'Class 7' },
  { value: '8', label: 'Class 8' },
  { value: '9', label: 'Class 9' },
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12' }
];

export const SUBJECT_GROUPS = [
  { value: 'science', label: 'Science' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts' }
];
