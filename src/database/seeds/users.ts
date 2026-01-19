import { User, CreateUserRequest } from '../models';

export const DEFAULT_ADMIN: CreateUserRequest = {
  username: 'admin',
  email: 'admin@freeducation.com',
  password: 'admin123', // Should be changed immediately
  full_name: 'System Administrator',
  user_type: 'admin',
  phone: undefined,
  date_of_birth: undefined,
  address: 'System Generated',
  bio: 'Default system administrator account'
};

export const SAMPLE_USERS: CreateUserRequest[] = [
  {
    username: 'teacher1',
    email: 'teacher@freeducation.com',
    password: 'teacher123',
    full_name: 'Sarah Ahmed',
    user_type: 'teacher',
    phone: '+8801712345678',
    date_of_birth: '1990-05-15',
    address: 'Dhaka, Bangladesh',
    bio: 'Mathematics teacher with 10 years of experience'
  },
  {
    username: 'student1',
    email: 'student@freeducation.com',
    password: 'student123',
    full_name: 'Rahul Karim',
    user_type: 'student',
    phone: '+8801712345679',
    date_of_birth: '2008-03-20',
    address: 'Chittagong, Bangladesh',
    bio: 'Class 9 student, science group'
  },
  {
    username: 'writer1',
    email: 'writer@freeducation.com',
    password: 'writer123',
    full_name: 'Fatema Begum',
    user_type: 'writer',
    phone: '+8801712345680',
    date_of_birth: '1985-08-10',
    address: 'Rajshahi, Bangladesh',
    bio: 'Educational content writer and curriculum developer'
  }
];

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'teacher', label: 'Teacher', description: 'Can create and manage content' },
  { value: 'student', label: 'Student', description: 'Can access and learn' },
  { value: 'writer', label: 'Content Writer', description: 'Can create educational content' },
  { value: 'publisher', label: 'Publisher', description: 'Can publish and manage content' }
];
