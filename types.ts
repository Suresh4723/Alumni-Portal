export enum UserRole {
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  HOD = 'HOD',
  COORDINATOR = 'COORDINATOR',
  ALUMNI = 'ALUMNI'
}

export interface Department {
  id: string;
  name: string;
  hodId?: string; // User ID of the HOD
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  departmentId?: string; // Optional for Admin/Principal
  profilePic?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  isApproved: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  alumniId: string;
  alumniName: string; // Denormalized for easier display
  departmentId?: string;
  text: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ThreadMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  title: string;
  createdById: string;
  createdByName: string;
  messages: ThreadMessage[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}