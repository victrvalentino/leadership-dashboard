'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-400 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}