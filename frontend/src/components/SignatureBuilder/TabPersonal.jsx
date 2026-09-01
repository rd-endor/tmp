import React from 'react';
import { User, Briefcase, Building, Mail, Phone, Smartphone, Globe, MapPin } from 'lucide-react';

export const TabPersonal = ({ signature, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...signature, [field]: value });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-400" /> Full Name
          </label>
          <input
            type="text"
            value={signature.full_name || ''}
            onChange={(e) => handleChange('full_name', e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-brand-400" /> Job Title
          </label>
          <input
            type="text"
            value={signature.job_title || ''}
            onChange={(e) => handleChange('job_title', e.target.value)}
            placeholder="e.g. Head of Product Security"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-brand-400" /> Company Name
          </label>
          <input
            type="text"
            value={signature.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="e.g. Endor Labs"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-brand-400" /> Department / Team
          </label>
          <input
            type="text"
            value={signature.department || ''}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="e.g. AppSec & Compliance"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address
          </label>
          <input
            type="email"
            value={signature.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="alex.morgan@endorlabs.com"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-brand-400" /> Website URL
          </label>
          <input
            type="text"
            value={signature.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://endorlabs.com"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Office Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-brand-400" /> Office Phone
          </label>
          <input
            type="text"
            value={signature.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (415) 555-0142"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Mobile Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-brand-400" /> Mobile / Cell
          </label>
          <input
            type="text"
            value={signature.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            placeholder="+1 (415) 555-0199"
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-400" /> Office Address
        </label>
        <input
          type="text"
          value={signature.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="702 Marshall St, Redwood City, CA"
          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
        />
      </div>
    </div>
  );
};
