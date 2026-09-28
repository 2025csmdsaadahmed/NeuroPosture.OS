import React, { useState } from 'react';
import { LayoutDashboard, LineChart, Cpu, Layers, MoreHorizontal, type LucideIcon } from 'lucide-react';

export type ActiveTab = 'overview' | 'sensors' | 'system' | 'analytics' | 'ai' | 'mapping';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

interface NavigationTab {
  id: ActiveTab;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onChangeTab
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryTabs: NavigationTab[] = [
    { id: 'overview', label: 'Overview / Command Center', icon: LayoutDashboard },
    { id: 'sensors', label: 'Sensors & Biometrics', icon: LineChart },
    { id: 'system', label: 'System & Telemetry Pipeline', icon: Layers }
  ];

  const utilityTabs: NavigationTab[] = [
    { id: 'analytics', label: 'Session Analytics', icon: LineChart },
    { id: 'ai', label: 'AI Ergonomics', icon: Cpu, badge: 'Integration Ready' },
    { id: 'mapping', label: 'Firmware Telemetry Map', icon: Layers }
  ];

  return (
    <div className="fixed top-4 left-4 z-[9999] flex items-center p-1.5 bg-dark-900 border border-white/[0.1] rounded-2xl w-fit shadow-2xl">
      <button
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        className={`relative shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-200 ${
          isMenuOpen
            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
            : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
        }`}
        aria-label="Show dashboard navigation icons"
        aria-expanded={isMenuOpen}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isMenuOpen && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-[10000] min-w-64 rounded-2xl border border-white/[0.12] bg-dark-900 p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
          <div className="border-b border-white/[0.07] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Navigate workspace
          </div>
          {[...primaryTabs, ...utilityTabs].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={`menu-${tab.id}`}
                type="button"
                onClick={() => {
                  onChangeTab(tab.id as ActiveTab);
                  setIsMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-auto text-[9px] text-cyan-300">READY</span>
                )}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};
