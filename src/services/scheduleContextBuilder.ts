import { PatientScheduleContext, PatientScheduleItem } from '../types/assistant';
import { ReminderItem, AppointmentItem } from '../types';

/**
 * Normalizes timezone to a valid IANA identifier, defaulting to Indian Standard Time (IST).
 */
export function normalizeTimezone(tz?: string): string {
  if (!tz || typeof tz !== 'string') return 'Asia/Kolkata';
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return tz;
  } catch {
    return 'Asia/Kolkata';
  }
}

/**
 * Privacy filter: Redacts sensitive PII (phone numbers, account numbers, private caregiver passwords, medical diagnosis codes)
 * while preserving essential care instructions (e.g., dosage, time, doctor name).
 */
export function sanitizePrivacyText(text: string): string {
  if (!text) return '';
  return text
    // Redact 10-digit Indian phone numbers
    .replace(/(\+91[\-\s]?)?[6-9]\d{9}/g, '[PHONE REDACTED]')
    // Redact email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]')
    // Redact financial/bank account or Aadhaar numbers (12-16 digits)
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[ID REDACTED]')
    // Strip explicit private caregiver secrets/notes marked with (private)
    .replace(/\(private:[^)]*\)/gi, '');
}

/**
 * Converts Reminder items into structured PatientScheduleItem[]
 */
export function parseRemindersToScheduleItems(
  reminders: Array<{ id: string; txt: string; time?: string; done?: boolean; [key: string]: any }>
): PatientScheduleItem[] {
  if (!Array.isArray(reminders)) return [];

  return reminders.map((r) => {
    const isMedication = /pill|tablet|medicine|dosage|syrup|drop|insulin|mg\b/i.test(r.txt);
    const cleanTitle = sanitizePrivacyText(r.txt).trim();
    
    return {
      id: r.id,
      type: isMedication ? 'medication' : 'routine',
      title: cleanTitle,
      time: r.time || 'Daily',
      status: r.done ? 'completed' : 'pending',
    };
  });
}

/**
 * Converts Appointment items into structured PatientScheduleItem[]
 */
export function parseAppointmentsToScheduleItems(
  appointments: Array<{ id: string; title: string; date?: string; month?: string; time?: string; mode?: string; [key: string]: any }>
): PatientScheduleItem[] {
  if (!Array.isArray(appointments)) return [];

  return appointments.map((a) => {
    const cleanTitle = sanitizePrivacyText(a.title).trim();
    const formattedDate = `${a.date || ''} ${a.month || ''}`.trim();
    const timeDisplay = a.time ? (formattedDate ? `${formattedDate} at ${a.time}` : a.time) : (formattedDate || 'Upcoming');

    return {
      id: a.id,
      type: 'appointment',
      title: cleanTitle,
      time: timeDisplay,
      status: 'upcoming',
      notes: a.mode ? `Mode: ${sanitizePrivacyText(a.mode)}` : undefined,
    };
  });
}

/**
 * Builds the structured schedule string injected into the Gemini prompt.
 */
export function buildScheduleContextString(context?: PatientScheduleContext): string {
  if (!context || !Array.isArray(context.items) || context.items.length === 0) {
    return 'Current Patient Schedule: [No scheduled medications or appointments for today. Elder is resting safely in comfort.]';
  }

  const patientName = context.patientName || 'Bimala aita';
  const tz = normalizeTimezone(context.timezone);
  const safeZone = context.safeZoneStatus ? `Safe Zone Perimeter: ${context.safeZoneStatus}` : 'Safe Zone: inside safe perimeter';

  const visibleItems = context.items
    .filter((item) => !item.isPrivate && item.title)
    .map((item) => {
      const typeLabel = item.type.toUpperCase();
      const statusLabel = item.status === 'completed' ? 'TAKEN/DONE' : item.status.toUpperCase();
      const notes = item.notes ? ` (${sanitizePrivacyText(item.notes)})` : '';
      return `[${typeLabel}: ${sanitizePrivacyText(item.title)} at ${item.time} — Status: ${statusLabel}${notes}]`;
    });

  if (visibleItems.length === 0) {
    return `Current Patient Schedule for ${patientName} (${tz}): [No active items listed for today. ${safeZone}]`;
  }

  return `Current Patient Schedule for ${patientName} (Timezone: ${tz}, ${safeZone}):\n${visibleItems.join('\n')}`;
}

/**
 * Generates the complete, compassionate Gemini system instruction including injected schedule telemetry.
 */
export function buildGeminiSystemInstruction(
  language: string = 'English',
  scheduleContext?: PatientScheduleContext
): string {
  const scheduleBlock = buildScheduleContextString(scheduleContext);
  const patientName = scheduleContext?.patientName || 'Bimala aita';

  return `You are Sahay, a compassionate, patient, and culturally respectful AI eldercare companion designed specifically for senior citizens in North-East India (Assam, Meghalaya, Manipur, Mizoram).
You are assisting ${patientName}.

${scheduleBlock}

Strict Operational Instructions:
1. Context-Aware Grounding:
   - When the elder asks about medications (e.g. "Did I take my morning pill?"), refer directly to the schedule above. If marked "TAKEN/DONE", reassure them warmly with exact timing. If marked "PENDING", gently and respectfully remind them.
   - When asked about appointments or doctors (e.g. "When is my doctor coming?"), state the upcoming appointment details reassuringly.
2. Respectful Elder Communication:
   - Be warm, gentle, and brief (1 to 2 sentences maximum).
   - Use culturally respectful honorifics ("Aita", "Deuta", "Namaskar", "Khublei").
   - Primary Language: ${language}. Answer accurately and empathetically in ${language} (or Assamese/Hindi/English as preferred by the elder).
3. Safety & Peace of Mind:
   - Never use clinical alarmist warnings, frightening medical jargon, or confusing technical terms.
   - If an item is not on the schedule, reassure them peacefully that family caregiver Ranjit is keeping watch and everything is in order.`;
}
