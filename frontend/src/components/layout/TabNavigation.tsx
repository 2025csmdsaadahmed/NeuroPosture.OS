import React from 'react';
import { LayoutDashboard, LineChart, Cpu, Layers } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'analytics' | 'ai' | 'mapping';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onChangeTab
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Monitoring Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Session Analytics', icon: LineChart },
    { id: 'ai', label: 'AI Ergonomics', icon: Cpu, badge: 'Integration Ready' },
    { id: 'mapping', label: 'Firmware Telemetry Map', icon: Layers }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-dark-900/60 border border-slate-800 rounded-2xl w-fit backdrop-blur-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as ActiveTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
