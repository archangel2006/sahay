import React, { useState, useEffect } from 'react';
import { PageId, ActivityId, SupportedLanguage, TextScale, ReminderItem, AppointmentItem, FamilyMemberItem, ZoneEventItem, UserRole, PortalMode } from './types';
import { api } from './services/api';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';
import { SplashScreen } from './components/auth/SplashScreen';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { HomeView } from './features/home/HomeView';
import { ActivitiesView } from './features/activities/ActivitiesView';
import { ActivityHost } from './features/activities/ActivityHost';
import { RemindersView } from './features/reminders/RemindersView';
import { AppointmentsView } from './features/appointments/AppointmentsView';
import { FamilyView } from './features/family/FamilyView';
import { InsightsView } from './features/family/InsightsView';
import { SettingsView } from './features/settings/SettingsView';
import { VoiceAssistantModal } from './components/modals/VoiceAssistantModal';
import { SosModal } from './components/modals/SosModal';
import { Toast } from './components/ui/Toast';
import { MessageCircle, Mic, Sparkles } from 'lucide-react';

export default function App() {
  // Brand Calm Splash state (shown on initial load / reload)
  const [showSplash, setShowSplash] = useState(true);

  // Session / Portal state
  const [portalMode, setPortalMode] = useState<PortalMode | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('companion');
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeGameId, setActiveGameId] = useState<ActivityId | null>(null);

  // Core data states
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([]);
  const [safeZoneRadius, setSafeZoneRadius] = useState<number>(500);
  const [zoneEvents, setZoneEvents] = useState<ZoneEventItem[]>([]);

  // Accessibility & Preferences
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [fontSize, setFontSize] = useState<TextScale>('normal');

  // Modals & Drawers
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string | null; iconType?: string }>({
    message: null,
  });

  const showToast = (message: string, iconType?: string) => {
    setToast({ message, iconType });
    setTimeout(() => {
      setToast({ message: null });
    }, 2800);
  };

  const loadAppData = async () => {
    const [remData, apptData, famData, safeData] = await Promise.all([
      api.getReminders(),
      api.getAppointments(),
      api.getFamilyMembers(),
      api.getSafetyStatus(),
    ]);
    setReminders(remData);
    setAppointments(apptData);
    setFamilyMembers(famData);
    setSafeZoneRadius(safeData.radius);
    setZoneEvents(safeData.events);
  };

  // Initial load
  useEffect(() => {
    loadAppData();
  }, []);

  // Sync font size class on body
  useEffect(() => {
    document.body.classList.remove('fs-large', 'fs-xlarge');
    if (fontSize === 'large') document.body.classList.add('fs-large');
    if (fontSize === 'xlarge') document.body.classList.add('fs-xlarge');
  }, [fontSize]);

  const handleEnterPortal = (mode: PortalMode, role: UserRole) => {
    setPortalMode(mode);
    setUserRole(role);
    if (role === 'caregiver') {
      setCurrentPage('family');
    } else {
      setCurrentPage('home');
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'caregiver') {
      setCurrentPage('family');
    } else if (currentPage === 'family') {
      setCurrentPage('home');
    }
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setActiveGameId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'English' ? 'Assamese' : 'English';
    setLanguage(nextLang);
    showToast(
      nextLang === 'Assamese' ? 'ভাষা অসমীয়ালৈ সলনি কৰা হ’ল' : 'Language switched to English',
      'globe'
    );
  };

  const handleToggleReminder = async (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
    await api.toggleReminder(id);
    const target = reminders.find((r) => r.id === id);
    if (target && !target.done) {
      showToast(`${target.txt} marked as done`, 'check');
    }
  };

  const handleAddReminder = async (txt: string, time: string) => {
    const created = await api.addReminder(txt, time);
    setReminders((prev) => [...prev, created]);
  };

  const handleAddAppointment = async (item: Omit<AppointmentItem, 'id'>) => {
    const created = await api.addAppointment(item);
    setAppointments((prev) => [...prev, created]);
  };

  const handleAddFamilyMember = async (item: Omit<FamilyMemberItem, 'id'>) => {
    const created = await api.addFamilyMember(item);
    setFamilyMembers((prev) => [...prev, created]);
  };

  const handleUpdateFamilyMember = async (item: FamilyMemberItem) => {
    const updated = await api.updateFamilyMember(item);
    setFamilyMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleUpdateRadius = async (radius: number) => {
    setSafeZoneRadius(radius);
    await api.updateSafetyRadius(radius);
  };

  const handleStartGame = (id: string) => {
    setCurrentPage('activities');
    setActiveGameId(id as ActivityId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSessionComplete = (stats: { moves: number; accuracy: number }) => {
    api.logActivity({
      activityId: activeGameId || 'activity',
      title: activeGameId ? activeGameId.toUpperCase() : 'Activity',
      durationSeconds: 120,
      accuracyPercentage: stats.accuracy,
    });
  };

  const handleLogout = () => {
    setPortalMode(null);
    setCurrentPage('home');
    setActiveGameId(null);
    showToast('Logged out successfully', 'check');
  };

  // Standalone calm splash screen on site load / reload
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // If portal mode not selected yet, show sequential 2-screen onboarding flow
  if (!portalMode) {
    return <OnboardingFlow onComplete={handleEnterPortal} />;
  }

  return (
    <div className="flex min-h-screen bg-[#FBF7EE] text-[#221F1B]">
      {/* Desktop Sticky Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSos={() => setIsSosModalOpen(true)}
        onLogout={handleLogout}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-8">
        {/* Mobile Header & Drawer */}
        <MobileNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isDrawerOpen={isMobileDrawerOpen}
          onOpenDrawer={() => setIsMobileDrawerOpen(true)}
          onCloseDrawer={() => setIsMobileDrawerOpen(false)}
          onOpenSos={() => setIsSosModalOpen(true)}
          onLogout={handleLogout}
          userRole={userRole}
        />

        {/* Topbar */}
        <Topbar
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onOpenSos={() => setIsSosModalOpen(true)}
          userRole={userRole}
          portalMode={portalMode}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
        />

        {/* Page Views */}
        <main className="p-4 sm:p-7 md:p-8 flex-1">
          {currentPage === 'home' && (
            <HomeView
              reminders={reminders}
              onToggleReminder={handleToggleReminder}
              onNavigate={handleNavigate}
              onStartGame={handleStartGame}
              onOpenVoice={() => setIsVoiceModalOpen(true)}
              showToast={showToast}
              elderId="SHY-9021"
              elderName="Bimala aita"
            />
          )}

          {currentPage === 'activities' && (
            activeGameId ? (
              <ActivityHost
                activityId={activeGameId}
                onBack={() => setActiveGameId(null)}
                showToast={showToast}
                onSessionComplete={handleSessionComplete}
              />
            ) : (
              <ActivitiesView onSelectGame={(id) => setActiveGameId(id)} />
            )
          )}

          {currentPage === 'reminders' && (
            <RemindersView
              reminders={reminders}
              onToggle={handleToggleReminder}
              onAdd={handleAddReminder}
              showToast={showToast}
            />
          )}

          {currentPage === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onAdd={handleAddAppointment}
              showToast={showToast}
            />
          )}

          {currentPage === 'family' && (
            <FamilyView
              familyMembers={familyMembers}
              onAddFamilyMember={handleAddFamilyMember}
              onUpdateFamilyMember={handleUpdateFamilyMember}
              safeZoneRadius={safeZoneRadius}
              onUpdateRadius={handleUpdateRadius}
              zoneEvents={zoneEvents}
              showToast={showToast}
              userRole={userRole}
              onNavigateToInsights={() => handleNavigate('insights')}
            />
          )}

          {currentPage === 'insights' && (
            <InsightsView
              userRole={userRole}
              safeZoneRadius={safeZoneRadius}
              onUpdateRadius={handleUpdateRadius}
              zoneEvents={zoneEvents}
              showToast={showToast}
              onNavigateToActivities={() => handleNavigate('activities')}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              fontSize={fontSize}
              onChangeFontSize={(scale) => setFontSize(scale)}
              language={language}
              onChangeLanguage={(lang) => {
                setLanguage(lang);
                showToast(`App language set to ${lang}`, 'globe');
              }}
              showToast={showToast}
              userRole={userRole}
              onSwitchRole={handleSwitchRole}
              portalMode={portalMode}
              onResetApp={loadAppData}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Global High-Visibility "Talk to Sahay" Floating Voice Orb */}
      <div className="fixed bottom-20 md:bottom-7 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsVoiceModalOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#152B26] text-[#FBF7EE] shadow-2xl hover:shadow-[0_10px_28px_rgba(226,163,61,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#E2A33D]"
          title="Talk with Sahay"
        >
          {/* Subtle radiant pulse aura */}
          <span className="absolute -inset-1 rounded-full bg-[#E2A33D]/25 animate-pulse pointer-events-none" />

          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#E2A33D] to-[#F3C268] text-[#152B26] flex items-center justify-center shrink-0 shadow-sm">
            <Mic className="w-4 h-4 text-[#152B26] group-hover:scale-110 transition-transform" />
          </div>

          <div className="text-left pr-1 hidden sm:block">
            <div className="font-baloo font-bold text-sm leading-none text-[#FBF7EE]">Talk to Sahay</div>
          </div>
        </button>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        showToast={showToast}
      />

      {/* SOS Emergency Modal */}
      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        showToast={showToast}
      />

      {/* Global Floating Toast */}
      <Toast message={toast.message} iconType={toast.iconType} />
    </div>
  );
}
