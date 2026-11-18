import { SupportedLanguage } from '../types';

export interface DictionaryPhrases {
  // Navigation & Core Controls
  home: string;
  activities: string;
  reminders: string;
  appointments: string;
  family: string;
  settings: string;
  insights: string;

  // Elder Primary Actions (Issue #10 Core Controls)
  takeMedicine: string;
  callFamily: string;
  emergencyHelp: string;
  sos: string;
  talkToSahay: string;
  playGame: string;
  startTodayActivity: string;
  viewProgress: string;

  // Header & Status
  greeting: (name: string) => string;
  subGreetingCompanion: string;
  subGreetingCaregiver: string;
  caregiverOversight: string;
  companionMode: string;
  streakDays: (count: number) => string;
  notifications: string;
  unreadCount: (count: number) => string;
  allCaughtUp: string;

  // Dashboard & Care Sections
  todaysFocus: string;
  todaysCarePlan: string;
  viewAll: string;
  weeklyStreak: string;
  avgAccuracy: string;
  nextReminder: string;
  quickActions: string;
  continueEngagement: string;

  // Settings & Localization
  appAndVoiceLanguage: string;
  fontSize: string;
  languageSwitchedToast: string;
}

export interface LanguageMeta {
  code: SupportedLanguage;
  nativeName: string;
  badge: string;
  speechLocale: string;
}

export const LANGUAGE_METADATA: Record<SupportedLanguage, LanguageMeta> = {
  English: {
    code: 'English',
    nativeName: 'English',
    badge: 'EN',
    speechLocale: 'en-IN',
  },
  Assamese: {
    code: 'Assamese',
    nativeName: 'অসমীয়া',
    badge: 'অ',
    speechLocale: 'as-IN',
  },
  Bodo: {
    code: 'Bodo',
    nativeName: 'बड़ो',
    badge: 'ब',
    speechLocale: 'hi-IN', // fallback speech engine locale
  },
  Khasi: {
    code: 'Khasi',
    nativeName: 'Khasi',
    badge: 'KH',
    speechLocale: 'en-IN',
  },
  Manipuri: {
    code: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    badge: 'ম',
    speechLocale: 'bn-IN', // closest browser STT acoustic model fallback
  },
  Mizo: {
    code: 'Mizo',
    nativeName: 'Mizo ṭawng',
    badge: 'MZ',
    speechLocale: 'en-IN',
  },
};

export const SUPPORTED_LANGUAGES_LIST: LanguageMeta[] = Object.values(LANGUAGE_METADATA);

export const DICTIONARIES: Record<SupportedLanguage, DictionaryPhrases> = {
  English: {
    home: 'Overview',
    activities: 'Activities',
    reminders: 'Reminders',
    appointments: 'Appointments',
    family: 'Memory Book',
    settings: 'Settings',
    insights: 'My Insights',

    takeMedicine: 'Take Medicine',
    callFamily: 'Call Family',
    emergencyHelp: 'Emergency Help',
    sos: 'SOS',
    talkToSahay: 'Talk to Sahay',
    playGame: 'Play a Game',
    startTodayActivity: "Start today's activity",
    viewProgress: 'View progress',

    greeting: (name: string) => `Namaskar, ${name}`,
    subGreetingCompanion: "Let's begin today's activities",
    subGreetingCaregiver: 'Real-time elder connection, activity alerts, and safety perimeter',
    caregiverOversight: 'Caregiver Oversight',
    companionMode: 'Companion',
    streakDays: (count: number) => `${count}-day streak`,
    notifications: 'Notifications',
    unreadCount: (count: number) => `${count} unread`,
    allCaughtUp: "You're all caught up.",

    todaysFocus: "Today's Focus",
    todaysCarePlan: "Today's Care Plan",
    viewAll: 'View all',
    weeklyStreak: 'Weekly streak',
    avgAccuracy: 'Avg. accuracy',
    nextReminder: 'Next reminder',
    quickActions: 'Quick Actions',
    continueEngagement: 'Continue Engagement',

    appAndVoiceLanguage: 'App & Voice Language',
    fontSize: 'Text Size',
    languageSwitchedToast: 'Language switched to English',
  },

  Assamese: {
    home: 'মুখ্য পৃষ্ঠা',
    activities: 'মনোৰঞ্জন খেল',
    reminders: 'সোঁৱৰণী',
    appointments: 'চিকিৎসক সাক্ষাৎ',
    family: 'স্মৃতি ভঁৰাল',
    settings: 'ছেটিংছ',
    insights: 'স্বাস্থ্য তথ্য',

    takeMedicine: 'দৰব খাবলৈ',
    callFamily: 'পৰিয়ালক ফোন কৰক',
    emergencyHelp: 'জৰুৰীকালীন সহায়',
    sos: 'জৰুৰী (SOS)',
    talkToSahay: 'সহায়ক কওক',
    playGame: 'খেল খেলক',
    startTodayActivity: 'আজিৰ খেল আৰম্ভ কৰক',
    viewProgress: 'অগ্ৰগতি চাওক',

    greeting: (name: string) => `নমস্কাৰ, ${name}`,
    subGreetingCompanion: 'আহক আজিৰ কাৰ্যসূচী আৰম্ভ কৰোঁ',
    subGreetingCaregiver: 'প্ৰত্যক্ষ যোগাযোগ, সুৰক্ষা পৰিসীমা আৰু যত্ন তথ্য',
    caregiverOversight: 'তত্ত্বাৱধায়ক ডেশ্ববৰ্ড',
    companionMode: 'সহচৰ মোড',
    streakDays: (count: number) => `${count} দিনৰ ধাৰাবাহিকতা`,
    notifications: 'জাননীসমূহ',
    unreadCount: (count: number) => `${count} টা অপঠিত`,
    allCaughtUp: 'কোনো নতুন জাননী নাই।',

    todaysFocus: 'আজিৰ গুৰুত্ব',
    todaysCarePlan: 'আজিৰ সেৱা পৰিকল্পনা',
    viewAll: 'সকলো চাওক',
    weeklyStreak: 'সাপ্তাহিক ধাৰাবাহিকতা',
    avgAccuracy: 'গড় সঠিকতা',
    nextReminder: 'পৰৱৰ্তী সোঁৱৰণী',
    quickActions: 'দ্ৰুত কাৰ্য',
    continueEngagement: 'মনোযোগ চৰ্চা অব্যাহত ৰাখক',

    appAndVoiceLanguage: 'এপ আৰু কণ্ঠস্বৰৰ ভাষা',
    fontSize: 'আখৰৰ আকাৰ',
    languageSwitchedToast: 'ভাষা অসমীয়ালৈ সলনি কৰা হ’ল',
  },

  Bodo: {
    home: 'गाहाय बिलाइ',
    activities: 'गेलनाय',
    reminders: 'गोसोखां होनाय',
    appointments: 'डाक्टर लोगो हमनाय',
    family: 'गोसोखां बिजाब',
    settings: 'फजायनाय',
    insights: 'फाहामथाय रोदा',

    takeMedicine: 'मुलि जानाय',
    callFamily: 'नखरनो कल खालाम',
    emergencyHelp: 'गोनांथार हेफाजाब',
    sos: 'जरुरि (SOS)',
    talkToSahay: 'सहायजों रायलाय',
    playGame: 'गेलनाय गेले',
    startTodayActivity: 'दिनैनि हाबाफारि जागाय',
    viewProgress: 'दावगानाय नाय',

    greeting: (name: string) => `खुलुमबाय, ${name}`,
    subGreetingCompanion: 'दिनैनि हाबाफारिखौ जागायदिनि',
    subGreetingCaregiver: 'बिसिबाय-आबै नायदिंनाय आरो सुबुं रैखाथि',
    caregiverOversight: 'फाहामगिरा नायदिंनाय',
    companionMode: 'लोगो मोद',
    streakDays: (count: number) => `${count} साननि फारि`,
    notifications: 'मिथिसार बिथोन',
    unreadCount: (count: number) => `${count} फरायाखै`,
    allCaughtUp: 'गासै खौरां मोजांयै फरायखाबाय।',

    todaysFocus: 'दिनैनि नोजोर',
    todaysCarePlan: 'दिनैनि फाहामथाय बिथांखि',
    viewAll: 'गासैखौ नाय',
    weeklyStreak: 'सप्ताहानि फारि',
    avgAccuracy: 'गेबेंथायनि हार',
    nextReminder: 'उनाव गोसोखां होनाय',
    quickActions: 'थाब हाबा',
    continueEngagement: 'गोसो फोजानाय सालायबाय था',

    appAndVoiceLanguage: 'एप आरो राव बाहायनाय',
    fontSize: 'हांखोनि महर',
    languageSwitchedToast: 'रावखौ बड़ोआव सोलायबाय',
  },

  Khasi: {
    home: 'Iing',
    activities: 'Ki Jingialehkai',
    reminders: 'Ki Jingkynmaw',
    appointments: 'Jingiathuh bad u Doktor',
    family: 'Kot Kynmaw Ba-hai-ing',
    settings: 'Ki Jingpynbeit',
    insights: 'Jingtip Koit-khiah',

    takeMedicine: 'Dih Dawai',
    callFamily: 'Phone sha Ba-hai-ing',
    emergencyHelp: 'Jingiarap ba Kyrkieh',
    sos: 'SOS Kyrkieh',
    talkToSahay: 'Kren bad u Sahay',
    playGame: 'Lehkai Jingialehkai',
    startTodayActivity: 'Sdang ka jingialehkai mynta',
    viewProgress: 'Peit ia ka jingiaid shaphrang',

    greeting: (name: string) => `Khublei, ${name}`,
    subGreetingCompanion: 'To ngin sdang ia ki kam mynta ka sngi',
    subGreetingCaregiver: 'Ka jingiasnoh bad ki tymmen, jingpyntip, bad ka shongsuk',
    caregiverOversight: 'Ka Jingkhmih Nongsumar',
    companionMode: 'Mode Lok',
    streakDays: (count: number) => `${count} sngi lynter`,
    notifications: 'Ki Jingpyntip',
    unreadCount: (count: number) => `${count} bym pat pule`,
    allCaughtUp: 'Phi la dep pule lut baroh.',

    todaysFocus: 'Ka Jingthmu Mynta',
    todaysCarePlan: 'Ka Plan Sumar Mynta ka Sngi',
    viewAll: 'Peit baroh',
    weeklyStreak: 'Jingiaineh shi taiew',
    avgAccuracy: 'Jingbiang bor pyrkhat',
    nextReminder: 'Jingkynmaw ban wan',
    quickActions: 'Ki Kam ba Kloi',
    continueEngagement: 'Bteng ia ka jingpyrkhat kynmaw',

    appAndVoiceLanguage: 'Ktien App bad Ktien Kren',
    fontSize: 'Ka jingheh dak',
    languageSwitchedToast: 'La pynkylla ktien sha ka Khasi',
  },

  Manipuri: {
    home: 'য়ুম',
    activities: 'শান্নপোৎ',
    reminders: 'নীংশিংহন্নবা',
    appointments: 'দোক্তর উনবা',
    family: 'ইমুংগী নীংশিং লাইরিক',
    settings: 'শেমদোক-শাদোকপা',
    insights: 'হকশেলগী পাউদম',

    takeMedicine: 'হিদাক চাবা',
    callFamily: 'ইমুংদা ফোন তৌবা',
    emergencyHelp: 'অকনবা মতেং',
    sos: 'ইমার্জেন্সী (SOS)',
    talkToSahay: 'সহায়গা ৱারী শাবা',
    playGame: 'শান্নপোৎ শান্নবা',
    startTodayActivity: 'ঙসিগী শান্নপোৎ হৌবা',
    viewProgress: 'মাংজিল থাবা য়েংবা',

    greeting: (name: string) => `খোৰুমজৰি, ${name}`,
    subGreetingCompanion: 'ঙসিগী থবকশিং হৌসি',
    subGreetingCaregiver: 'অহনশিংবু য়েংশিনবা অমসুং তেংবাং পীবগী মফম',
    caregiverOversight: 'য়েংশিনবগী ডেশ্ববোর্দ',
    companionMode: 'মরূপ মোদ',
    streakDays: (count: number) => `${count} নি লেপ্পা লৈতনা`,
    notifications: 'পাউদমশিং',
    unreadCount: (count: number) => `${count} য়াংদ্রিবা`,
    allCaughtUp: 'অনৌবা পাউদম অমত্তা লৈত্রে।',

    todaysFocus: 'ঙসিগী মরুওইবা',
    todaysCarePlan: 'ঙসিগী য়েন্থোক থৌরাং',
    viewAll: 'পুম্নমক য়েংবা',
    weeklyStreak: 'চয়োলগী লেপ্পা লৈতবা',
    avgAccuracy: 'চপ চাবগী চাং',
    nextReminder: 'তুংদা নীংশিংহন্নবা',
    quickActions: 'য়াংনা তৌবা',
    continueEngagement: 'ৱাখল শেংহনবগী থবক মাংলোইশিনবা',

    appAndVoiceLanguage: 'এপ অমসুং ৱারী শাবগী লোন',
    fontSize: 'ময়েক্কী চাং',
    languageSwitchedToast: 'লোন মৈতৈলোন্দা হোংদোকখ্রে',
  },

  Mizo: {
    home: 'In',
    activities: 'Infiamna',
    reminders: 'Hriattirna',
    appointments: 'Daktawr Hmuh Hun',
    family: 'Chhungkaw Hriatrengna',
    settings: 'Siamremna',
    insights: 'Hriselna Chanchin',

    takeMedicine: 'Damdawi Ei',
    callFamily: 'Chhungte Phone',
    emergencyHelp: 'Ṭanpuina Hmanhmawh',
    sos: 'SOS Hmanhmawh',
    talkToSahay: 'Sahay Be Rawh',
    playGame: 'Infiamna Khelh',
    startTodayActivity: 'Vawiin infiamna ṭan rawh',
    viewProgress: 'Hmasawnna en rawh',

    greeting: (name: string) => `Chibai, ${name}`,
    subGreetingCompanion: 'Vawiin atan hna i ṭan ang u',
    subGreetingCaregiver: 'Pitar-putar enkawlna leh venhimna hmun',
    caregiverOversight: 'Enkawltu Enchhinna',
    companionMode: 'Ṭhian Mode',
    streakDays: (count: number) => `Ni ${count} chhung zawnin`,
    notifications: 'Hriattirnate',
    unreadCount: (count: number) => `${count} chhiar loh`,
    allCaughtUp: 'Hriattirna thar a awm lo.',

    todaysFocus: 'Vawiin Ngaihven Tur',
    todaysCarePlan: 'Vawiin Enkawlna Ruahmanna',
    viewAll: 'A zavaiin en rawh',
    weeklyStreak: 'Kar tluan ṭhahnemngaihna',
    avgAccuracy: 'Dik zat chawhrual',
    nextReminder: 'Damdawi ei leh hun',
    quickActions: 'Tih zung zung theih',
    continueEngagement: 'Hriatna tihchak chhunzawm rawh',

    appAndVoiceLanguage: 'App leh Aw Ṭawng',
    fontSize: 'Hawrawp Lian-lam',
    languageSwitchedToast: 'Ṭawng chu Mizo-ah thlak a ni ta',
  },
};

/**
 * Returns the phrase dictionary for the given language.
 * Falls back to English if the requested language is missing.
 */
export function getDictionary(lang?: SupportedLanguage): DictionaryPhrases {
  if (!lang || !DICTIONARIES[lang]) {
    return DICTIONARIES.English;
  }
  return DICTIONARIES[lang];
}

/**
 * Returns metadata (native label, badge, speech locale) for a language.
 */
export function getLanguageMeta(lang?: SupportedLanguage): LanguageMeta {
  if (!lang || !LANGUAGE_METADATA[lang]) {
    return LANGUAGE_METADATA.English;
  }
  return LANGUAGE_METADATA[lang];
}
