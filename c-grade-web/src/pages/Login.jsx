import React from 'react';
import { Github } from 'lucide-react';

const Login = () => {
  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login/callback`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user,repo`;
    
    // In local development, we might want to just mock login or redirect
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-600/20 rounded-full border border-indigo-500/30">
            <Github className="w-12 h-12 text-indigo-400" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          C-Grade Automator
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          Sign in with your GitHub account to access assignments, view grades, and check test feedback.
        </p>

        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Github className="w-5 h-5" />
          Sign in with GitHub
        </button>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-xs text-slate-500">
          <span>Trishal Organization</span>
          <span>&middot;</span>
          <span>Team Zeus Platform</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
