/**
 * Sahay — Core TypeScript Contracts & Data Models
 * 
 * These types define the data structures shared across frontend features
 * and backend API routes. They are written to be simple, self-documenting,
 * and easy for open-source contributors to extend.
 */

export type PageId = 'home' | 'activities' | 'reminders' | 'appointments' | 'family' | 'insights' | 'settings';

export type UserRole = 'companion' | 'caregiver'; // 'companion' = elder view, 'caregiver' = family oversight
export type PortalMode = 'demo' | 'admin'; // 'demo' = sandbox, 'admin' = production locked portal

export type ActivityId = 
  | 'memory' 
  | 'pattern' 
  | 'routine' 
  | 'spot' 
  | 'faces' 
  | 'odd' 
  | 'numbers';

export interface ActivityMeta {
  id: ActivityId;
  title: string;
  description: string;
  category: 'Memory' | 'Executive Function' | 'Attention' | 'Working Memory';
  level: number;
  maxLevel: number;
  status: 'active' | 'contribute'; // 'active' = fully playable, 'contribute' = ready for open-source PR
  iconName: string;
}

export interface ActivitySessionResult {
  activityId: ActivityId;
  durationSeconds: number;
  accuracyPercentage: number;
  movesOrScore: number;
  completedAt: string;
  notes?: string;
}

export interface ReminderItem {
  id: string;
  txt: string;
  time: string;
  icon: string;
  tint: 'ic-clay' | 'ic-indigo' | 'ic-forest' | 'ic-marigold';
  done: boolean;
}

export interface AppointmentItem {
  id: string;
  title: string;
  date: string;
  month: string;
  time: string;
  mode: string;
}

export interface FamilyMemberItem {
  id: string;
  name: string;
  rel: string;
  fact: string;
  color: string;
  imageUrl?: string;
  address?: string;
  phone?: string;
  audioUrl?: string;
  voiceNoteText?: string;
}

export interface ZoneEventItem {
  id: string;
  type: 'exit' | 'enter';
  label: string;
  time: string;
}

export interface NotificationItem {
  id: string;
  icon: string;
  text: string;
  time: string;
}

export type SupportedLanguage = 
  | 'English' 
  | 'Assamese' 
  | 'Bodo' 
  | 'Khasi' 
  | 'Manipuri' 
  | 'Mizo';

export type TextScale = 'normal' | 'large' | 'xlarge';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
