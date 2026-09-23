import React, { useState } from 'react';
import { User, Mail, Phone, Lock, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Other / Nationwide',
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { registerCustomer } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Lahore',
    area: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^\d+]/g, '').trim();
    if (cleanPhone.length < 10) {
      setError('Please provide a valid Pakistani mobile number (e.g. 03001234567).');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    if (!formData.address.trim() || formData.address.length < 8) {
      setError('Please enter a full delivery address including street, plot/house number.');
      return;
    }

    setLoading(true);
    try {
      await registerCustomer(formData);
      onNavigate('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="customer-register-page" className="max-w-lg mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Join Noor & Co.</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Create an Account</h1>
          <p className="text-xs text-stone-500">
            Enjoy express checkout, view your order status, and track your couture deliveries.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="register-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ayesha Khan"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password (min 6 chars)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
              <select
                id="register-city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
              >
                {PAKISTANI_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Area / Sector (Optional)</label>
              <input
                id="register-area"
                name="area"
                type="text"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. DHA Phase 5, Gulberg III"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Complete Delivery Address (House / Plot, Street, Block)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <textarea
                id="register-address"
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="House # 12-B, Street 4, Sector Y, DHA"
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b3a42] focus:bg-white text-stone-900 resize-none"
              />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8b3a42] hover:bg-[#6b232a] text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="text-[#8b3a42] font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
