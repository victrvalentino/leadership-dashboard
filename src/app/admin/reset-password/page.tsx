'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // When the user arrives from the recovery email, supabase-js
    // exchanges the link for a temporary session automatically.
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) setReady(true)
      setChecking(false)
    }

    const { data: sub } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
          setReady(true)
          setChecking(false)
        }
      }
    )

    check()

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error: updateError } =
      await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    // End the temporary recovery session so the user signs in
    // fresh with their new password.
    await supabase.auth.signOut()

    for (const name of ['sb-auth-token', 'user-role', 'user-name']) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }

    setDone(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-center mb-3 leading-tight">
          Reset Password
        </h1>

        {checking && (
          <p className="text-gray-500 text-center">
            Verifying your recovery link...
          </p>
        )}

        {!checking && !ready && !done && (
          <div className="text-center space-y-6">
            <p className="text-gray-500 leading-relaxed">
              This recovery link is invalid or has expired. Please
              request a new one from the login page.
            </p>

            <a
              href="/admin/login"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800"
            >
              Back to Login
            </a>
          </div>
        )}

        {!checking && ready && !done && (
          <>
            <p className="text-gray-500 text-center mb-8 leading-relaxed">
              Enter your new password below
            </p>

            <form onSubmit={handleReset} className="space-y-5">
              <input
                type="password"
                placeholder="New password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}

        {done && (
          <div className="text-center space-y-6">
            <p className="text-green-600 font-semibold">
              Your password has been updated successfully.
            </p>

            <a
              href="/admin/login"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800"
            >
              Sign In with New Password
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
