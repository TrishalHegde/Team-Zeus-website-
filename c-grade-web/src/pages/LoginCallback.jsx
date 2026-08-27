import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      setError('No authorization code found. Please try logging in again.');
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await api.get(`/api/auth/github/callback?code=${code}`);
        const { token, user } = response.data;

        // Store the token and user in AuthContext (and localStorage)
        login(token, user);

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Login failed:', err);
        setError('Failed to sign in with GitHub. Please try again.');
      }
    };

    exchangeCode();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-red-500/30 p-8 rounded-2xl shadow-2xl text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Login Failed</h2>
          <p className="text-slate-400 mb-6 text-sm">{error}</p>
          <a
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition-all"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-300 text-sm">Signing you in with GitHub...</p>
      </div>
    </div>
  );
};

export default LoginCallback;
