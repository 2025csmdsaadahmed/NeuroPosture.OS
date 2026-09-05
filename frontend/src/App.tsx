import React, { useState } from 'react';
import { useBlynkData } from './hooks/useBlynkData';
import type { UserProfile } from './types/user';
import { Navbar } from './components/layout/Navbar';
import { TabNavigation, type ActiveTab } from './components/layout/TabNavigation';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiErgonomicsPage } from './pages/AiErgonomicsPage';
import { MappingPage } from './pages/MappingPage';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { DataMappingModal } from './components/modals/DataMappingModal';

export const App: React.FC = () => {
  const {
    data,
    history,
    isDemoMode,
    toggleDemoMode,
    secondsAgo
  } = useBlynkData();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('deskcore_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isOnboarding, setIsOnboarding] = useState<boolean>(() => {
    return !userProfile || !userProfile.onboardingCompleted;
  });

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboarding(false);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenMapping={() => setIsMappingModalOpen(true)}
        isDemoMode={isDemoMode}
        onToggleDemoMode={toggleDemoMode}
        blynkConnected={data.connected}
        isStale={data.isStale}
        secondsAgo={secondsAgo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabNavigation
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />
        </div>

        {/* Tab Pages */}
        {activeTab === 'dashboard' && (
          <DashboardPage
            data={data}
            history={history}
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            history={history}
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'ai' && (
          <AiErgonomicsPage />
        )}

        {activeTab === 'mapping' && (
          <MappingPage />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-dark-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            NEUROPOSTURE OS • DESKCORE SMART CHAIR MONITORING
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            ESP32 TELEMETRY • STRICT BLYNK PROTOCOL V1 • NO FABRICATED VALUES
          </div>
        </div>
      </footer>

      {/* Onboarding Welcome Modal */}
      <UserProfileModal
        isOpen={isOnboarding}
        onSave={handleSaveProfile}
        canDismiss={false}
      />

      {/* Profile Settings Modal (when user clicks profile in header) */}
      <UserProfileModal
        isOpen={isProfileModalOpen && !isOnboarding}
        onSave={handleSaveProfile}
        initialProfile={userProfile}
        canDismiss={true}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Data Mapping Inspector Modal */}
      <DataMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
      />
    </div>
  );
};

export default App;
