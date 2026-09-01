import React, { useState, useRef } from 'react';
import { generateSignatureHtml } from '../templates/templateGenerators';
import { useAuth } from '../context/AuthContext';
import { 
  Copy, 
  Check, 
  Code, 
  Download, 
  Save, 
  Mail, 
  Sparkles, 
  Monitor, 
  Smartphone, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const PreviewPane = ({ signature, onSave, onOpenAuth, isSaving }) => {
  const { user } = useAuth();
  const [copiedRich, setCopiedRich] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop | mobile
  const [activeClient, setActiveClient] = useState('gmail'); // gmail | outlook
  const previewRef = useRef(null);

  const signatureHtml = generateSignatureHtml(signature);

  // Copy rendered rich HTML to clipboard so user can directly Paste (Cmd+V / Ctrl+V) into Gmail/Outlook
  const handleCopyRichText = async () => {
    try {
      if (previewRef.current) {
        const blobHtml = new Blob([signatureHtml], { type: 'text/html' });
        const blobPlain = new Blob([previewRef.current.innerText], { type: 'text/plain' });
        
        const data = [
          new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobPlain,
          }),
        ];
        
        await navigator.clipboard.write(data);
        setCopiedRich(true);
        setTimeout(() => setCopiedRich(false), 3000);
      }
    } catch (err) {
      console.warn('ClipboardItem API fallback', err);
      // Fallback: select text in preview
      const range = document.createRange();
      range.selectNode(previewRef.current);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      setCopiedRich(true);
      setTimeout(() => setCopiedRich(false), 3000);
    }
  };

  // Copy raw HTML source
  const handleCopyHtmlCode = async () => {
    try {
      await navigator.clipboard.writeText(signatureHtml);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Download HTML file
  const handleDownloadHtml = () => {
    const element = document.createElement('a');
    const file = new Blob([signatureHtml], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${(signature.full_name || 'signature').toLowerCase().replace(/\s+/g, '-')}-email-signature.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      
      {/* Top Action Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveClient('gmail')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeClient === 'gmail' 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gmail Preview
            </button>
            <button
              onClick={() => setActiveClient('outlook')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeClient === 'outlook' 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Outlook Preview
            </button>
          </div>

          <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded-lg transition-all ${
                previewMode === 'desktop' ? 'bg-slate-800 text-brand-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded-lg transition-all ${
                previewMode === 'mobile' ? 'bg-slate-800 text-brand-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Save button */}
        {user ? (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Save className="w-3.5 h-3.5 text-brand-400" />
            <span>{isSaving ? 'Saving...' : 'Save Signature'}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
            title="Sign in to save signature"
          >
            <Lock className="w-3 h-3 text-brand-400" />
            <span>Sign in to save</span>
          </button>
        )}
      </div>

      {/* Simulated Email Composer Window */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-950/40 flex items-center justify-center">
        <div 
          className={`w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 transition-all ${
            previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
          }`}
        >
          {/* Email Header Mockup */}
          <div className={`px-4 py-3 border-b flex items-center justify-between text-xs ${
            activeClient === 'gmail' ? 'bg-red-50/50 border-slate-200 text-slate-600' : 'bg-blue-50/50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${activeClient === 'gmail' ? 'bg-red-500' : 'bg-blue-600'}`}></span>
              <span>New Message ({activeClient === 'gmail' ? 'Google Mail' : 'Microsoft Outlook'})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <span>To: client@company.com</span>
            </div>
          </div>

          <div className="px-5 py-3 border-b border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-400">Subject:</span>
            <span className="text-slate-700 font-medium">Proposal & Security Review - Endor Labs</span>
          </div>

          {/* Email Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>Hi Team,</p>
              <p>
                Thanks for your time earlier today. Please review the updated documentation and feel free to reach out if you have any questions.
              </p>
              <p>Best regards,</p>
            </div>

            {/* LIVE SIGNATURE PREVIEW CONTAINER */}
            <div className="pt-3 border-t border-slate-100">
              <div 
                ref={previewRef}
                className="overflow-x-auto py-1"
                dangerouslySetInnerHTML={{ __html: signatureHtml }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Export & Copy Controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Main Copy Button */}
          <button
            onClick={handleCopyRichText}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer ${
              copiedRich
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white shadow-brand-500/25 active:scale-95'
            }`}
          >
            {copiedRich ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Rich Signature</span>
              </>
            )}
          </button>

          {/* Copy HTML Source */}
          <button
            onClick={handleCopyHtmlCode}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              copiedCode
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Copy Raw HTML code"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5 text-brand-400" />}
            <span className="hidden sm:inline">Copy HTML</span>
          </button>

          {/* Download HTML File */}
          <button
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            title="Download signature as .html file"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Paste directly into Gmail, Outlook, or Apple Mail settings</span>
        </div>
      </div>

    </div>
  );
};
