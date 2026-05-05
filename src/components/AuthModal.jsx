import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuthModal } from '../lib/AuthContext.jsx';
import './AuthModal.css';

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function AuthModal() {
  const { modalOpen, closeModal } = useAuthModal();
  const [tab,      setTab]      = useState('signin');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState('');

  if (!modalOpen) return null;

  const reset = () => { setErr(''); setSuccess(''); setLoading(false); };

  const handleGoogleLogin = async () => {
    reset();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) { setErr(error.message); setLoading(false); }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    reset(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setLoading(false); }
    else closeModal();
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    reset(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) { setErr(error.message); }
    else { setSuccess('✅ Check your email to confirm your account!'); }
    setLoading(false);
  };

  return (
    <div className="auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="auth-modal">
        {/* Decorative top glow */}
        <div className="auth-modal__glow" aria-hidden="true" />

        <button className="auth-modal__close" onClick={closeModal} aria-label="Close login dialog">✕</button>

        {/* Header */}
        <div className="auth-modal__header">
          <div className="auth-modal__star">☽</div>
          <h2 id="auth-modal-title" className="auth-modal__title">
            {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="auth-modal__sub">
            {tab === 'signin'
              ? 'Sign in to access your cosmic journey'
              : 'Join to unlock free predictions & bookings'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-modal__tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'signin'} className={`auth-tab${tab === 'signin' ? ' auth-tab--active' : ''}`} onClick={() => { setTab('signin'); reset(); }}>Sign In</button>
          <button role="tab" aria-selected={tab === 'signup'} className={`auth-tab${tab === 'signup' ? ' auth-tab--active' : ''}`} onClick={() => { setTab('signup'); reset(); }}>Sign Up</button>
        </div>

        {/* Google OAuth */}
        <button className="auth-google-btn" onClick={handleGoogleLogin} disabled={loading} type="button">
          {GOOGLE_ICON}
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        {/* Email Form */}
        <form onSubmit={tab === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="auth-form">
          {tab === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <input id="auth-name" type="text" placeholder="Shree Ayush" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} />
          </div>

          {err     && <p className="auth-error">⚠ {err}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" className="btn-gold btn-gold-filled auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : tab === 'signin' ? '✨ Sign In' : '✨ Create Account'}
          </button>
        </form>

        <p className="auth-modal__footer">
          By continuing, you agree to our <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
