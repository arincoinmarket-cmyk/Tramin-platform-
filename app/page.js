'use client'
import { useState } from 'react'

export default function Home() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  
  // Replace with your active Supabase User ID from Auth > Users
  const userId = "YOUR_SUPABASE_USER_ID" 

  const handleTrade = async (direction) => {
    if (!amount || amount < 1500) return setMsg('Min trade amount is 1500 UGX')
    setLoading(true)
    setMsg('Placing trade...')

    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, amount: Number(amount), direction })
      })
      const data = await res.json()
      if (data.error) setMsg(`Error: ${data.error}`)
      else setMsg(`Trade placed successfully! Status: ${data.trade.status}`)
    } catch (err) {
      setMsg('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-md mx-auto flex flex-col justify-center">
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-green-500 mb-1">Tramin Market</h1>
        <p className="text-xs text-gray-400 mb-6">30-Second High/Low Engine</p>

        <input 
          type="number"
          placeholder="Enter amount (Min 1500 UGX)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-xl text-white text-center font-bold focus:outline-none focus:border-green-500"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            onClick={() => handleTrade('UP')}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-extrabold py-3 rounded-xl transition disabled:opacity-50"
          >
            TRADE UP ⬆️
          </button>
          <button 
            onClick={() => handleTrade('DOWN')}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-black font-extrabold py-3 rounded-xl transition disabled:opacity-50"
          >
            TRADE DOWN ⬇️
          </button>
        </div>

        {msg && <p className="text-xs text-gray-300 bg-gray-800 p-2 rounded-lg">{msg}</p>}
      </div>
    </main>
  )
}
