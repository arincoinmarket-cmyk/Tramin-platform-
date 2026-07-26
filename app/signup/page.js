'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('Creating account...')

    // 1. Create auth user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMsg(`Sign Up Error: ${error.message}`)
      setLoading(false)
      return
    }

    if (data?.user) {
      // 2. Insert corresponding profile row
      const secretId = `TRM-${Math.floor(10000 + Math.random() * 90000)}`
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            phone: phone,
            secret_id: secretId,
            g_wallet: 0,
            m_wallet: 0,
            p2p_wallet: 0,
            is_admin: false
          }
        ])

      if (profileError) {
        setMsg(`Profile setup error: ${profileError.message}`)
        setLoading(false)
        return
      }

      setMsg('Account created successfully! Redirecting...')
      setTimeout(() => router.push('/'), 1500)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 max-w-md mx-auto flex flex-col justify-center">
      <form onSubmit={handleSignUp} className="bg-gray-900 border border-green-500/30 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-green-500 mb-1 text-center">Create Account</h1>
        <p className="text-xs text-gray-400 mb-6 text-center">Sign up to get started on Tramin</p>

        <label className="block text-xs text-gray-400 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="yourname@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Phone Number (MTN / Airtel)</label>
        <input
          type="tel"
          placeholder="0770000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-extrabold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-500 hover:underline font-bold">
            Sign In
          </Link>
        </p>

        {msg && <p className="mt-4 text-xs text-center text-gray-300 bg-gray-800 p-2 rounded-lg">{msg}</p>}
      </form>
    </main>
  )
}
