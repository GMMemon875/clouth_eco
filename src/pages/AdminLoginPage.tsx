import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const { loginAdmin, requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);

    if (!forgotEmail.trim()) {
      setForgotMsg({ type: 'error', text: 'Please enter your administrator email.' });
      return;
    }

    setForgotLoading(true);
    try {
      const msg = await requestPasswordReset(forgotEmail.trim());
      setForgotMsg({
        type: 'success',
        text: msg || 'If this account exists, password reset instructions have been generated.',
      });
    } catch (err: any) {
      setForgotMsg({ type: 'error', text: err.message || 'Unable to request password reset.' });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div id="admin-login-screen" className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-stone-900 text-stone-100">
      <div className="w-full max-w-md bg-stone-950/80 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6 relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#8b3a42] to-amber-500" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-stone-700 mx-auto flex items-center justify-center text-amber-400 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Administrator Portal</h1>
          <p className="text-xs text-stone-400">
            Secure management console for Noor & Co. Luxury Pret
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@noorandco.pk"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder:text-stone-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-300">Password</label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotEmail(email);
                }}
                className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder:text-stone-600"
              />
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-800 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-stone-400 hover:text-stone-200 transition"
          >
            ← Return to Public Storefront
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-stone-900 border border-stone-700 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-stone-800 rounded-xl text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Reset Password</h3>
                <p className="text-[11px] text-stone-400">Enter your registered email address</p>
              </div>
            </div>

            {forgotMsg && (
              <div
                className={`p-3 rounded-xl flex items-start gap-2 text-xs ${
                  forgotMsg.type === 'success'
                    ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/70 border border-red-800 text-red-300'
                }`}
              >
                {forgotMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@noorandco.pk"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotMsg(null);
                  }}
                  className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold disabled:opacity-60"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
