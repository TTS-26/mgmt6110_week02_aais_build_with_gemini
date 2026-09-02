import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Zap, Star } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistCount: number;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, watchlistCount }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E0E3EB] overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-150 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0091ff] to-[#9700ff] flex items-center justify-center text-white mb-4 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-[22px] text-[#131722] tracking-tight">
              Get Started with TradingView
            </h3>
            <p className="text-[13px] text-[#737687] mt-1 mb-6">
              Access real-time global markets, save custom watchlists, and receive instant price breakout alerts.
            </p>

            <div className="space-y-2.5 mb-6 text-[13px] text-[#434656]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#089981]" />
                <span>Unlimited symbol lookups & chart intervals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#089981]" />
                <span>Synchronized custom watchlist ({watchlistCount} saved)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#089981]" />
                <span>Server-grade low latency ticker streaming</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#737687] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E0E3EB] focus:border-[#2962ff] focus:outline-none text-[14px] text-[#131722]"
                />
              </div>

              <button
                type="submit"
                className="w-full custom-gradient-btn text-white py-2.5 rounded-lg font-medium text-[14px] shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Continue with Email
              </button>
            </form>

            <p className="text-[11px] text-[#737687] text-center mt-4">
              By proceeding you accept the TradingView Terms of Use and Privacy Policy.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-[20px] text-[#131722]">
              Welcome Aboard!
            </h3>
            <p className="text-[13px] text-[#737687] mt-2 mb-6">
              We've connected your session for <strong>{email}</strong>. Your custom watchlist and preferences are active.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#131722] text-white text-[14px] font-medium hover:bg-[#2c303c] transition-colors"
            >
              Back to Markets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
