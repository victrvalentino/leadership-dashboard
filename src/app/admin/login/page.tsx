'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  BarChart3,
  Target,
  History,
} from 'lucide-react'

const FEATURES = [
  { icon: BarChart3, text: 'Real-time intelligence across the full employee lifecycle' },
  { icon: Target, text: 'Leadership signals that point straight to what needs action' },
  { icon: History, text: 'Full version history — see exactly what changed, and when' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  const handleForgotPassword = async () => {
    setError('')
    setInfo('')

    if (!email) {
      setError(
        'Please enter your email address above first, then click Forgot Password.'
      )
      return
    }

    setSendingReset(true)

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

    setSendingReset(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setInfo(
      `Password recovery email sent to ${email}. Check your inbox (and spam folder) and follow the link to set a new password.`
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('Failed to fetch authenticated user')
      setLoading(false)
      return
    }

    const { data: profile, error: roleError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (roleError || !profile) {
      setError('User role not found')
      setLoading(false)
      return
    }

    if (!profile.is_active) {
      setError('Account inactive')
      setLoading(false)
      return
    }

    document.cookie =
      'sb-auth-token=authenticated; path=/; SameSite=Lax'

    document.cookie =
      `user-role=${profile.role}; path=/; SameSite=Lax`

    document.cookie =
      `user-name=${encodeURIComponent(
        profile.full_name
      )}; path=/; SameSite=Lax`

    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div
        className="hidden md:flex md:w-[46%] lg:w-[42%] flex-col justify-center px-14 lg:px-16 py-16 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #0D1B4B 0%, #14275f 55%, #1565C0 130%)' }}
      >
        <div className="relative z-10">
          <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-blue-200 mb-3">
            People Experience Directorate
          </p>
          <h1 className="text-4xl lg:text-[44px] leading-[1.08] font-extrabold tracking-tight">
            One Leadership
            <br />
            Dashboard
          </h1>
          <p className="text-blue-100/90 text-[15px] leading-relaxed mt-5 max-w-sm font-medium">
            Workforce analytics and leadership intelligence — everything
            you need to lead with clarity, in one place.
          </p>

          <div className="mt-10 space-y-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 shadow-sm backdrop-blur-sm">
                  <f.icon className="w-[18px] h-[18px] text-blue-100" strokeWidth={1.75} />
                </div>
                <p className="text-[13.5px] text-blue-50/95 font-semibold leading-snug">
                  {f.text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-blue-200/70 text-[13px] italic leading-relaxed mt-14 max-w-xs">
            &ldquo;The clearest picture of workforce health, updated the moment
            leadership needs it.&rdquo;
          </p>
        </div>

        {/* subtle decorative glow */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 bg-white">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 text-sm font-medium mt-1.5 mb-8">
            Sign in with your work email to continue.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-[18px] h-[18px] text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-[#1565C0] transition-shadow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={sendingReset}
                  className="text-xs font-bold text-[#1565C0] hover:text-[#0D1B4B] disabled:text-gray-400 transition-colors"
                >
                  {sendingReset ? 'Sending…' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-[18px] h-[18px] text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-[#1565C0] transition-shadow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            {info && (
              <p className="text-emerald-700 text-sm font-medium bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2.5">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-xl font-bold text-sm shadow-badge hover:shadow-elevated disabled:opacity-60 disabled:shadow-none transition-all"
              style={{ backgroundColor: '#0D1B4B' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}