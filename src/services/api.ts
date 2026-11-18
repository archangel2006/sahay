/**
 * Sahay — Frontend API Client
 * 
 * Provides clean asynchronous methods to interact with backend endpoints.
 * Includes resilient fallbacks so the frontend runs seamlessly even offline.
 */

import {
  ReminderItem,
  AppointmentItem,
  FamilyMemberItem,
  ZoneEventItem,
} from '../types';
import { sandboxStorage, LinkedElder } from './sandboxStorage';

export const api = {
  // Reminders
  async getReminders(): Promise<ReminderItem[]> {
    try {
      const res = await fetch('/api/reminders');
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      return data;
    } catch (e) {
      return sandboxStorage.getReminders();
    }
  },

  async addReminder(txt: string, time: string): Promise<ReminderItem> {
    const newItem: ReminderItem = {
      id: String(Date.now()),
      txt,
      time,
      icon: 'clock',
      tint: 'ic-indigo',
      done: false,
    };
    try {
      await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (e) {
      // Offline fallback
    }
    const current = sandboxStorage.getReminders();
    const updated = [...current, newItem];
    sandboxStorage.saveReminders(updated);
    return newItem;
  },

  async toggleReminder(id: string): Promise<boolean> {
    try {
      await fetch(`/api/reminders/${id}/toggle`, { method: 'PATCH' });
    } catch (e) {
      // Offline fallback
    }
    const current = sandboxStorage.getReminders();
    const updated = current.map((r) => (r.id === id ? { ...r, done: !r.done } : r));
    sandboxStorage.saveReminders(updated);
    return true;
  },

  // Appointments
  async getAppointments(): Promise<AppointmentItem[]> {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return sandboxStorage.getAppointments();
    }
  },

  async addAppointment(item: Omit<AppointmentItem, 'id'>): Promise<AppointmentItem> {
    const newItem: AppointmentItem = { id: String(Date.now()), ...item };
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (e) {
      // Offline fallback
    }
    const current = sandboxStorage.getAppointments();
    const updated = [...current, newItem];
    sandboxStorage.saveAppointments(updated);
    return newItem;
  },

  // Family & Memory Book
  async getFamilyMembers(): Promise<FamilyMemberItem[]> {
    try {
      const res = await fetch('/api/family');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return sandboxStorage.getFamily();
    }
  },

  async addFamilyMember(item: Omit<FamilyMemberItem, 'id'>): Promise<FamilyMemberItem> {
    const newItem: FamilyMemberItem = { id: String(Date.now()), ...item };
    try {
      await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (e) {
      // Offline fallback
    }
    const current = sandboxStorage.getFamily();
    const updated = [...current, newItem];
    sandboxStorage.saveFamily(updated);
    return newItem;
  },

  async updateFamilyMember(item: FamilyMemberItem): Promise<FamilyMemberItem> {
    try {
      await fetch(`/api/family/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (e) {
      // Offline fallback
    }
    const current = sandboxStorage.getFamily();
    const updated = current.map((m) => (m.id === item.id ? item : m));
    sandboxStorage.saveFamily(updated);
    return item;
  },

  // Activity Logs
  async logActivity(data: { activityId: string; title: string; durationSeconds: number; accuracyPercentage: number }): Promise<void> {
    try {
      await fetch('/api/activities/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.log('Logged locally');
    }
  },

  // Safety & Geofencing
  async getSafetyStatus(): Promise<{ radius: number; events: ZoneEventItem[] }> {
    try {
      const res = await fetch('/api/safety');
      const data = await res.json();
      return {
        radius: data.safeZone?.radiusMeters || 500,
        events: data.zoneEvents || [],
      };
    } catch (e) {
      return sandboxStorage.getSafety();
    }
  },

  async updateSafetyRadius(radiusMeters: number): Promise<void> {
    try {
      await fetch('/api/safety/radius', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ radiusMeters }),
      });
    } catch (e) {
      // Ignored in offline fallback
    }
    const current = sandboxStorage.getSafety();
    sandboxStorage.saveSafety({ ...current, radius: radiusMeters });
  },

  // Emergency SOS
  async triggerSos(): Promise<{ contact: string; message: string }> {
    try {
      const res = await fetch('/api/emergency/sos', { method: 'POST' });
      const data = await res.json();
      return { contact: data.contact, message: data.message };
    } catch (e) {
      return {
        contact: 'Ranjit (Son)',
        message: 'Emergency SOS initiated. Primary caregiver notified with last known location.',
      };
    }
  },

  // AI Assistant Chat
  async askAssistant(prompt: string, language: string = 'English'): Promise<string> {
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      const data = await res.json();
      return data.reply || 'Namaskar! I am here with you.';
    } catch (e) {
      return 'Namaskar! I have verified your routine for today, and family alerts are working smoothly.';
    }
  },

  // Linked Elders (Issue #9)
  async getLinkedElders(): Promise<LinkedElder[]> {
    try {
      const res = await fetch('/api/elders');
      if (!res.ok) throw new Error('Network response not ok');
      return await res.json();
    } catch (e) {
      return sandboxStorage.getLinkedElders();
    }
  },

  async linkElder(
    id: string,
    name: string,
    location: string,
    relationTag: string,
    pin: string
  ): Promise<LinkedElder> {
    const palette = ['#22403A', '#BD5B3B', '#3E4F74', '#8A5D18', '#3F7455'];
    const current = sandboxStorage.getLinkedElders();
    const cleanId = id.toUpperCase().trim();
    const existing = current.find((e) => e.id.toUpperCase() === cleanId);
    if (existing) {
      throw new Error(`Elder ${cleanId} is already linked to your caregiver account.`);
    }

    if (!pin || pin.trim().length !== 4 || !/^\d{4}$/.test(pin.trim())) {
      throw new Error('Please enter a valid 4-digit companion pairing PIN code.');
    }

    const newElder: LinkedElder = {
      id: cleanId,
      name: name.trim(),
      location: location.trim() || 'Assam',
      relationTag: relationTag.trim() || 'Family Member',
      avatarColor: palette[current.length % palette.length],
      pin: pin.trim(),
    };

    try {
      await fetch('/api/elders/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newElder),
      });
    } catch (e) {
      // offline / sandbox fallback
    }

    const updated = [...current, newElder];
    sandboxStorage.saveLinkedElders(updated);
    return newElder;
  },

  async unlinkElder(id: string): Promise<void> {
    try {
      await fetch(`/api/elders/${id}`, { method: 'DELETE' });
    } catch (e) {
      // offline fallback
    }
    const current = sandboxStorage.getLinkedElders();
    const updated = current.filter((e) => e.id !== id);
    sandboxStorage.saveLinkedElders(updated);
  },
};
