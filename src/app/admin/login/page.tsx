'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-center mb-3 leading-tight">
          ESB Leadership
          <br />
          Intelligence Platform
        </h1>

        <p className="text-gray-500 text-center mb-8 leading-relaxed">
          Secure access for strategic workforce intelligence
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {info && (
            <p className="text-green-600 text-sm text-center">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-400 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={sendingReset}
            className="w-full text-sm text-indigo-700 hover:text-indigo-900 hover:underline font-medium disabled:text-gray-400"
          >
            {sendingReset
              ? 'Sending recovery email...'
              : 'Forgot Password?'}
          </button>
        </form>
      </div>
    </div>
  )
}