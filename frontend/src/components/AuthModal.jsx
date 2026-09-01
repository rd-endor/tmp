import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, User, Mail, Sparkles, AlertCircle, ArrowRight, Loader2, Check, ShieldCheck } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\/`~]/.test(password);

  const passedRulesCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordStrong = passedRulesCount === 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLogin && !isPasswordStrong) {
      setErrorMessage('Please satisfy all strong password requirements before creating your account.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        if (!email) {
          throw new Error('Email is required for sign up');
        }
        await signup(username, email, password);
      }
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Authentication error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin 
              ? 'Sign in to save, edit, and access your email signatures' 
              : 'Sign up with a username and password to store your signatures'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username {isLogin ? 'or Email' : ''}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isLogin ? 'username or user@email.com' : 'Choose a username'}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Strong Password Rules & Strength Meter (Shown on Sign Up) */}
          {!isLogin && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Password Strength:
                </span>
                <span className={`font-bold ${
                  passedRulesCount === 5 ? 'text-emerald-400' : passedRulesCount >= 3 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {passedRulesCount === 5 ? 'Strong' : passedRulesCount >= 3 ? 'Medium' : 'Weak'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 rounded-full transition-all ${passedRulesCount >= 1 ? (passedRulesCount === 5 ? 'bg-emerald-500' : passedRulesCount >= 3 ? 'bg-amber-500' : 'bg-red-500') : 'bg-transparent'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${passedRulesCount >= 2 ? (passedRulesCount === 5 ? 'bg-emerald-500' : passedRulesCount >= 3 ? 'bg-amber-500' : 'bg-red-500') : 'bg-transparent'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${passedRulesCount >= 3 ? (passedRulesCount === 5 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${passedRulesCount >= 4 ? (passedRulesCount === 5 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${passedRulesCount === 5 ? 'bg-emerald-500' : 'bg-transparent'}`} />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className={`w-3 h-3 ${hasMinLength ? 'opacity-100' : 'opacity-30'}`} />
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className={`w-3 h-3 ${hasUpper ? 'opacity-100' : 'opacity-30'}`} />
                  <span>1+ Uppercase (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className={`w-3 h-3 ${hasLower ? 'opacity-100' : 'opacity-30'}`} />
                  <span>1+ Lowercase (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className={`w-3 h-3 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                  <span>1+ Number (0-9)</span>
                </div>
                <div className={`col-span-2 flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className={`w-3 h-3 ${hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                  <span>1+ Special character (!@#$%^&*)</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (!isLogin && !isPasswordStrong)}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Account' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
