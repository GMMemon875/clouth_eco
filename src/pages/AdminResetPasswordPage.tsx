import React, { useState } from 'react';
import { KeyRound, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminResetPasswordPageProps {
  token: string;
  onNavigateToLogin: () => void;
}

export const AdminResetPasswordPage: React.FC<AdminResetPasswordPageProps> = ({
  token,
  onNavigateToLogin,
}) => {
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const msg = await resetPassword(token, newPassword, confirmPassword);
      setSuccess(msg || 'Password updated successfully. You may now log in.');
    } catch (err: any) {
      setError(err.message || 'Password reset failed. The link may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-reset-password-page" className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-900 text-stone-100">
      <div className="w-full max-w-md bg-stone-950/80 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-stone-700 mx-auto flex items-center justify-center text-amber-400 shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-xs text-stone-400">
            Create a secure new password for your administrator account
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-950/70 border border-emerald-800 rounded-xl flex flex-col items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span>{success}</span>
            </div>

            <button
              onClick={onNavigateToLogin}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Proceed to Admin Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                New Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder:text-stone-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder:text-stone-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
