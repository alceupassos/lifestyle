'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShoppingBag } from 'lucide-react';

// Hardcoded credentials
const ADMIN_EMAIL = 'adm@angra.io';
const ADMIN_PASSWORD = 'Angra123#';
const AUTH_KEY = 'lifestyle_admin_auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, '1');
        router.push('/admin');
      } else {
        setError('Credenciais incorretas. Tente novamente.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--ls-bg)' }}>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
            style={{ background: 'var(--primary)' }}>
            <ShoppingBag size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-syne)' }}>
            LIFE STYLE Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'var(--font-manrope)' }}>
            Acesso restrito — equipe interna
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-manrope)' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="adm@angra.io"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-manrope)' }}>
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
                style={{ fontFamily: 'var(--font-manrope)' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--primary)', fontFamily: 'var(--font-manrope)' }}>
              {loading ? 'Verificando...' : 'Entrar no Painel'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: 'var(--font-manrope)' }}>
          LIFE STYLE no BRÁS © 2025 — Painel Administrativo
        </p>
      </div>
    </div>
  );
}
