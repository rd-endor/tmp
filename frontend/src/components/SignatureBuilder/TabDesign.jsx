import React from 'react';
import { TEMPLATES, COLOR_PALETTES, FONT_OPTIONS } from '../../types/defaults';
import { Layout, Palette, Type, Check } from 'lucide-react';

export const TabDesign = ({ signature, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...signature, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Template Chooser */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-brand-400" /> Choose Signature Template
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map((tmpl) => {
            const isSelected = signature.template_id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleChange('template_id', tmpl.id)}
                className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 shadow-md shadow-brand-500/10 ring-1 ring-brand-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                    {tmpl.name}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                  {tmpl.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Color Picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-brand-400" /> Primary Brand Color
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.hex}
              type="button"
              onClick={() => handleChange('primary_color', palette.hex)}
              className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                signature.primary_color === palette.hex
                  ? 'border-white scale-110 shadow-lg'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: palette.hex }}
              title={palette.name}
            >
              {signature.primary_color === palette.hex && (
                <Check className="w-3.5 h-3.5 text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            <input
              type="color"
              value={signature.primary_color || '#0284c7'}
              onChange={(e) => handleChange('primary_color', e.target.value)}
              className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
            />
            <span className="text-xs text-slate-400">Custom Hex:</span>
          </div>
          <input
            type="text"
            value={signature.primary_color || '#0284c7'}
            onChange={(e) => handleChange('primary_color', e.target.value)}
            className="w-28 px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-lg text-xs text-slate-200 font-mono outline-none"
          />
        </div>
      </div>

      {/* Font Family Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-brand-400" /> Font Family (Email Safe)
        </label>
        <select
          value={signature.font_family || 'Arial, Helvetica, sans-serif'}
          onChange={(e) => handleChange('font_family', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 outline-none transition-all cursor-pointer"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500 mt-1">
          Standard system fonts guarantee pixel-perfect rendering across Gmail, Outlook, Apple Mail, and mobile apps.
        </p>
      </div>
    </div>
  );
};
