import { User, Department, Testimonial, Thread, ChatMessage, UserRole } from '../types';
import { SEED_USERS, SEED_DEPARTMENTS, SEED_TESTIMONIALS, SEED_THREADS } from './mockData';

// Local Storage Keys
const KEYS = {
  USERS: 'jntugv_users',
  DEPTS: 'jntugv_depts',
  TESTIMONIALS: 'jntugv_testimonials',
  THREADS: 'jntugv_threads',
  CHATS: 'jntugv_chats'
};

// Initialize Data
const initialize = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(KEYS.DEPTS, JSON.stringify(SEED_DEPARTMENTS));
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(SEED_TESTIMONIALS));
    localStorage.setItem(KEYS.THREADS, JSON.stringify(SEED_THREADS));
    localStorage.setItem(KEYS.CHATS, JSON.stringify([]));
  }
};

initialize();

// Helper to get/set
const get = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const set = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const api = {
  // --- Users ---
  getUsers: (): User[] => get<User>(KEYS.USERS),
  
  createUser: (user: Omit<User, 'id' | 'createdAt' | 'isApproved'>): User => {
    const users = get<User>(KEYS.USERS);
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isApproved: false, // Default to pending
      profilePic: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
    };
    users.push(newUser);
    set(KEYS.USERS, users);
    return newUser;
  },

  updateUser: (id: string, updates: Partial<User>): User | undefined => {
    const users = get<User>(KEYS.USERS);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      set(KEYS.USERS, users);
      return users[index];
    }
    return undefined;
  },

  deleteUser: (id: string) => {
    let users = get<User>(KEYS.USERS);
    users = users.filter(u => u.id !== id);
    set(KEYS.USERS, users);
  },

  // --- Departments ---
  getDepartments: (): Department[] => get<Department>(KEYS.DEPTS),
  
  createDepartment: (name: string) => {
    const depts = get<Department>(KEYS.DEPTS);
    const newDept: Department = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      createdAt: new Date().toISOString()
    };
    depts.push(newDept);
    set(KEYS.DEPTS, depts);
  },

  // --- Testimonials ---
  getTestimonials: (): Testimonial[] => get<Testimonial>(KEYS.TESTIMONIALS),
  
  addTestimonial: (userId: string, userName: string, deptId: string | undefined, text: string) => {
    const tests = get<Testimonial>(KEYS.TESTIMONIALS);
    const newTest: Testimonial = {
      id: Math.random().toString(36).substr(2, 9),
      alumniId: userId,
      alumniName: userName,
      departmentId: deptId,
      text,
      isApproved: false,
      createdAt: new Date().toISOString()
    };
    tests.push(newTest);
    set(KEYS.TESTIMONIALS, tests);
  },

  approveTestimonial: (id: string, approve: boolean) => {
    let tests = get<Testimonial>(KEYS.TESTIMONIALS);
    if (!approve) {
        tests = tests.filter(t => t.id !== id);
    } else {
        const t = tests.find(t => t.id === id);
        if (t) t.isApproved = true;
    }
    set(KEYS.TESTIMONIALS, tests);
  },

  // --- Threads ---
  getThreads: (): Thread[] => get<Thread>(KEYS.THREADS),

  createThread: (title: string, creator: User) => {
    const threads = get<Thread>(KEYS.THREADS);
    const newThread: Thread = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      createdById: creator.id,
      createdByName: creator.name,
      createdAt: new Date().toISOString(),
      messages: []
    };
    threads.unshift(newThread);
    set(KEYS.THREADS, threads);
  },

  replyToThread: (threadId: string, text: string, sender: User) => {
    const threads = get<Thread>(KEYS.THREADS);
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      thread.messages.push({
        id: Math.random().toString(36).substr(2, 9),
        text,
        senderId: sender.id,
        senderName: sender.name,
        timestamp: new Date().toISOString()
      });
      set(KEYS.THREADS, threads);
    }
  },

  // --- Chat (HOD <-> Alumni) ---
  getMessages: (userId1: string, userId2: string): ChatMessage[] => {
    const msgs = get<ChatMessage>(KEYS.CHATS);
    return msgs.filter(m => 
      (m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage: (senderId: string, receiverId: string, message: string) => {
    const msgs = get<ChatMessage>(KEYS.CHATS);
    msgs.push({
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });
    set(KEYS.CHATS, msgs);
  }
};