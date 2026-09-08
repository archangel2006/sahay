/**
 * Sahay — Client Sandbox Storage Adapter
 * 
 * Provides robust, per-visitor local persistence for Demo Sandbox mode.
 * - Allows visitors & contributors to add reminders, new family members, 
 *   or change geofence radius without breaking or spamming a shared live database.
 * - Seeds automatically with pristine Bimala aita defaults.
 * - Can be reset to defaults at any time in Settings.
 */

import { ReminderItem, AppointmentItem, FamilyMemberItem, ZoneEventItem } from '../types';

const STORAGE_KEY_PREFIX = 'sahay_sandbox_v1_';

export interface LinkedElder {
  id: string;
  name: string;
  location: string;
  avatarColor: string;
  relationTag: string;
}

export const DEFAULT_ELDERS: LinkedElder[] = [
  { id: 'SHY-9021', name: 'Bimala aita', location: 'Jorhat, Assam', avatarColor: '#22403A', relationTag: 'Mother' },
  { id: 'SHY-4412', name: 'Dimbeswar koka', location: 'Guwahati, Assam', avatarColor: '#BD5B3B', relationTag: 'Father-in-law' },
];

export const DEFAULT_REMINDERS: ReminderItem[] = [
  { id: '1', icon: 'pill', tint: 'ic-clay', txt: 'Morning medicine', time: '8:00 AM', done: true },
  { id: '2', icon: 'droplet', tint: 'ic-indigo', txt: 'Drink warm water', time: '11:00 AM', done: false },
  { id: '3', icon: 'activity', tint: 'ic-forest', txt: 'Evening stroll in garden', time: '5:30 PM', done: false },
  { id: '4', icon: 'calendar', tint: 'ic-marigold', txt: 'Video call with Dr. Baruah', time: '6:15 PM', done: false },
];

export const DEFAULT_APPOINTMENTS: AppointmentItem[] = [
  { id: '1', title: 'Dr. Baruah — Neurology follow-up', date: '12', month: 'SEP', time: '4:00 PM', mode: 'Video call' },
  { id: '2', title: 'Physiotherapy session', date: '18', month: 'SEP', time: '10:30 AM', mode: 'NEIGRIHMS, Shillong' },
  { id: '3', title: 'Routine cognitive assessment', date: '02', month: 'OCT', time: '11:00 AM', mode: 'Community PHC visit' },
];

export const DEFAULT_FAMILY: FamilyMemberItem[] = [
  {
    id: '1',
    name: 'Ranjit',
    rel: 'Son',
    fact: 'Calls every evening at 7. Loves your fish curry.',
    color: '#3E4F74',
    phone: '+91 98640 12345',
    address: 'Boruah Chariali, Jorhat (1.8 km away)',
    voiceNoteText: 'Namaste Aita! I will drop by this evening with fresh pitha.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Priya',
    rel: 'Daughter-in-law',
    fact: 'Visits on Sundays with the grandchildren.',
    color: '#BD5B3B',
    phone: '+91 94350 67890',
    address: 'Tarajan, Jorhat (2.4 km away)',
    voiceNoteText: 'Aita, remember to have warm water after your morning walk!',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Mridul',
    rel: 'Grandson, age 9',
    fact: 'Wants you to teach him the card game again.',
    color: '#22403A',
    phone: '+91 98640 12345',
    address: 'Boruah Chariali, Jorhat',
    voiceNoteText: 'Koka and Aita, I got full marks in drawing today!',
    imageUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Deuta (late)',
    rel: 'Husband',
    fact: 'You two planted the tea bushes by the gate together in 1968.',
    color: '#8A5D18',
    address: 'Ancestral Homestead, Jorhat',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
];

export const DEFAULT_ZONE_EVENTS: ZoneEventItem[] = [
  { id: '1', type: 'exit', label: 'Left safe zone', time: '9:14 AM' },
  { id: '2', type: 'enter', label: 'Returned home', time: '9:52 AM' },
  { id: '3', type: 'exit', label: 'Left safe zone', time: 'Yesterday, 6:30 PM' },
  { id: '4', type: 'enter', label: 'Returned home', time: 'Yesterday, 6:48 PM' },
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // quota or incognito
  }
}

export const sandboxStorage = {
  getReminders(): ReminderItem[] {
    return load<ReminderItem[]>('reminders', DEFAULT_REMINDERS);
  },
  saveReminders(items: ReminderItem[]): void {
    save('reminders', items);
  },

  getAppointments(): AppointmentItem[] {
    return load<AppointmentItem[]>('appointments', DEFAULT_APPOINTMENTS);
  },
  saveAppointments(items: AppointmentItem[]): void {
    save('appointments', items);
  },

  getFamily(): FamilyMemberItem[] {
    return load<FamilyMemberItem[]>('family', DEFAULT_FAMILY);
  },
  saveFamily(items: FamilyMemberItem[]): void {
    save('family', items);
  },

  getSafety(): { radius: number; events: ZoneEventItem[] } {
    return load('safety', { radius: 500, events: DEFAULT_ZONE_EVENTS });
  },
  saveSafety(data: { radius: number; events: ZoneEventItem[] }): void {
    save('safety', data);
  },

  getLinkedElders(): LinkedElder[] {
    return load<LinkedElder[]>('linked_elders', DEFAULT_ELDERS);
  },
  saveLinkedElders(elders: LinkedElder[]): void {
    save('linked_elders', elders);
  },

  resetAll(): void {
    save('reminders', DEFAULT_REMINDERS);
    save('appointments', DEFAULT_APPOINTMENTS);
    save('family', DEFAULT_FAMILY);
    save('safety', { radius: 500, events: DEFAULT_ZONE_EVENTS });
    save('linked_elders', DEFAULT_ELDERS);
  },
};
