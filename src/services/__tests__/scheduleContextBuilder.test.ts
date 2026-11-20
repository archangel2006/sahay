import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeTimezone,
  sanitizePrivacyText,
  parseRemindersToScheduleItems,
  parseAppointmentsToScheduleItems,
  buildScheduleContextString,
  buildGeminiSystemInstruction,
} from '../scheduleContextBuilder';
import { ReminderItem, AppointmentItem } from '../../types';
import { PatientScheduleContext } from '../../types/assistant';

describe('scheduleContextBuilder — Timezone Normalization', () => {
  it('should default to Asia/Kolkata when timezone is undefined or empty', () => {
    assert.strictEqual(normalizeTimezone(undefined), 'Asia/Kolkata');
    assert.strictEqual(normalizeTimezone(''), 'Asia/Kolkata');
  });

  it('should return valid IANA timezones', () => {
    assert.strictEqual(normalizeTimezone('Asia/Kolkata'), 'Asia/Kolkata');
    assert.strictEqual(normalizeTimezone('UTC'), 'UTC');
    assert.strictEqual(normalizeTimezone('America/New_York'), 'America/New_York');
  });

  it('should fall back to Asia/Kolkata on invalid timezone identifiers', () => {
    assert.strictEqual(normalizeTimezone('Invalid/Nonexistent_TZ'), 'Asia/Kolkata');
  });
});

describe('scheduleContextBuilder — Privacy Sanitization', () => {
  it('should redact Indian phone numbers', () => {
    const raw = 'Call daughter Priya at +91 9876543210 regarding prescription';
    const clean = sanitizePrivacyText(raw);
    assert.strictEqual(clean.includes('9876543210'), false);
    assert.strictEqual(clean.includes('[PHONE REDACTED]'), true);
  });

  it('should redact email addresses', () => {
    const raw = 'Send discharge slip to caregiver.ranjit@gmail.com by evening';
    const clean = sanitizePrivacyText(raw);
    assert.strictEqual(clean.includes('caregiver.ranjit@gmail.com'), false);
    assert.strictEqual(clean.includes('[EMAIL REDACTED]'), true);
  });

  it('should redact 12-digit identification numbers', () => {
    const raw = 'Patient ID 4521 8920 1144 on dispensary file';
    const clean = sanitizePrivacyText(raw);
    assert.strictEqual(clean.includes('4521 8920 1144'), false);
    assert.strictEqual(clean.includes('[ID REDACTED]'), true);
  });

  it('should strip private caregiver annotations', () => {
    const raw = 'Morning tablet (private: check cabinet key under mat)';
    const clean = sanitizePrivacyText(raw);
    assert.strictEqual(clean.includes('cabinet key'), false);
    assert.strictEqual(clean.trim(), 'Morning tablet');
  });
});

describe('scheduleContextBuilder — Schedule Parsers', () => {
  it('should parse reminders into structured medication and routine items', () => {
    const reminders: ReminderItem[] = [
      { id: '1', icon: 'pill', tint: 'ic-clay', txt: 'Morning blood pressure pill', time: '8:00 AM', done: true },
      { id: '2', icon: 'activity', tint: 'ic-forest', txt: 'Evening garden walk', time: '5:30 PM', done: false },
    ];

    const parsed = parseRemindersToScheduleItems(reminders);
    assert.strictEqual(parsed.length, 2);
    
    assert.strictEqual(parsed[0].type, 'medication');
    assert.strictEqual(parsed[0].status, 'completed');
    assert.strictEqual(parsed[0].time, '8:00 AM');

    assert.strictEqual(parsed[1].type, 'routine');
    assert.strictEqual(parsed[1].status, 'pending');
    assert.strictEqual(parsed[1].time, '5:30 PM');
  });

  it('should parse appointments into structured items with date and mode', () => {
    const appointments: AppointmentItem[] = [
      { id: '1', title: 'Dr. Baruah Neurology follow-up', date: '12', month: 'SEP', time: '4:00 PM', mode: 'Video call' },
    ];

    const parsed = parseAppointmentsToScheduleItems(appointments);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].type, 'appointment');
    assert.strictEqual(parsed[0].status, 'upcoming');
    assert.strictEqual(parsed[0].title, 'Dr. Baruah Neurology follow-up');
    assert.strictEqual(parsed[0].time, '12 SEP at 4:00 PM');
    assert.strictEqual(parsed[0].notes, 'Mode: Video call');
  });

  it('should gracefully handle empty arrays', () => {
    assert.deepStrictEqual(parseRemindersToScheduleItems([]), []);
    assert.deepStrictEqual(parseAppointmentsToScheduleItems([]), []);
  });
});

describe('scheduleContextBuilder — Context String & Gemini System Prompt', () => {
  it('should format empty schedule with reassuring comfort notice', () => {
    const emptyContext: PatientScheduleContext = {
      patientName: 'Bimala aita',
      date: '18/11/2026',
      timezone: 'Asia/Kolkata',
      items: [],
    };

    const str = buildScheduleContextString(emptyContext);
    assert.strictEqual(str.includes('No scheduled medications or appointments for today'), true);
  });

  it('should build formatted items with status labels and timezone', () => {
    const context: PatientScheduleContext = {
      patientName: 'Bimala aita',
      date: '18/11/2026',
      timezone: 'Asia/Kolkata',
      safeZoneStatus: 'inside',
      items: [
        {
          id: '1',
          type: 'medication',
          title: 'Donepezil 5mg pill',
          time: '8:30 AM',
          status: 'completed',
        },
        {
          id: '2',
          type: 'appointment',
          title: 'Dr. Baruah Consultation',
          time: '4:30 PM today',
          status: 'upcoming',
        },
      ],
    };

    const str = buildScheduleContextString(context);
    assert.strictEqual(str.includes('Bimala aita'), true);
    assert.strictEqual(str.includes('Asia/Kolkata'), true);
    assert.strictEqual(str.includes('[MEDICATION: Donepezil 5mg pill at 8:30 AM — Status: TAKEN/DONE]'), true);
    assert.strictEqual(str.includes('[APPOINTMENT: Dr. Baruah Consultation at 4:30 PM today — Status: UPCOMING]'), true);
  });

  it('should construct full Gemini system instruction with language preference and rules', () => {
    const context: PatientScheduleContext = {
      patientName: 'Bimala aita',
      date: '18/11/2026',
      timezone: 'Asia/Kolkata',
      items: [
        { id: '1', type: 'medication', title: 'Blood pressure tablet', time: '9:00 AM', status: 'pending' },
      ],
    };

    const instruction = buildGeminiSystemInstruction('Assamese', context);
    assert.strictEqual(instruction.includes('Primary Language: Assamese'), true);
    assert.strictEqual(instruction.includes('Bimala aita'), true);
    assert.strictEqual(instruction.includes('Blood pressure tablet at 9:00 AM — Status: PENDING'), true);
    assert.strictEqual(instruction.includes('Context-Aware Grounding'), true);
  });
});
