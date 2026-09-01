import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SignatureBuilder } from './components/SignatureBuilder/SignatureBuilder';
import { PreviewPane } from './components/PreviewPane';
import { AuthModal } from './components/AuthModal';
import { SavedSignaturesModal } from './components/SavedSignaturesModal';
import { BillingModal } from './components/BillingModal';
import { DEFAULT_SIGNATURE } from './types/defaults';
import { signaturesApi } from './api/client';
import { useAuth } from './context/AuthContext';
import { Sparkles, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const { user } = useAuth();
  const [signature, setSignature] = useState(DEFAULT_SIGNATURE);
  const [activeSignatureId, setActiveSignatureId] = useState(null);
  const [savedSignaturesCount, setSavedSignaturesCount] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast message
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch count of saved signatures when user is logged in
  const refreshSavedCount = async () => {
    if (user) {
      try {
        const list = await signaturesApi.list();
        setSavedSignaturesCount(list.length);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSavedSignaturesCount(0);
    }
  };

  useEffect(() => {
    refreshSavedCount();
  }, [user]);

  // Handle Save signature
  const handleSave = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...signature,
        title: signature.title || `${signature.full_name || 'My'} Signature`,
      };

      if (activeSignatureId) {
        await signaturesApi.update(activeSignatureId, payload);
        showToast('Signature updated successfully!');
      } else {
        const created = await signaturesApi.create(payload);
        setActiveSignatureId(created.id);
        showToast('New signature saved to your account!');
      }
      refreshSavedCount();
    } catch (err) {
      console.error(err);
      showToast('Failed to save signature', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Load a saved signature into editor
  const handleLoadSignature = (sig) => {
    setSignature(sig);
    setActiveSignatureId(sig.id);
    showToast(`Loaded "${sig.title}" into editor`);
  };

  // Reset to new signature
  const handleNewSignature = () => {
    setSignature({
      ...DEFAULT_SIGNATURE,
      title: "New Signature",
      full_name: user ? user.username : "Your Name",
    });
    setActiveSignatureId(null);
    showToast('Created blank template');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold backdrop-blur-md animate-slideUp ${
          toastMessage.type === 'error'
            ? 'bg-red-950/90 border-red-500/30 text-red-300'
            : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenBilling={() => setIsBillingOpen(true)}
        savedCount={savedSignaturesCount}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Builder Controls */}
        <section className="lg:col-span-6 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Signature Configuration
              </span>
              {activeSignatureId && (
                <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30 font-medium">
                  Editing Saved #{activeSignatureId}
                </span>
              )}
            </div>

            <button
              onClick={handleNewSignature}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex-1">
            <SignatureBuilder signature={signature} onChange={setSignature} />
          </div>
        </section>

        {/* Right Side: Live Email Preview & Export */}
        <section className="lg:col-span-6 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Preview & One-Click Export
            </span>
          </div>

          <div className="flex-1">
            <PreviewPane
              signature={signature}
              onSave={handleSave}
              onOpenAuth={() => setIsAuthOpen(true)}
              isSaving={isSaving}
            />
          </div>
        </section>

      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          showToast('Signed in successfully!');
          refreshSavedCount();
        }}
      />

      <SavedSignaturesModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        onLoadSignature={handleLoadSignature}
        onNewSignature={handleNewSignature}
      />

      <BillingModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
      />

    </div>
  );
}

export default App;
