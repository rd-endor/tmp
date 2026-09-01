import React, { useState } from 'react';
import { TabPersonal } from './TabPersonal';
import { TabDesign } from './TabDesign';
import { TabLogos } from './TabLogos';
import { TabSocial } from './TabSocial';
import { TabAddons } from './TabAddons';
import { User, Palette, Image as ImageIcon, Share2, PlusCircle, Sparkles } from 'lucide-react';

export const SignatureBuilder = ({ signature, onChange }) => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Details', icon: User, desc: 'Contact & Job' },
    { id: 'design', label: 'Design', icon: Palette, desc: 'Template & Colors' },
    { id: 'logos', label: 'Logos', icon: ImageIcon, desc: 'Branding & Headshot' },
    { id: 'social', label: 'Social', icon: Share2, desc: 'Profiles & Links' },
    { id: 'addons', label: 'Add-ons', icon: PlusCircle, desc: 'CTA & Legal' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b border-slate-800 bg-slate-950/70 p-2 flex items-center justify-start overflow-x-auto gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="p-5 sm:p-6 overflow-y-auto flex-1">
        {activeTab === 'personal' && <TabPersonal signature={signature} onChange={onChange} />}
        {activeTab === 'design' && <TabDesign signature={signature} onChange={onChange} />}
        {activeTab === 'logos' && <TabLogos signature={signature} onChange={onChange} />}
        {activeTab === 'social' && <TabSocial signature={signature} onChange={onChange} />}
        {activeTab === 'addons' && <TabAddons signature={signature} onChange={onChange} />}
      </div>
    </div>
  );
};
