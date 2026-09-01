import React from 'react';
import { PlusCircle, ShieldAlert, MousePointerClick, Leaf } from 'lucide-react';

export const TabAddons = ({ signature, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...signature, [field]: value });
  };

  const presetDisclaimers = [
    {
      title: "Confidentiality Notice",
      text: "Confidentiality Note: The information contained in this email is legally privileged and strictly confidential. If you are not the intended recipient, please notify the sender immediately and delete this email."
    },
    {
      title: "Eco / Green Notice",
      text: "🌱 Please consider the environment before printing this email."
    },
    {
      title: "General Security Notice",
      text: "Security Notice: Never share passwords or sensitive credentials over email. Endor Labs will never ask for your confidential authentication details via email."
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Call to Action (CTA) Button */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <MousePointerClick className="w-3.5 h-3.5 text-brand-400" /> Custom CTA Button
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] text-slate-400 mb-1 block">Button Label</span>
            <input
              type="text"
              value={signature.custom_cta_text || ''}
              onChange={(e) => handleChange('custom_cta_text', e.target.value)}
              placeholder="e.g. Schedule a Demo"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 mb-1 block">Button Target URL</span>
            <input
              type="text"
              value={signature.custom_cta_url || ''}
              onChange={(e) => handleChange('custom_cta_url', e.target.value)}
              placeholder="https://endorlabs.com/demo"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Legal & Compliance Disclaimer */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-400" /> Legal & Disclaimer Notice
          </span>
          {signature.disclaimer && (
            <button
              type="button"
              onClick={() => handleChange('disclaimer', '')}
              className="text-[11px] text-red-400 hover:underline"
            >
              Clear
            </button>
          )}
        </label>
        <textarea
          rows={3}
          value={signature.disclaimer || ''}
          onChange={(e) => handleChange('disclaimer', e.target.value)}
          placeholder="Enter custom disclaimer text or choose from presets below..."
          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none resize-none"
        />

        {/* Disclaimer presets */}
        <div className="mt-2 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-500">Quick Presets:</span>
          <div className="flex flex-wrap gap-2">
            {presetDisclaimers.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleChange('disclaimer', preset.text)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              >
                + {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
