import React, { useState, useEffect } from 'react';
import type { UserProfile, GenderOption } from '../../types/user';
import { ShieldCheck, User, Sparkles } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
  canDismiss?: boolean;
  onClose?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onSave,
  initialProfile,
  canDismiss = false,
  onClose
}) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<string | number>('');
  const [gender, setGender] = useState<GenderOption>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.fullName || '');
      setAge(initialProfile.age || '');
      setGender(initialProfile.gender || '');
    }
  }, [initialProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    const profile: UserProfile = {
      fullName: fullName.trim(),
      age: age ? Number(age) : '',
      gender: gender || 'Prefer not to say',
      onboardingCompleted: true,
      createdAt: initialProfile?.createdAt || new Date().toISOString()
    };

    localStorage.setItem('deskcore_user_profile', JSON.stringify(profile));
    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-8 bg-dark-900/90 border border-slate-700/70 rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 mb-4 shadow-glow-cyan">
              <User className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              WELCOME TO NEUROPOSTURE OS
            </h1>
            <p className="text-sm text-slate-400">
              Set up your DeskCore monitoring profile.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="user-fullname" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <input
                id="user-fullname"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Alex Morgan"
                required
                className="w-full px-4 py-3 bg-dark-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user-age" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Age
                </label>
                <input
                  id="user-age"
                  type="number"
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full px-4 py-3 bg-dark-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              <div>
                <label htmlFor="user-gender" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Gender
                </label>
                <select
                  id="user-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderOption)}
                  className="w-full px-4 py-3 bg-dark-950/60 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                >
                  <option value="" disabled className="bg-dark-900 text-slate-400">Select Gender</option>
                  <option value="Male" className="bg-dark-900">Male</option>
                  <option value="Female" className="bg-dark-900">Female</option>
                  <option value="Other" className="bg-dark-900">Other</option>
                  <option value="Prefer not to say" className="bg-dark-900">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Your profile remains stored locally on your device for session greetings and privacy.</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              {canDismiss && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-medium text-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                id="btn-continue-deskcore"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-glow-cyan transition flex items-center justify-center gap-2"
              >
                <span>CONTINUE TO DESKCORE</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
