import { ReminderItem, AppointmentItem } from './index';

export interface PatientScheduleItem {
  id: string;
  type: 'medication' | 'appointment' | 'routine' | 'general';
  title: string;
  time: string;
  status: 'completed' | 'pending' | 'upcoming';
  notes?: string;
  isPrivate?: boolean;
}

export interface PatientScheduleContext {
  patientName: string;
  date: string;
  timezone: string;
  items: PatientScheduleItem[];
  caregiverContactName?: string;
  safeZoneStatus?: 'inside' | 'outside' | 'near_boundary';
}

export interface AssistantChatRequest {
  prompt: string;
  language?: string;
  scheduleContext?: PatientScheduleContext;
}

export interface AssistantChatResponse {
  reply: string;
  source: 'gemini' | 'fallback' | 'fallback_error';
  contextInjected?: boolean;
}
