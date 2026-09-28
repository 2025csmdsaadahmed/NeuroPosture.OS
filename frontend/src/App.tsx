import React, { useEffect, useState } from 'react';
import { useBlynkData } from './hooks/useBlynkData';
import type { HistoricalDataPoint } from './types/blynk';
import type { UserProfile } from './types/user';
import { Navbar } from './components/layout/Navbar';
import { TabNavigation, type ActiveTab } from './components/layout/TabNavigation';
import { DashboardPage } from './pages/DashboardPage';
import { SensorsBiometricsPage } from './pages/SensorsBiometricsPage';
import { SystemTelemetryPage } from './pages/SystemTelemetryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiErgonomicsPage } from './pages/AiErgonomicsPage';
import { MappingPage } from './pages/MappingPage';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { DataMappingModal } from './components/modals/DataMappingModal';
import { loadCurrentProfile, loadProfileMetrics, saveProfileMetrics, saveUserProfile } from './services/profileStorage';
import { saveSession } from './services/sessionStorage';

function mergeMetricHistory(...histories: HistoricalDataPoint[][]): HistoricalDataPoint[] {
  return histories.flat().filter((point, index, points) => {
    const signature = JSON.stringify(point);
    return points.findIndex((candidate) => JSON.stringify(candidate) === signature) === index;
  }).slice(-300);
}

export const App: React.FC = () => {
  const {
    data,
    history,
    isDemoMode,
    toggleDemoMode,
    secondsAgo
  } = useBlynkData();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    return loadCurrentProfile();
  });

  const [profileMetrics, setProfileMetrics] = useState<HistoricalDataPoint[]>([]);

  // Authentication is intentionally required on every fresh application launch.
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);

  const handleSaveProfile = (profile: UserProfile) => {
    const savedProfile = saveUserProfile(profile);
    setUserProfile(savedProfile);
    setIsOnboarding(false);
    setActiveTab('overview');
    setIsProfileModalOpen(false);
    saveSession({
      id: '',
      profileId: savedProfile.id,
      userName: savedProfile.fullName,
      userAge: savedProfile.age,
      userGender: savedProfile.gender,
      sessionDate: new Date().toISOString().slice(0, 10),
      loginTime: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      logoutTime: null,
      durationSeconds: 0,
      summary: {
        avgDistance: null,
        avgBodyTemp: null,
        avgHumidity: null,
        avgStressIndex: null,
        avgEnvTemp: null,
        optimalPostureCount: 0,
        cautionPostureCount: 0,
        criticalPostureCount: 0,
        dataPoints: 0,
        isDemoMode
      }
    });
  };

  useEffect(() => {
    if (!userProfile?.id) return;
    setProfileMetrics(loadProfileMetrics(userProfile.id));
  }, [userProfile?.id]);

  useEffect(() => {
    if (!userProfile?.id || history.length === 0) return;
    saveProfileMetrics(userProfile.id, history);
    setProfileMetrics((previous) => mergeMetricHistory(previous, history));
  }, [history, userProfile?.id]);

  const analyticsHistory = mergeMetricHistory(profileMetrics, history);

  if (isOnboarding) {
    return (
      <UserProfileModal
        isOpen
        onSave={handleSaveProfile}
        canDismiss={false}
      />
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
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

      {/* Global navigation stays fixed above every dashboard surface. */}
      {!isOnboarding && (
        <TabNavigation
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      )}

      {/* Main Container */}
      <main className="relative flex-1 w-full px-4 sm:px-8 lg:px-10 2xl:px-12 py-6 sm:py-8 space-y-6">
        {/* Tab Pages */}
        {activeTab === 'overview' && (
          <DashboardPage
            data={data}
            history={history}
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'sensors' && (
          <SensorsBiometricsPage data={data} isDemoMode={isDemoMode} />
        )}

        {activeTab === 'system' && (
          <SystemTelemetryPage data={data} isDemoMode={isDemoMode} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            history={analyticsHistory}
            userProfile={userProfile}
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
      <footer className="border-t border-white/[0.06] bg-dark-950/70 py-6 text-center text-xs text-slate-500 backdrop-blur-xl">
        <div className="w-full px-4 sm:px-8 lg:px-10 2xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            NEUROPOSTURE OS • DESKCORE SMART CHAIR MONITORING
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            ESP32 TELEMETRY • STRICT BLYNK PROTOCOL V1 • NO FABRICATED VALUES
          </div>
        </div>
      </footer>

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
