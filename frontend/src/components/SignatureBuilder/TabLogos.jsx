import React, { useState, useEffect } from 'react';
import { assetsApi } from '../../api/client';
import { Image as ImageIcon, Upload, Check, UserCircle, Sparkles, Loader2 } from 'lucide-react';

export const TabLogos = ({ signature, onChange }) => {
  const [preloadedLogos, setPreloadedLogos] = useState([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const loadLogos = async () => {
      try {
        const logos = await assetsApi.getLogos();
        setPreloadedLogos(logos);
      } catch (err) {
        // Fallback default logos if backend unreachable during dev
        setPreloadedLogos([
          {
            id: 'endor-labs-full',
            name: 'Endor Labs (Standard)',
            url: '/logos/endor-labs-logo-2.png',
          },
          {
            id: 'endor-labs-ss',
            name: 'Endor Labs (Square / Compact)',
            url: '/logos/endor-labs-logo-ss.png',
          },
        ]);
      }
    };
    loadLogos();
  }, []);

  const handleChange = (field, value) => {
    onChange({ ...signature, [field]: value });
  };

  const handleFileUpload = async (e, field, setUploading) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await assetsApi.uploadImage(file);
      handleChange(field, data.url);
    } catch (err) {
      alert('Failed to upload image. Please try a PNG or JPEG file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Preloaded Brand Logos */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Pre-loaded Brand Logos (Repository Assets)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {preloadedLogos.map((logo) => {
            const isSelected = signature.logo_url === logo.url || signature.logo_url?.endsWith(logo.filename || '');
            return (
              <div
                key={logo.id}
                onClick={() => handleChange('logo_url', logo.url)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 shadow-md ring-1 ring-brand-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-24 bg-white/95 rounded-lg p-1.5 flex items-center justify-center border border-slate-700">
                    <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{logo.name}</div>
                    <div className="text-[10px] text-slate-400">Integrated Asset</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Company Logo Input & Upload */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
        <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-brand-400" /> Custom Company Logo
          </span>
          {signature.logo_url && (
            <button
              type="button"
              onClick={() => handleChange('logo_url', '')}
              className="text-[11px] text-red-400 hover:underline"
            >
              Remove Logo
            </button>
          )}
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={signature.logo_url || ''}
            onChange={(e) => handleChange('logo_url', e.target.value)}
            placeholder="https://example.com/logo.png"
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1.5 transition-all">
            {uploadingLogo ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'logo_url', setUploadingLogo)}
            />
          </label>
        </div>
      </div>

      {/* Avatar / Personal Headshot */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
        <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <UserCircle className="w-3.5 h-3.5 text-brand-400" /> Avatar / Headshot Photo
          </span>
          {signature.avatar_url && (
            <button
              type="button"
              onClick={() => handleChange('avatar_url', '')}
              className="text-[11px] text-red-400 hover:underline"
            >
              Remove Photo
            </button>
          )}
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={signature.avatar_url || ''}
            onChange={(e) => handleChange('avatar_url', e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1.5 transition-all">
            {uploadingAvatar ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'avatar_url', setUploadingAvatar)}
            />
          </label>
        </div>

        {signature.avatar_url && (
          <div className="flex items-center gap-3 pt-2">
            <img
              src={signature.avatar_url}
              alt="Avatar preview"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <span className="text-[11px] text-slate-400">Headshot photo active</span>
          </div>
        )}
      </div>
    </div>
  );
};
