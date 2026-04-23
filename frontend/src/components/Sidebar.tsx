/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  History, 
  Settings, 
  Bell,
  Menu
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const items = [
    { id: 'monitoring', icon: Activity, label: 'Real-time Monitoring' },
    { id: 'rules', icon: Search, label: 'Rules & Logic' },
    { id: 'audit', icon: History, label: 'Audit Logs' },
    { id: 'alerts', icon: Bell, label: 'Alert Center' },
    { id: 'config', icon: Settings, label: 'Configuration' },
  ];

  return (
    <aside className="w-20 bg-[#080a0f] border-r border-white/5 flex flex-col items-center py-6 gap-8 h-full shrink-0" id="main-sidebar">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
            activeTab === item.id 
              ? 'bg-brand-blue/10 border border-brand-blue/30 text-brand-blue shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
              : 'text-slate-600 hover:bg-white/5 hover:text-slate-400'
          }`}
          title={item.label}
          id={`nav-${item.id}`}
        >
          <item.icon size={22} className="shrink-0" />
        </button>
      ))}

      <div className="mt-auto px-4">
        <div className="w-10 h-10 rounded-full border border-white/10 bg-slate-800 overflow-hidden ring-2 ring-white/5">
          <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-700" />
        </div>
      </div>
    </aside>
  );
}
