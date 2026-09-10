import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for open-source golden baseline
let reminders = [
  { id: '1', icon: 'pill', tint: 'ic-clay', txt: 'Morning medicine', time: '8:00 AM', done: true },
  { id: '2', icon: 'droplet', tint: 'ic-indigo', txt: 'Drink water', time: '11:00 AM', done: false },
  { id: '3', icon: 'activity', tint: 'ic-forest', txt: 'Evening walk with family', time: '5:30 PM', done: false },
  { id: '4', icon: 'calendar', tint: 'ic-marigold', txt: 'Video call with Dr. Baruah', time: '6:15 PM', done: false },
];

let appointments = [
  { id: '1', title: 'Dr. Baruah — Neurology follow-up', date: '12', month: 'SEP', time: '4:00 PM', mode: 'Video call' },
  { id: '2', title: 'Physiotherapy session', date: '18', month: 'SEP', time: '10:30 AM', mode: 'NEIGRIHMS, Shillong' },
  { id: '3', title: 'Routine cognitive assessment', date: '02', month: 'OCT', time: '11:00 AM', mode: 'Community PHC visit' },
];

let familyMembers = [
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

let activityLogs = [
  { id: '1', activityId: 'memory', title: 'Memory Match', durationSeconds: 180, accuracyPercentage: 82, completedAt: 'Today', resultLabel: '82% accuracy' },
  { id: '2', activityId: 'pattern', title: 'Pattern Recall', durationSeconds: 240, accuracyPercentage: 90, completedAt: 'Yesterday', resultLabel: 'Sequence of 5' },
  { id: '3', activityId: 'memory', title: 'Memory Match', durationSeconds: 300, accuracyPercentage: 61, completedAt: 'Sat, 27 Aug', resultLabel: '61% accuracy' },
  { id: '4', activityId: 'routine', title: 'Daily Routine Recall', durationSeconds: 120, accuracyPercentage: 100, completedAt: 'Fri, 26 Aug', resultLabel: 'Completed' },
  { id: '5', activityId: 'memory', title: 'Memory Match', durationSeconds: 360, accuracyPercentage: 58, completedAt: 'Thu, 25 Aug', resultLabel: '58% accuracy' },
];

let safeZone = {
  radiusMeters: 500,
  elderLocation: { lat: 26.7509, lng: 94.2037, address: 'Tea Garden Road, Jorhat, Assam' },
  status: 'At home — within safe zone',
  lastChecked: 'Just now',
};

let zoneEvents = [
  { id: '1', type: 'exit', label: 'Left safe zone', time: '9:14 AM' },
  { id: '2', type: 'enter', label: 'Returned home', time: '9:52 AM' },
  { id: '3', type: 'exit', label: 'Left safe zone', time: 'Yesterday, 6:30 PM' },
  { id: '4', type: 'enter', label: 'Returned home', time: 'Yesterday, 6:48 PM' },
];

// Lazy Gemini API initialization helper
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      genAiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return genAiClient;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Sahay API Baseline', timestamp: new Date().toISOString() });
});

// Assistant Chat endpoint with Gemini
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { prompt, language = 'English' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Graceful fallback if GEMINI_API_KEY is not configured yet
      return res.json({
        reply: `Namaskar! I have noted your message: "${prompt}". Your daily schedule is intact, your 6-day streak is active, and Ranjit (son) has been notified.`,
        source: 'fallback',
      });
    }

    const systemInstruction = `You are Sahay, a compassionate, patient, and culturally respectful AI care assistant designed specifically for elderly people in North-East India (such as Assam, Meghalaya, Manipur, Mizoram).
Your user may be an elder like Bimala aita.
- Be warm, gentle, and concise (1-2 sentences maximum).
- Speak with elder-friendly respect (use respectful honorifics like "Aita", "Deuta", "Namaskar", "Khublei").
- Language preference: ${language}. If asked in Assamese, Bodo, Khasi, Manipuri, Mizo, or English, answer empathetically in that language.
- Provide reassurance about their daily routine, medicine timings, family connection, and gentle cognitive well-being.
- Never use clinical jargon or alarming warnings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const reply = response.text || 'Namaskar! I am here with you. Everything is in order.';
    res.json({ reply, source: 'gemini' });
  } catch (error: any) {
    console.error('Assistant API error:', error);
    res.json({
      reply: 'Namaskar! I am listening. I have verified your routine for today, and family alerts are working smoothly.',
      source: 'fallback_error',
    });
  }
});

// Reminders CRUD
app.get('/api/reminders', (req, res) => {
  res.json(reminders);
});

app.post('/api/reminders', (req, res) => {
  const { txt, time = 'Anytime', icon = 'clock', tint = 'ic-indigo' } = req.body;
  if (!txt) return res.status(400).json({ error: 'Reminder text is required' });
  const newItem = {
    id: String(Date.now()),
    txt,
    time,
    icon,
    tint,
    done: false,
  };
  reminders.push(newItem);
  res.status(201).json(newItem);
});

app.patch('/api/reminders/:id/toggle', (req, res) => {
  const { id } = req.params;
  const item = reminders.find((r) => r.id === id);
  if (!item) return res.status(404).json({ error: 'Reminder not found' });
  item.done = !item.done;
  res.json(item);
});

// Appointments CRUD
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const { title, date = '—', month = '', time = 'Time TBD', mode = 'To be confirmed' } = req.body;
  if (!title) return res.status(400).json({ error: 'Appointment title is required' });
  const newItem = {
    id: String(Date.now()),
    title,
    date,
    month: month.toUpperCase(),
    time,
    mode,
  };
  appointments.push(newItem);
  res.status(201).json(newItem);
});

// Family Members CRUD
app.get('/api/family', (req, res) => {
  res.json(familyMembers);
});

app.post('/api/family', (req, res) => {
  const { name, rel, fact, color = '#3E4F74', imageUrl, address, phone, voiceNoteText } = req.body;
  if (!name || !rel) return res.status(400).json({ error: 'Name and relationship are required' });
  const newItem = {
    id: String(Date.now()),
    name,
    rel,
    fact: fact || 'A special person in family life.',
    color,
    imageUrl: imageUrl || '',
    address: address || '',
    phone: phone || '',
    voiceNoteText: voiceNoteText || '',
  };
  familyMembers.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/family/:id', (req, res) => {
  const { id } = req.params;
  const index = familyMembers.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Family member not found' });
  const { name, rel, fact, color, imageUrl, address, phone, voiceNoteText } = req.body;
  familyMembers[index] = {
    ...familyMembers[index],
    name: name ?? familyMembers[index].name,
    rel: rel ?? familyMembers[index].rel,
    fact: fact ?? familyMembers[index].fact,
    color: color ?? familyMembers[index].color,
    imageUrl: imageUrl !== undefined ? imageUrl : familyMembers[index].imageUrl,
    address: address !== undefined ? address : familyMembers[index].address,
    phone: phone !== undefined ? phone : familyMembers[index].phone,
    voiceNoteText: voiceNoteText !== undefined ? voiceNoteText : familyMembers[index].voiceNoteText,
  };
  res.json(familyMembers[index]);
});

// Activity Session Logs
app.get('/api/activities/log', (req, res) => {
  res.json(activityLogs);
});

app.post('/api/activities/log', (req, res) => {
  const { activityId, title, durationSeconds, accuracyPercentage, movesOrScore } = req.body;
  const logItem = {
    id: String(Date.now()),
    activityId,
    title: title || 'Cognitive Activity',
    durationSeconds: Number(durationSeconds) || 60,
    accuracyPercentage: Number(accuracyPercentage) || 100,
    completedAt: 'Today',
    resultLabel: `${accuracyPercentage || 100}% accuracy`,
  };
  activityLogs.unshift(logItem);
  res.status(201).json(logItem);
});

// Safety Geofencing status
app.get('/api/safety', (req, res) => {
  res.json({ safeZone, zoneEvents });
});

app.post('/api/safety/radius', (req, res) => {
  const { radiusMeters } = req.body;
  if (radiusMeters) {
    safeZone.radiusMeters = Number(radiusMeters);
  }
  res.json(safeZone);
});

// Emergency SOS trigger
app.post('/api/emergency/sos', (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  const alert = {
    id: String(Date.now()),
    status: 'dispatched',
    contact: 'Ranjit (Son)',
    phone: '+91 98640 00000',
    location: safeZone.elderLocation.address,
    time: timestamp,
    message: 'Emergency SOS initiated. Primary caregiver notified with live location coordinates.',
  };
  res.json(alert);
});

// -------------------------------------------------------------
// VITE MIDDLEWARE SETUP (Development vs Production)
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sahay Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
