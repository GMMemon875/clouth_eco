import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  redirectTo?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, redirectTo = '/account' }) => {
  const { loginCustomer } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    try {
      await loginCustomer(email, password);
      onNavigate(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="customer-login-page" className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Welcome Back</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Customer Sign In</h1>
          <p className="text-xs text-stone-500">Access your orders, saved addresses, and express checkout.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8b3a42] hover:bg-[#6b232a] text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center space-y-2">
          <p className="text-xs text-stone-600">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="text-[#8b3a42] font-semibold hover:underline"
            >
              Create Account
            </button>
          </p>
          <p className="text-[11px] text-stone-400">
            Looking for an order placed as a guest?{' '}
            <button
              onClick={() => onNavigate('/track-order')}
              className="text-stone-600 font-medium underline"
            >
              Track Order
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
