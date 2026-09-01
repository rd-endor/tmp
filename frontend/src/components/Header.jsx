import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, LogIn, LogOut, FolderHeart, ShieldCheck, CreditCard } from 'lucide-react';

export const Header = ({ onOpenAuth, onOpenSaved, onOpenBilling, savedCount }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Email Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">Studio</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Generate high-converting email signatures in seconds</p>
          </div>
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* My Signatures */}
              <button
                onClick={onOpenSaved}
                className="relative inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              >
                <FolderHeart className="w-4 h-4 text-brand-400" />
                <span>My Signatures</span>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-bold border border-brand-500/30">
                    {savedCount}
                  </span>
                )}
              </button>

              {/* Billing & Cards */}
              <button
                onClick={onOpenBilling}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
                title="Manage tokenized credit cards"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Cards & Vault</span>
              </button>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300 text-xs font-bold uppercase">
                    {user.username.slice(0, 2)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-slate-200">{user.username}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
