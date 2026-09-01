/**
 * Email Signature HTML Generators
 * Crafted with table-based markup and inline styles for 100% email client compatibility
 * (Outlook, Gmail, Apple Mail, Yahoo, iOS Mail, Android).
 */

const getSocialIconUrl = (network, colorHex = '0284c7') => {
  // Use high-reliability CDN hosted email social icons or SVG badges
  const c = colorHex.replace('#', '');
  const icons = {
    linkedin: `https://cdn-icons-png.flaticon.com/512/3536/3536505.png`,
    twitter: `https://cdn-icons-png.flaticon.com/512/5969/5969020.png`,
    github: `https://cdn-icons-png.flaticon.com/512/2111/2111432.png`,
    youtube: `https://cdn-icons-png.flaticon.com/512/3670/3670147.png`,
    instagram: `https://cdn-icons-png.flaticon.com/512/3955/3955024.png`,
    website: `https://cdn-icons-png.flaticon.com/512/1006/1006771.png`,
  };
  return icons[network] || icons.website;
};

const parseSocials = (socialLinksStr) => {
  if (!socialLinksStr) return {};
  if (typeof socialLinksStr === 'object') return socialLinksStr;
  try {
    return JSON.parse(socialLinksStr);
  } catch (e) {
    return {};
  }
};

export const generateSignatureHtml = (data) => {
  const templateId = data.template_id || 'modern_horizon';
  const primaryColor = data.primary_color || '#0284c7';
  const secondaryColor = data.secondary_color || '#475569';
  const font = data.font_family || 'Arial, Helvetica, sans-serif';
  const socials = parseSocials(data.social_links);

  // Social links row helper
  const renderSocialsRow = () => {
    const validSocials = Object.entries(socials).filter(([_, url]) => url && url.trim() !== '');
    if (validSocials.length === 0) return '';

    const iconTags = validSocials.map(([net, url]) => `
      <td style="padding-right: 8px; vertical-align: middle;">
        <a href="${url.startsWith('http') ? url : 'https://' + url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
          <img src="${getSocialIconUrl(net)}" alt="${net}" width="20" height="20" style="display: block; width: 20px; height: 20px; border: 0;" />
        </a>
      </td>
    `).join('');

    return `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 8px;">
        <tr>${iconTags}</tr>
      </table>
    `;
  };

  // Disclaimer helper
  const renderDisclaimer = () => {
    if (!data.disclaimer) return '';
    return `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px; max-width: 520px;">
        <tr>
          <td style="font-family: ${font}; font-size: 10px; line-height: 14px; color: #94a3b8; font-style: italic; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
            ${data.disclaimer}
          </td>
        </tr>
      </table>
    `;
  };

  // CTA Button helper
  const renderCtaButton = () => {
    if (!data.custom_cta_text || !data.custom_cta_url) return '';
    return `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
        <tr>
          <td style="background-color: ${primaryColor}; border-radius: 4px; text-align: center; padding: 6px 14px;">
            <a href="${data.custom_cta_url.startsWith('http') ? data.custom_cta_url : 'https://' + data.custom_cta_url}" target="_blank" rel="noopener noreferrer" style="font-family: ${font}; font-size: 12px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block;">
              ${data.custom_cta_text} &rarr;
            </a>
          </td>
        </tr>
      </table>
    `;
  };

  // 1. TEMPLATE: MODERN HORIZON
  if (templateId === 'modern_horizon') {
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${font}; font-size: 13px; line-height: 18px; color: #1e293b; background-color: transparent;">
  <tr>
    ${data.avatar_url ? `
    <td style="vertical-align: top; padding-right: 14px;">
      <img src="${data.avatar_url}" alt="${data.full_name}" width="72" height="72" style="display: block; width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid ${primaryColor};" />
    </td>
    ` : ''}
    <td style="border-left: 3px solid ${primaryColor}; padding-left: 14px; vertical-align: top;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <span style="font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">${data.full_name || 'Your Name'}</span>
          </td>
        </tr>
        ${data.job_title || data.company ? `
        <tr>
          <td style="padding-top: 2px;">
            <span style="font-size: 13px; font-weight: 600; color: ${primaryColor};">${data.job_title}</span>
            ${data.job_title && data.company ? `<span style="color: #94a3b8; margin: 0 4px;">|</span>` : ''}
            <span style="font-size: 13px; color: ${secondaryColor}; font-weight: 500;">${data.company}${data.department ? ` (${data.department})` : ''}</span>
          </td>
        </tr>
        ` : ''}
        
        <tr>
          <td style="padding-top: 8px;">
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; line-height: 18px; color: #475569;">
              ${data.phone ? `
              <tr>
                <td style="color: ${primaryColor}; font-weight: bold; padding-right: 6px; font-size: 11px;">T:</td>
                <td><a href="tel:${data.phone}" style="color: #475569; text-decoration: none;">${data.phone}</a></td>
              </tr>` : ''}
              ${data.mobile ? `
              <tr>
                <td style="color: ${primaryColor}; font-weight: bold; padding-right: 6px; font-size: 11px;">M:</td>
                <td><a href="tel:${data.mobile}" style="color: #475569; text-decoration: none;">${data.mobile}</a></td>
              </tr>` : ''}
              ${data.email ? `
              <tr>
                <td style="color: ${primaryColor}; font-weight: bold; padding-right: 6px; font-size: 11px;">E:</td>
                <td><a href="mailto:${data.email}" style="color: #475569; text-decoration: none;">${data.email}</a></td>
              </tr>` : ''}
              ${data.website ? `
              <tr>
                <td style="color: ${primaryColor}; font-weight: bold; padding-right: 6px; font-size: 11px;">W:</td>
                <td><a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" target="_blank" style="color: ${primaryColor}; text-decoration: none; font-weight: 500;">${data.website.replace(/^https?:\/\//, '')}</a></td>
              </tr>` : ''}
              ${data.address ? `
              <tr>
                <td style="color: ${primaryColor}; font-weight: bold; padding-right: 6px; font-size: 11px;">A:</td>
                <td style="color: #64748b;">${data.address}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        ${data.logo_url ? `
        <tr>
          <td style="padding-top: 10px;">
            <img src="${data.logo_url}" alt="${data.company || 'Logo'}" height="32" style="max-height: 32px; max-width: 150px; display: block; border: 0;" />
          </td>
        </tr>
        ` : ''}

        <tr>
          <td>
            ${renderSocialsRow()}
            ${renderCtaButton()}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      ${renderDisclaimer()}
    </td>
  </tr>
</table>
`.trim();
  }

  // 2. TEMPLATE: CORPORATE CLASSIC
  if (templateId === 'corporate_classic') {
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${font}; font-size: 13px; line-height: 18px; color: #1e293b;">
  <tr>
    <td style="vertical-align: middle; padding-right: 18px;">
      ${data.logo_url ? `
        <img src="${data.logo_url}" alt="${data.company || 'Company'}" width="130" style="display: block; width: 130px; border: 0;" />
      ` : (data.avatar_url ? `
        <img src="${data.avatar_url}" alt="${data.full_name}" width="80" height="80" style="display: block; width: 80px; height: 80px; border-radius: 4px; object-fit: cover;" />
      ` : `<div style="font-size: 20px; font-weight: 800; color: ${primaryColor};">${data.company || 'Company'}</div>`)}
    </td>
    <td style="width: 1px; background-color: #cbd5e1;"></td>
    <td style="vertical-align: top; padding-left: 18px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <div style="font-size: 16px; font-weight: bold; color: ${primaryColor};">${data.full_name || 'Your Name'}</div>
            <div style="font-size: 13px; color: #475569; font-weight: 600; margin-top: 1px;">${data.job_title} ${data.company ? `| ${data.company}` : ''}</div>
            ${data.department ? `<div style="font-size: 12px; color: #64748b;">${data.department}</div>` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding-top: 8px; font-size: 12px; color: #334155;">
            ${data.email ? `<div><span style="color: #94a3b8;">Email:</span> <a href="mailto:${data.email}" style="color: #334155; text-decoration: none;">${data.email}</a></div>` : ''}
            ${data.phone ? `<div><span style="color: #94a3b8;">Tel:</span> <a href="tel:${data.phone}" style="color: #334155; text-decoration: none;">${data.phone}</a></div>` : ''}
            ${data.website ? `<div><span style="color: #94a3b8;">Web:</span> <a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">${data.website.replace(/^https?:\/\//, '')}</a></div>` : ''}
            ${data.address ? `<div><span style="color: #94a3b8;">Add:</span> ${data.address}</div>` : ''}
          </td>
        </tr>
        <tr>
          <td>
            ${renderSocialsRow()}
            ${renderCtaButton()}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      ${renderDisclaimer()}
    </td>
  </tr>
</table>
`.trim();
  }

  // 3. TEMPLATE: MINIMAL CLEAN
  if (templateId === 'minimal_clean') {
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${font}; font-size: 13px; line-height: 19px; color: #334155;">
  <tr>
    <td>
      <span style="font-size: 15px; font-weight: bold; color: #0f172a;">${data.full_name || 'Your Name'}</span>
      ${data.job_title ? `<span style="color: ${primaryColor}; font-weight: 600;"> &bull; ${data.job_title}</span>` : ''}
      ${data.company ? `<span style="color: #64748b;"> at <strong>${data.company}</strong></span>` : ''}
    </td>
  </tr>
  <tr>
    <td style="padding-top: 4px; font-size: 12px; color: #64748b;">
      ${data.email ? `<a href="mailto:${data.email}" style="color: #64748b; text-decoration: none;">${data.email}</a>` : ''}
      ${data.phone ? ` &bull; <a href="tel:${data.phone}" style="color: #64748b; text-decoration: none;">${data.phone}</a>` : ''}
      ${data.website ? ` &bull; <a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: ${primaryColor}; font-weight: 600; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a>` : ''}
    </td>
  </tr>
  ${data.logo_url ? `
  <tr>
    <td style="padding-top: 8px;">
      <img src="${data.logo_url}" alt="${data.company || 'Logo'}" height="24" style="max-height: 24px; display: block; border: 0;" />
    </td>
  </tr>
  ` : ''}
  <tr>
    <td>
      ${renderSocialsRow()}
      ${renderCtaButton()}
      ${renderDisclaimer()}
    </td>
  </tr>
</table>
`.trim();
  }

  // 4. TEMPLATE: BRANDED CARD
  if (templateId === 'branded_card') {
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${font}; font-size: 13px; line-height: 18px; max-width: 480px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; padding: 14px;">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align: middle;">
            ${data.logo_url ? `
              <img src="${data.logo_url}" alt="${data.company || 'Logo'}" height="28" style="max-height: 28px; display: block; border: 0;" />
            ` : `<div style="font-size: 16px; font-weight: 800; color: ${primaryColor};">${data.company || 'Company'}</div>`}
          </td>
          <td style="text-align: right; vertical-align: middle;">
            ${data.avatar_url ? `
              <img src="${data.avatar_url}" alt="${data.full_name}" width="44" height="44" style="display: inline-block; width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid ${primaryColor};" />
            ` : ''}
          </td>
        </tr>
      </table>

      <div style="height: 1px; background-color: #e2e8f0; margin: 10px 0;"></div>

      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <div style="font-size: 15px; font-weight: bold; color: #0f172a;">${data.full_name || 'Your Name'}</div>
            <div style="font-size: 12px; color: ${primaryColor}; font-weight: 600;">${data.job_title} ${data.department ? `&bull; ${data.department}` : ''}</div>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 8px; font-size: 12px; color: #475569;">
            ${data.email ? `<div><strong style="color: #64748b;">Email:</strong> <a href="mailto:${data.email}" style="color: #0f172a; text-decoration: none;">${data.email}</a></div>` : ''}
            ${data.phone ? `<div><strong style="color: #64748b;">Phone:</strong> <a href="tel:${data.phone}" style="color: #0f172a; text-decoration: none;">${data.phone}</a></div>` : ''}
            ${data.address ? `<div><strong style="color: #64748b;">Office:</strong> ${data.address}</div>` : ''}
          </td>
        </tr>
      </table>

      ${renderSocialsRow()}
      ${renderCtaButton()}
      ${renderDisclaimer()}
    </td>
  </tr>
</table>
`.trim();
  }

  // 5. TEMPLATE: COMPACT PRO
  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${font}; font-size: 12px; line-height: 16px; color: #334155;">
  <tr>
    <td style="padding-bottom: 4px;">
      <strong style="font-size: 14px; color: #0f172a;">${data.full_name || 'Your Name'}</strong>
      ${data.job_title ? `<span style="color: ${primaryColor};"> | ${data.job_title}</span>` : ''}
      ${data.company ? `<span style="color: #64748b;"> | ${data.company}</span>` : ''}
    </td>
  </tr>
  <tr>
    <td style="color: #64748b; font-size: 11px;">
      ${data.phone ? `Tel: ${data.phone} &bull; ` : ''}
      ${data.email ? `Email: <a href="mailto:${data.email}" style="color: #64748b; text-decoration: none;">${data.email}</a> &bull; ` : ''}
      ${data.website ? `<a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">${data.website.replace(/^https?:\/\//, '')}</a>` : ''}
    </td>
  </tr>
  ${data.logo_url ? `
  <tr>
    <td style="padding-top: 6px;">
      <img src="${data.logo_url}" alt="Logo" height="20" style="max-height: 20px; display: block;" />
    </td>
  </tr>
  ` : ''}
  <tr>
    <td>
      ${renderSocialsRow()}
      ${renderDisclaimer()}
    </td>
  </tr>
</table>
`.trim();
};
