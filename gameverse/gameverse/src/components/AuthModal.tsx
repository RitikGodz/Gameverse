import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Gamepad2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, login, signup } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');

  if (!showAuthModal) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (!email || !pw) { setErr('Please fill in all fields'); return; }
    if (authMode === 'signup' && !name) { setErr('Please enter your name'); return; }
    if (pw.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (authMode === 'signup') signup(name, email, pw); else login(email, pw);
    setName(''); setEmail(''); setPw('');
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAuthModal(false)} />
      <div className="relative w-full max-w-md glass-strong rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-6 pb-3 text-center">
          <button onClick={() => setShowAuthModal(false)} className="absolute top-3.5 right-3.5 p-2 rounded-lg text-t4 hover:text-t1 hover:bg-white/[.05]"><X className="w-4 h-4" /></button>
          <div className="w-12 h-12 rounded-2xl grad-btn grid place-items-center mx-auto mb-3 shadow-lg shadow-primary/25"><Gamepad2 className="w-6 h-6 text-white" /></div>
          <h2 className="font-head text-xl font-bold text-t1">{authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}</h2>
          <p className="text-[13px] text-t4 mt-0.5">{authMode === 'login' ? 'Sign in to your gaming profile' : authMode === 'signup' ? 'Join the GameVerse community' : 'We\'ll send you a reset link'}</p>
        </div>
        <form onSubmit={submit} className="p-6 pt-3 space-y-3.5">
          {err && <div className="p-2.5 rounded-xl bg-err/10 border border-err/20 text-err text-[13px]">{err}</div>}
          {authMode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t4" />
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-input border border-border text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t4" />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-input border border-border text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25" />
          </div>
          {authMode !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t4" />
              <input type={showPw ? 'text' : 'password'} placeholder="Password" value={pw} onChange={e => setPw(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-input border border-border text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-t4 hover:text-t1">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}
          {authMode === 'login' && (
            <div className="flex justify-end"><button type="button" onClick={() => setAuthMode('forgot')} className="text-[12px] text-primary hover:text-primary-hover">Forgot Password?</button></div>
          )}
          <button type="submit" className="w-full py-2.5 rounded-xl grad-btn text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-shadow">
            {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
          <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border" /><span className="text-[11px] text-t4">or</span><div className="flex-1 h-px bg-border" /></div>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl glass text-[13px] font-medium text-t3 hover:text-t1 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl glass text-[13px] font-medium text-t3 hover:text-t1 transition-colors">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
          <div className="text-center text-[13px] text-t4">
            {authMode === 'login' ? <>No account? <button type="button" onClick={() => setAuthMode('signup')} className="text-primary font-medium">Sign Up</button></> :
             authMode === 'signup' ? <>Have an account? <button type="button" onClick={() => setAuthMode('login')} className="text-primary font-medium">Sign In</button></> :
             <button type="button" onClick={() => setAuthMode('login')} className="text-primary font-medium">Back to Sign In</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
