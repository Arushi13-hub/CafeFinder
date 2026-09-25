import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Coffee, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    const userName = isSignUp 
      ? name.trim() 
      : (email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'Coffee Lover');
    
    // Capitalize words nicely
    const formattedName = userName
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const userProfile = {
      name: formattedName,
      email: email.trim(),
      avatarInitial: formattedName.charAt(0).toUpperCase(),
      memberSince: '2026',
    };

    setSuccessMsg(isSignUp ? 'Account created! Welcome to VibeCafe.' : 'Signed in successfully!');
    
    setTimeout(() => {
      onLoginSuccess(userProfile);
      handleClose();
    }, 350);
  };

  const handleGuestLogin = () => {
    setErrorMsg('');
    const guestUser = {
      name: 'Coffee Lover',
      email: 'user@example.com',
      avatarInitial: 'C',
      memberSince: '2026',
      isGuest: true,
    };
    setSuccessMsg('Signed in as Coffee Lover!');
    setTimeout(() => {
      onLoginSuccess(guestUser);
      handleClose();
    }, 300);
  };

  const handleSocialLogin = (provider) => {
    setErrorMsg('');
    const socialUser = {
      name: provider === 'Google' ? 'Alex Rivera' : 'Jordan Chen',
      email: provider === 'Google' ? 'alex.coffee@gmail.com' : 'jordan@icloud.com',
      avatarInitial: provider === 'Google' ? 'A' : 'J',
      memberSince: '2026',
      provider,
    };
    setSuccessMsg(`Signed in with ${provider}!`);
    setTimeout(() => {
      onLoginSuccess(socialUser);
      handleClose();
    }, 300);
  };

  return (
    <div 
      className={`bg-[#0A2947]/60 backdrop-blur-sm z-50 fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      {/* Modal Window: max-width 420px, rounded-3xl surface in #FAF7EE with border in #D3D4C0 */}
      <div 
        className={`w-full max-w-[420px] bg-[#FAF7EE] border border-[#D3D4C0] rounded-3xl p-6 sm:p-7 shadow-2xl relative transition-all duration-200 text-[#0A2947] max-h-[92vh] overflow-y-auto no-scrollbar ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-pop'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (✕) in the top-right corner */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#D3D4C0]/70 hover:border-[#8B5E3C] text-[#0A2947] hover:text-[#8B5E3C] flex items-center justify-center shadow-sm transition-all active:scale-90"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Refined coffee badge icon in #8B5E3C, title & subtitle */}
        <div className="mb-5 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 flex items-center justify-center text-[#8B5E3C] mb-3.5 shadow-sm">
            <Coffee className="w-6 h-6 stroke-[2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0A2947] leading-tight">
            {isSignUp ? 'Join VibeCafe' : 'Welcome to VibeCafe'}
          </h2>

          <p className="text-xs sm:text-[13px] text-[#0A2947]/70 font-normal leading-relaxed mt-1">
            Save your favorite roasteries, leave notes, and plan coffee walks.
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          
          {/* Full Name field (in Sign Up mode) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#0A2947]/70 font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A2947]/45" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-[#D3D4C0] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 rounded-xl text-xs sm:text-sm text-[#0A2947] placeholder-[#0A2947]/40 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address Input: clean pill-styled outline with mail icon */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#0A2947]/70 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A2947]/45" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@vibecafe.com"
                className="w-full h-11 pl-10 pr-3.5 bg-white border border-[#D3D4C0] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 rounded-xl text-xs sm:text-sm text-[#0A2947] placeholder-[#0A2947]/40 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input with Eye Toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#0A2947]/70 font-semibold">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="text-[11px] font-medium text-[#8B5E3C] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A2947]/45" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-11 pl-10 pr-10 bg-white border border-[#D3D4C0] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 rounded-xl text-xs sm:text-sm text-[#0A2947] placeholder-[#0A2947]/40 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0A2947]/50 hover:text-[#0A2947] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* "Remember me" Checkbox */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0A2947]/80 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#D3D4C0] text-[#8B5E3C] focus:ring-[#8B5E3C]/30 accent-[#8B5E3C]"
              />
              <span>Remember me</span>
            </label>
            <span className="text-[11px] font-mono text-[#0A2947]/50">
              Instant Session
            </span>
          </div>

          {/* Primary CTA: "Sign In / Continue" button in solid #8B5E3C */}
          <button
            type="submit"
            className="w-full bg-[#8B5E3C] hover:bg-[#724c30] text-white font-medium py-3 rounded-xl transition-all shadow-md active:scale-[0.98] text-xs sm:text-sm flex items-center justify-center gap-2 mt-2"
          >
            <span>{isSignUp ? 'Create Account & Continue' : 'Sign In / Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* One-Click Demo Mode / Guest Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F3E4C9] hover:bg-[#ebd8b7] text-[#0A2947] text-xs font-bold border border-[#D3D4C0] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>Continue as Coffee Lover (Guest)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D3D4C0]/80" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest text-[#0A2947]/50">
            <span className="bg-[#FAF7EE] px-2.5">or continue with</span>
          </div>
        </div>

        {/* Social Logins (Visual): Tasteful "Continue with Google" & "Continue with Apple" */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF7EE] border border-[#D3D4C0] hover:border-[#8B5E3C] text-xs font-semibold text-[#0A2947] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF7EE] border border-[#D3D4C0] hover:border-[#8B5E3C] text-xs font-semibold text-[#0A2947] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4 fill-current text-[#0A2947]" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.71-11.65-14.01-6.19-9.61-11.17-20.73-14.93-33.36-3.76-12.63-5.64-24.1-5.64-34.42 0-15.65 4.09-28.53 12.27-38.64 8.18-10.11 18.25-15.28 30.2-15.52 4.47 0 9.7 1.15 15.69 3.44 5.99 2.29 10.02 3.44 12.08 3.44 1.8 0 6.01-1.25 12.62-3.75 6.61-2.5 12.33-3.6 17.15-3.3 12.7.75 22.84 5.41 30.43 13.97-11.06 6.72-16.48 16.03-16.27 27.93.2 9.53 3.86 17.51 10.98 23.94 7.12 6.43 15.69 10.08 25.7 10.95-2.18 6.42-4.8 12.68-7.85 18.79zm-29.35-104.9c0-7.05 2.53-13.73 7.6-20.03 5.07-6.3 11.45-10.42 19.14-12.35 1.04 6.7 0 13.3-3.12 19.8-3.12 6.5-7.79 11.23-14.01 14.2-3.36 1.62-6.57 2.45-9.61 2.45-.6-.73-1-2.09-1-4.07z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Switch Mode: Small footer link */}
        <div className="mt-5 text-center">
          <p className="text-xs text-[#0A2947]/70">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="font-bold text-[#8B5E3C] hover:underline transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
