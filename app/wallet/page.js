'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function WalletPage() {
  const [profile, setProfile] = useState(null)
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [secretId, setSecretId] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Demo user ID placeholder - bind to auth user session
  const userId = "YOUR_SUPABASE_USER_ID"

  useEffect(() => {
    async function fetchProfile() {
      if (userId === "YOUR_SUPABASE_USER_ID") return
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (data) setProfile(data)
    }
    fetchProfile()
  }, [])

  const handleDeposit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('Submitting deposit request...')

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          amount: Number(amount),
          phone_number: phone,
          secret_id: secretId
        })
      })
      const data = await res.json()
      if (data.error) setMsg(`Error: ${data.error}`)
      else {
        setMsg('Deposit request sent! Pending Admin approval.')
        setAmount('')
      }
    } catch (err) {
      setMsg('Failed to submit request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-green-500 mb-6 text-center">My Wallets</h1>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-gray-900 border border-green-500/30 p-3 rounded-xl text-center">
          <p className="text-[10px] text-gray-400">G-Wallet</p>
          <p className="text-sm font-bold text-green-400">{profile ? profile.g_wallet : '0'} UGX</p>
        </div>
        <div className="bg-gray-900 border border-blue-500/30 p-3 rounded-xl text-center">
          <p className="text-[10px] text-gray-400">M-Wallet</p>
          <p className="text-sm font-bold text-blue-400">{profile ? profile.m_wallet : '0'} UGX</p>
        </div>
        <div className="bg-gray-900 border border-purple-500/30 p-3 rounded-xl text-center">
          <p className="text-[10px] text-gray-400">P2P Wallet</p>
          <p className="text-sm font-bold text-purple-400">{profile ? profile.p2p_wallet : '0'} UGX</p>
        </div>
      </div>

      {/* Deposit Form */}
      <form onSubmit={handleDeposit} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4">Deposit UGX (Mobile Money)</h2>

        <label className="block text-xs text-gray-400 mb-1">Amount (Min 5,000 UGX)</label>
        <input
          type="number"
          placeholder="e.g. 10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
        />

        <label className="block text-xs text-gray-400 mb-1">MTN / Airtel Phone Number</label>
        <input
          type="text"
          placeholder="0770000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Secret ID / Reference</label>
        <input
          type="text"
          placeholder="Enter Secret ID"
          value={secretId}
          onChange={(e) => setSecretId(e.target.value)}
          required
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-extrabold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'SUBMIT DEPOSIT'}
        </button>

        {msg && <p className="mt-3 text-xs text-center text-gray-300 bg-gray-800 p-2 rounded-lg">{msg}</p>}
      </form>
    </main>
  )
}
