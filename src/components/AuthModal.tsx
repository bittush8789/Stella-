import React, { useState, useRef } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Send
} from 'lucide-react';
import { authAndStorageService } from '../services/authAndStorageService';
import { User } from '../types/microservices';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup' | 'forgot_password';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98201 54321');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Profile image size must be under 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await authAndStorageService.signInWithGoogle(email ? email : undefined, name ? name : undefined);
      if (res.success && res.user) {
        setSuccessMessage('Welcome! Signed in with Google successfully.');
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 800);
      } else {
        throw new Error(res.message || 'Google sign-in failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'forgot_password') {
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }
        const res = await authAndStorageService.resetPasswordForEmail(email);
        if (res.success) {
          setSuccessMessage(res.message || 'Password reset link sent! Check your inbox.');
        } else {
          throw new Error(res.message || 'Failed to send reset link');
        }
      } else if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

        const res = await authAndStorageService.signUp({
          name,
          email,
          password,
          phone,
          avatarFile,
          role: 'customer'
        });

        if (res.success && res.user) {
          setSuccessMessage('Your Stella account has been created successfully!');
          setTimeout(() => {
            onAuthSuccess(res.user!);
            onClose();
          }, 1000);
        } else {
          throw new Error(res.message || 'Sign up failed');
        }
      } else {
        if (!email.trim()) throw new Error('Please enter your email address');

        const res = await authAndStorageService.signIn(email, password || 'password123');
        if (res.success && res.user) {
          setSuccessMessage('Signed in successfully!');
          setTimeout(() => {
            onAuthSuccess(res.user!);
            onClose();
          }, 800);
        } else {
          throw new Error(res.message || 'Sign in failed');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (userEmail: string, userName: string) => {
    setEmail(userEmail);
    setPassword('demo123');
    setIsLoading(true);
    const res = await authAndStorageService.signIn(userEmail, 'demo123');
    setIsLoading(false);
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold shadow-xs">
              s
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {mode === 'signin'
                  ? 'Welcome Back to Stella'
                  : mode === 'signup'
                  ? 'Create Your Stella Account'
                  : 'Reset Password'}
              </h2>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                100% Secure & Encrypted Account
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle (Shown in signin / signup) */}
        {mode !== 'forgot_password' ? (
          <div className="flex border-b border-slate-100 p-2 bg-slate-50/50">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register / New Customer
            </button>
          </div>
        ) : (
          <div className="px-6 pt-4">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google / Gmail Sign In Button */}
          {mode !== 'forgot_password' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                {/* Official 4-color Google 'G' icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>
                  {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google / Gmail'}
                </span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white px-2">or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot_password' && (
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-[11px] leading-relaxed">
                  Enter your registered email address and we'll send you a secure link to reset your password.
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Recovery Link...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Password Reset Link
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SIGN UP ONLY: Avatar Upload */}
            {mode === 'signup' && (
              <div className="flex flex-col items-center justify-center pb-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 hover:border-teal-500 flex items-center justify-center cursor-pointer overflow-hidden group transition-all"
                  title="Upload profile picture"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400 group-hover:text-teal-600">
                      <Camera className="w-6 h-6 mx-auto mb-0.5" />
                      <span className="text-[9px] font-semibold block leading-tight">Add Photo</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                    Change
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1.5">
                  JPG or PNG up to 5MB
                </span>
              </div>
            )}

            {/* SIGN UP ONLY: Full Name */}
            {mode === 'signup' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Email Address (For Sign In and Sign Up) */}
            {mode !== 'forgot_password' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* SIGN UP ONLY: Mobile Phone Number */}
            {mode === 'signup' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (India)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98201 54321"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Password (For Sign In and Sign Up) */}
            {mode !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot_password');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button (For Sign In and Sign Up) */}
            {mode !== 'forgot_password' && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Stella Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </form>

          {/* Quick Demo Logins for Shoppers */}
          {mode !== 'forgot_password' && (
            <div className="pt-6 mt-6 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2 text-center">
                Quick Demo Customer Login
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('bittush9534@gmail.com', 'Bittu Kumar')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-800 block text-[11px] truncate">Bittu Kumar</span>
                  <span className="text-[10px] text-teal-600 font-medium">Customer (Gmail)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('rahul.sharma@example.com', 'Rahul Sharma')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-100 text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-800 block text-[11px] truncate">Rahul Sharma</span>
                  <span className="text-[10px] text-slate-500 font-medium">Customer (Mumbai)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
