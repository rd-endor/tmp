import React from 'react';
import { Share2, Globe } from 'lucide-react';

export const TabSocial = ({ signature, onChange }) => {
  const getSocials = () => {
    if (!signature.social_links) return {};
    if (typeof signature.social_links === 'object') return signature.social_links;
    try {
      return JSON.parse(signature.social_links);
    } catch {
      return {};
    }
  };

  const socials = getSocials();

  const handleSocialChange = (network, value) => {
    const updated = { ...socials, [network]: value };
    onChange({ ...signature, social_links: JSON.stringify(updated) });
  };

  const socialNetworks = [
    { key: 'linkedin', label: 'LinkedIn Profile / Company', placeholder: 'https://linkedin.com/company/endor-labs', icon: '💼' },
    { key: 'twitter', label: 'X (Twitter) Profile', placeholder: 'https://x.com/endorlabs', icon: '🐦' },
    { key: 'github', label: 'GitHub Profile / Org', placeholder: 'https://github.com/endorlabs', icon: '🐙' },
    { key: 'youtube', label: 'YouTube Channel', placeholder: 'https://youtube.com/@endorlabs', icon: '▶️' },
    { key: 'instagram', label: 'Instagram Profile', placeholder: 'https://instagram.com/endorlabs', icon: '📸' },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-brand-400" /> Social Media Profiles
        </label>
        <span className="text-[11px] text-slate-500">Leave blank to exclude icon</span>
      </div>

      <div className="space-y-3">
        {socialNetworks.map((net) => (
          <div key={net.key} className="flex items-center gap-2">
            <span className="w-7 h-7 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-lg text-sm">
              {net.icon}
            </span>
            <div className="flex-1">
              <input
                type="text"
                value={socials[net.key] || ''}
                onChange={(e) => handleSocialChange(net.key, e.target.value)}
                placeholder={net.placeholder}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
