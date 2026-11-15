import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  greeting: string;
  subGreeting: string;
  caregiverTitle: string;
  caregiverSub: string;
  home: string;
  activities: string;
  reminders: string;
  appointments: string;
  family: string;
  familyCaregiver: string;
  insights: string;
  insightsCaregiver: string;
  settings: string;
  sos: string;
  streak: string;
  talkToSahay: string;
  takeMedicine: string;
  callFamily: string;
  synced: string;
  logout: string;
}

export const DICTIONARIES: Record<SupportedLanguage, TranslationDictionary> = {
  English: {
    greeting: 'Namaskar, Bimala aita',
    subGreeting: 'Tuesday, 30 August · Let’s begin today’s activities',
    caregiverTitle: 'Caregiver Oversight',
    caregiverSub: 'Real-time elder connection, activity alerts, and safety perimeter',
    home: 'Overview',
    activities: 'Activities',
    reminders: 'Reminders',
    appointments: 'Appointments',
    family: 'Memory Book',
    familyCaregiver: 'Family Dashboard',
    insights: 'My Insights',
    insightsCaregiver: 'Care Insights',
    settings: 'Settings',
    sos: 'Emergency SOS',
    streak: '6-day streak',
    talkToSahay: 'Talk to Sahay',
    takeMedicine: 'Take Medicine',
    callFamily: 'Call Family',
    synced: 'Synced',
    logout: 'Logout',
  },
  Assamese: {
    greeting: 'নমস্কাৰ, বিমলা আইতা',
    subGreeting: 'মঙলবাৰ, ৩০ আগষ্ট · আহক আজিৰ কামবোৰ আৰম্ভ কৰোঁ',
    caregiverTitle: 'পৰিয়াল তদাৰকী কেন্দ্ৰ',
    caregiverSub: 'নিৰাপত্তা সীমা, স্মৃতিৰ ভঁৰাল আৰু দৈনন্দিন স্বাস্থ্য তদাৰকী',
    home: 'সামগ্ৰিক ৰূপৰেখা',
    activities: 'মন-অনুশীলন',
    reminders: 'সময়সূচী',
    appointments: 'চিকিৎসকৰ সাক্ষাৎ',
    family: 'স্মৃতিৰ ভঁৰাল',
    familyCaregiver: 'পৰিয়াল ডেচব’ৰ্ড',
    insights: 'মোৰ প্ৰতিবেদন',
    insightsCaregiver: 'স্বাস্থ্য প্ৰতিবেদন',
    settings: 'ছেটিংছ',
    sos: 'জৰুৰীকালীন সাহায্য',
    streak: '৬ দিনৰ ধাৰাবাহিকতা',
    talkToSahay: 'সহায়ক কওক',
    takeMedicine: 'ঔষধ খোৱাৰ সময়',
    callFamily: 'পৰিয়াললৈ ফোন',
    synced: 'সংযুক্ত',
    logout: 'লগআউট',
  },
  Bodo: {
    greeting: 'खुलुमबाय, बिमला आयै',
    subGreeting: 'मंगलबार, ३० आगस्त · दिनैनि हाबाफारिखौ जागायदिनि',
    caregiverTitle: 'नखर नायबिजिरग्रा',
    caregiverSub: 'रैखाथि सिमा आरो सावथ्रि गोसोखांथि',
    home: 'गाहाय बिलाइ',
    activities: 'मेमोरी गेलेनाय',
    reminders: 'गोसोखांथि',
    appointments: 'डाक्टर लोगो हमनाय',
    family: 'नखरनि बिलाइ',
    familyCaregiver: 'नखर डेशबोर्ड',
    insights: 'सावथ्रि खौरां',
    insightsCaregiver: 'जतन नायबिजिरनाय',
    settings: 'गोसोबायदि',
    sos: 'गोनांथार हेफाजाब',
    streak: '६ साननि थांखि',
    talkToSahay: 'सहायजों रायज्लाय',
    takeMedicine: 'मुली जानाय',
    callFamily: 'नखराव कल खालाम',
    synced: 'जोड़ायबाय',
    logout: 'अंखांख',
  },
  Khasi: {
    greeting: 'Khublei, Mei Bimala',
    subGreeting: 'Sngi Ba-ar, 30 August · To ngin sdang ia ki kam mynta ka sngi',
    caregiverTitle: 'Ka Jingpeit Jingkhiah Kur',
    caregiverSub: 'Ka jingpeit ia ka shongsuk, dawai bad jingkynmaw',
    home: 'Kyllum',
    activities: 'Ki Jingialehkai',
    reminders: 'Jingpynkynmaw',
    appointments: 'Iakynduh Doktor',
    family: 'Kot Jingkynmaw',
    familyCaregiver: 'Dashboard Iing',
    insights: 'Jingkoit Jingkhiah',
    insightsCaregiver: 'Ka Jingtip Jingkoit',
    settings: 'Ki Jingpynbeit',
    sos: 'Jingiarap Kyrkieh',
    streak: '6 sngi lynter',
    talkToSahay: 'Kren bad U Sahay',
    takeMedicine: 'Dih Dawai',
    callFamily: 'Phone sha ka Iing',
    synced: 'Pyniasoh',
    logout: 'Mih noh',
  },
  Manipuri: {
    greeting: 'খুরুমজরি, বিমলা ইমা',
    subGreeting: 'লৈপাকপোকপা, ৩০ ওগস্ত · ঙসিগী থবকশিং হৌসি',
    caregiverTitle: 'ইমুংগী য়েংশিনবগী মফম',
    caregiverSub: 'হকশেল, নিংশিংহন্নবা অমসুং সেফতী জোন',
    home: 'মরুওইবা ৱাফম',
    activities: 'ৱাখল এক্সরসাইজ',
    reminders: 'নিংশিংহন্নবা',
    appointments: 'দোক্তর উনবা',
    family: 'স্মৃতিগী লাইরিক',
    familyCaregiver: 'ইমুংগী দেশবোর্দ',
    insights: 'হকশেলগী পাউ',
    insightsCaregiver: 'মেদিকেল রিপোর্ত',
    settings: 'সেটিংশিং',
    sos: 'অকক্নবা মতেং',
    streak: 'নুমিৎ ৬ লেপ্পা লৈতনা',
    talkToSahay: 'সহায়গা ৱারী শাবা',
    takeMedicine: 'হিদাক চাবা',
    callFamily: 'ইমুংগী মীদা কোল',
    synced: 'শম্নরে',
    logout: 'থোকপা',
  },
  Mizo: {
    greeting: 'Chibai, Pi Bimala',
    subGreeting: 'Thawhlehni, 30 August · Vawiin hun hman chhoh tan ila',
    caregiverTitle: 'Chhungte Enkawlna',
    caregiverSub: 'Himna hmun, damdawi leh hriatrengna enkawlna',
    home: 'Khaihkhawmna',
    activities: 'Thluak Sawizawina',
    reminders: 'Hriatnawntirna',
    appointments: 'Doctor Hmuhna',
    family: 'Hriatrengna Bu',
    familyCaregiver: 'Chhungkua Dashboard',
    insights: 'Hriselna Chanchin',
    insightsCaregiver: 'Enkawlna Chanchin',
    settings: 'Inremhmanna',
    sos: 'Tanpuina Rang',
    streak: 'Ni 6 zawhna',
    talkToSahay: 'Sahay Be Rawh',
    takeMedicine: 'Damdawi Ei',
    callFamily: 'Chhungte Phone',
    synced: 'Thlunzawm',
    logout: 'Chhuak',
  },
};

export function getDictionary(lang?: SupportedLanguage | string): TranslationDictionary {
  if (lang && lang in DICTIONARIES) {
    return DICTIONARIES[lang as SupportedLanguage];
  }
  return DICTIONARIES.English;
}