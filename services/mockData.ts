import { Department, User, UserRole, Testimonial, Thread } from '../types';

export const SEED_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Computer Science (CSE)', createdAt: new Date().toISOString() },
  { id: 'd2', name: 'Electronics (ECE)', createdAt: new Date().toISOString() },
  { id: 'd3', name: 'Mechanical (MECH)', createdAt: new Date().toISOString() },
];

export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Super Admin',
    email: 'admin@jntugv.edu',
    password: 'admin',
    role: UserRole.ADMIN,
    isApproved: true,
    createdAt: new Date().toISOString(),
    profilePic: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: 'u2',
    name: 'Dr. Principal',
    email: 'principal@jntugv.edu',
    password: 'admin',
    role: UserRole.PRINCIPAL,
    isApproved: true,
    createdAt: new Date().toISOString(),
    profilePic: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'u3',
    name: 'Prof. HOD CSE',
    email: 'hod.cse@jntugv.edu',
    password: 'admin',
    role: UserRole.HOD,
    departmentId: 'd1',
    isApproved: true,
    createdAt: new Date().toISOString(),
    profilePic: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: 'u4',
    name: 'Coord CSE',
    email: 'coord.cse@jntugv.edu',
    password: 'admin',
    role: UserRole.COORDINATOR,
    departmentId: 'd1',
    isApproved: true,
    createdAt: new Date().toISOString(),
    profilePic: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: 'u5',
    name: 'John Alumni',
    email: 'alumni@gmail.com',
    password: 'admin',
    role: UserRole.ALUMNI,
    departmentId: 'd1',
    isApproved: true,
    createdAt: new Date().toISOString(),
    profilePic: 'https://picsum.photos/200/200?random=5',
    socialLinks: { linkedin: 'john-doe' }
  }
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    alumniId: 'u5',
    alumniName: 'John Alumni',
    departmentId: 'd1',
    text: 'JNTUGV gave me the best foundation for my career at Google.',
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];

export const SEED_THREADS: Thread[] = [
  {
    id: 'th1',
    title: 'Upcoming Alumni Meet 2024',
    createdById: 'u4',
    createdByName: 'Coord CSE',
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: 'm1',
        text: 'Hi everyone, we are planning a meetup in December.',
        senderId: 'u4',
        senderName: 'Coord CSE',
        timestamp: new Date().toISOString()
      }
    ]
  }
];