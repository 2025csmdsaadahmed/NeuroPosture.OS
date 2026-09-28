import React, { useState, useEffect } from 'react';
import type { UserProfile, GenderOption } from '../../types/user';
import { User, Sparkles, BrainCircuit, ChevronRight, LockKeyhole, MessageSquareQuote } from 'lucide-react';

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
      id: initialProfile?.id,
      fullName: fullName.trim(),
      age: age ? Number(age) : '',
      gender: gender || 'Prefer not to say',
      onboardingCompleted: true,
      createdAt: initialProfile?.createdAt || new Date().toISOString()
    };

    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.45),_rgba(2,6,23,0.95)_45%,_rgba(0,0,0,1)_100%)] backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,15,36,0.95),rgba(0,0,0,0.92),rgba(54,11,88,0.9))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(15,23,42,0.4),transparent_30%)]" />

      <div className="relative w-full max-w-[1500px] py-4 sm:py-8 lg:-translate-y-4">
        <h1 className="mb-9 text-center text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight">
          <span className="text-white">Welcome to </span>
          <span className="text-cyan-300">NeuroPosture</span>
          <span className="text-blue-400"> OS</span>
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(280px,1fr)_minmax(560px,680px)_minmax(280px,1fr)] gap-8 lg:gap-12 xl:gap-20 items-center">
          <aside className="hidden xl:flex xl:-translate-x-8 flex-col gap-8">
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                <MessageSquareQuote className="w-4 h-4" />
                Posture principle
              </div>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Good posture keeps your spine in a neutral stack, which makes long work blocks feel lighter and helps you stay focused longer.
              </p>
            </div>
            <div className="rounded-3xl border border-violet-500/20 bg-white/5 p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-violet-300">
                <BrainCircuit className="w-4 h-4" />
                Why sitting straight matters
              </div>
              <p className="mt-4 text-base leading-7 text-slate-200">
                A centered seat position reduces strain, supports breathing, and helps your body recover from repetitive desk habits before discomfort builds up.
              </p>
            </div>
          </aside>

          <div className="relative p-8 sm:p-12 lg:p-14 bg-dark-900/90 border border-slate-700/70 rounded-[2.25rem] shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="text-center mb-9">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 mb-5 shadow-glow-cyan">
                  <User className="w-8 h-8" />
                </div>
                <p className="text-base sm:text-lg text-slate-400 leading-7">
                  Sign in once and your profile will be remembered securely on this device so you can enter the command center quickly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="user-fullname" className="block text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
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
                    className="w-full px-4 py-4 text-base bg-dark-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="user-age" className="block text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
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
                      className="w-full px-4 py-4 text-base bg-dark-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="user-gender" className="block text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Gender
                    </label>
                    <select
                      id="user-gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as GenderOption)}
                      className="w-full px-4 py-4 text-base bg-dark-950/60 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    >
                      <option value="" disabled className="bg-dark-900 text-slate-400">Select Gender</option>
                      <option value="Male" className="bg-dark-900">Male</option>
                      <option value="Female" className="bg-dark-900">Female</option>
                      <option value="Other" className="bg-dark-900">Other</option>
                      <option value="Prefer not to say" className="bg-dark-900">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5 text-sm text-slate-400 leading-6">
                  <LockKeyhole className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Your profile is stored locally on this device and is used only to speed up future sign-ins and session analytics.</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  {canDismiss && onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-4 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-medium text-base"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    id="btn-continue-deskcore"
                    className="flex-1 py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base shadow-glow-cyan transition flex items-center justify-center gap-2"
                  >
                    <span>CONTINUE TO DESKCORE</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="hidden xl:flex xl:translate-x-8 flex-col gap-8">
            <div className="rounded-3xl border border-violet-500/20 bg-white/5 p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-violet-300">
                <BrainCircuit className="w-4 h-4" />
                Posture principle
              </div>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Straight sitting keeps your monitor posture honest. It is a small habit that helps reduce fatigue and keeps your attention on the work, not the ache.
              </p>
            </div>
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles className="w-4 h-4" />
                Fast access
              </div>
              <p className="mt-4 text-base leading-7 text-slate-200">
                After your first sign-in, the profile stays ready for seamless re-entry on this device so you can jump straight into the command center.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
