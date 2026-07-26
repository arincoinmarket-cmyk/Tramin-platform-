'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('arincoinmarket@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('Authenticating...')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMsg(`Login Error: ${error.message}`)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .single()

    if (profile?.is_admin) {
      setMsg('Admin Login Successful! Redirecting...')
      router.push('/admin/deposits')
    } else {
      setMsg('Login Successful! Redirecting...')
      router.push('/')
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 max-w-md mx-auto flex flex-col justify-center">
      <form onSubmit={handleLogin} className="bg-gray-900 border border-yellow-500/30 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-yellow-500 mb-1 text-center">Tramin Sign In</h1>
        <p className="text-xs text-gray-400 mb-6 text-center">Enter your email and password</p>

        <label className="block text-xs text-gray-400 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="arincoinmarket@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'SIGN IN'}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="text-green-500 hover:underline font-bold">
            Sign Up
          </Link>
        </p>

        {msg && <p className="mt-4 text-xs text-center text-gray-300 bg-gray-800 p-2 rounded-lg">{msg}</p>}
      </form>
    </main>
  )
}
