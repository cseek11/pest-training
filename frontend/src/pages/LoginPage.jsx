import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // 'login' | 'request' | 'reset'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const from = (location.state && location.state.from) || '/admin';

  useEffect(() => {
    // If Supabase redirected here with a recovery token, switch to reset mode
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setMode('reset');
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
      }
    });
    return () => listener.subscription?.unsubscribe?.();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.session) {
        navigate(from, { replace: true });
      } else {
        setError('Unexpected error: No session returned.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestReset(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/login`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setMessage('If an account exists for that email, a reset link has been sent.');
      setMode('login');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      if (data?.user) {
        setMessage('Password updated successfully. Signing you in…');
        // After successful reset, navigate to admin (session should already be established by recovery)
        setTimeout(() => navigate('/admin', { replace: true }), 600);
      } else {
        setError('Unexpected error: No user returned.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">
          {mode === 'reset' ? 'Set New Password' : mode === 'request' ? 'Password Reset' : 'Login'}
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          {mode === 'reset'
            ? 'Enter a new password for your account.'
            : mode === 'request'
            ? 'Enter your email to receive a password reset link.'
            : 'Sign in with your admin credentials.'}
        </p>

        {message && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{message}</div>}
        {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#4db848]"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#4db848]"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-[#4db848] text-white font-semibold hover:bg-[#399a38] transition disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <button type="button" className="text-sm text-[#1A4D8F] hover:underline" onClick={() => setMode('request')}>
                Forgot password?
              </button>
            </div>
          </form>
        )}

        {mode === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#4db848]"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-[#4db848] text-white font-semibold hover:bg-[#399a38] transition disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
              <button type="button" className="text-sm text-gray-700 hover:underline" onClick={() => setMode('login')}>
                Back to login
              </button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#4db848]"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#4db848]"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-[#4db848] text-white font-semibold hover:bg-[#399a38] transition disabled:opacity-60"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
              <button type="button" className="text-sm text-gray-700 hover:underline" onClick={() => setMode('login')}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="text-xs text-gray-500 mt-4 text-center">
          <p>
            <Link to="/" className="text-[#1A4D8F] hover:underline">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
