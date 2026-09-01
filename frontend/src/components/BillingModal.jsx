import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../api/client';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Check, 
  Star, 
  Loader2, 
  AlertCircle,
  Key
} from 'lucide-react';

export const BillingModal = ({ isOpen, onClose }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Card form state
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(''); // MM/YY
  const [cvv, setCvv] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const data = await paymentsApi.listMethods();
      setMethods(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMethods();
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  // Auto format card number with spaces (#### #### #### ####)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Auto format expiry (MM/YY)
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  // Card brand detection for visual badge
  const getCardBrand = (num) => {
    const clean = num.replace(/\D/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    if (/^(6011|65|64[4-9]|622)/.test(clean)) return 'discover';
    return 'generic';
  };

  const detectedBrand = getCardBrand(cardNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanCard = cardNumber.replace(/\D/g, '');
    if (cleanCard.length < 13) {
      setError('Please enter a valid credit card number');
      return;
    }

    const expParts = expiry.split('/');
    if (expParts.length !== 2) {
      setError('Please enter expiration as MM/YY');
      return;
    }

    const month = parseInt(expParts[0], 10);
    let year = parseInt(expParts[1], 10);
    if (year < 100) year += 2000;

    setIsSubmitting(true);
    try {
      await paymentsApi.tokenizeAndSave({
        cardholder_name: cardholderName,
        card_number: cleanCard,
        exp_month: month,
        exp_year: year,
        cvv: cvv,
        set_as_default: setAsDefault,
      });

      setSuccessMsg('Card successfully tokenized and saved to vault!');
      setCardholderName('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      fetchMethods();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to tokenize and save card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await paymentsApi.setDefaultMethod(id);
      fetchMethods();
    } catch (err) {
      alert('Failed to set default payment method');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this tokenized payment method?')) return;
    try {
      await paymentsApi.deleteMethod(id);
      setMethods(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Failed to remove card');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Payment Methods & Tokenization</h3>
              <p className="text-xs text-slate-400">Secure card vault & tokenized payment storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-400 text-xs">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Card Simulation Visual Preview */}
          <div className="relative mx-auto w-full max-w-sm h-48 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-brand-900 border border-slate-700/80 p-5 shadow-2xl shadow-brand-500/10 flex flex-col justify-between text-white overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 bg-brand-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-6 rounded bg-amber-400/80 border border-amber-300/60 shadow-inner flex items-center justify-center">
                  <div className="w-5 h-3 border border-amber-600/50 rounded-sm"></div>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Token Vault</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm border border-white/20">
                {detectedBrand}
              </span>
            </div>

            <div className="z-10 tracking-widest font-mono text-sm sm:text-base text-slate-100 drop-shadow">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div className="flex items-end justify-between text-xs z-10 font-mono">
              <div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">Card Holder</div>
                <div className="font-medium text-slate-200 uppercase truncate max-w-[170px]">
                  {cardholderName || 'FULL NAME'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">Expires</div>
                <div className="font-medium text-slate-200">{expiry || 'MM/YY'}</div>
              </div>
            </div>
          </div>

          {/* New Card Submission Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-400" /> Tokenize New Card
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> PCI-DSS Tokenized
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cardholder Name</label>
              <input
                type="text"
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 4242 4242 4242"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expiration (MM/YY)</label>
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="12/28"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CVV / CVC</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="setDefaultCheckbox"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="rounded border-slate-700 text-brand-500 focus:ring-brand-500 bg-slate-900"
              />
              <label htmlFor="setDefaultCheckbox" className="text-xs text-slate-400 cursor-pointer">
                Set as default payment method
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Tokenizing & Encrypting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Tokenize & Save Card</span>
                </>
              )}
            </button>
          </form>

          {/* Saved Payment Methods List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Saved Tokenized Cards ({methods.length})
            </h4>

            {loading ? (
              <div className="py-8 text-center text-slate-500 flex items-center justify-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                <span>Loading saved cards...</span>
              </div>
            ) : methods.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl p-4 text-xs text-slate-500">
                No credit cards tokenized yet. Use the form above to add a card.
              </div>
            ) : (
              <div className="space-y-2.5">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className="p-3.5 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold uppercase text-brand-300">
                        {method.brand.slice(0, 4)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>•••• •••• •••• {method.last4}</span>
                          {method.is_default && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>Expires {method.exp_month.toString().padStart(2, '0')}/{method.exp_year}</span>
                          <span>&bull;</span>
                          <span className="font-mono text-[10px] text-slate-500">{method.token.slice(0, 18)}...</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!method.is_default && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs flex items-center gap-1 transition-all"
                          title="Set as Default"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">Make Default</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
