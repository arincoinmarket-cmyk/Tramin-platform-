'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function P2PPage() {
  const [orders, setOrders] = useState([])
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('100') // Default ARN price
  const [orderType, setOrderType] = useState('BUY')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Placeholder - bind to active user session
  const userId = "YOUR_SUPABASE_USER_ID"

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('p2p_orders')
      .select('*, profiles(email, secret_id)')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false })

    if (data) setOrders(data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('Posting P2P Order...')

    try {
      const res = await fetch('/api/p2p/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          type: orderType,
          amount: Number(amount),
          price_per_unit: Number(price)
        })
      })
      const data = await res.json()
      if (data.error) setMsg(`Error: ${data.error}`)
      else {
        setMsg('Order posted to Marketplace!')
        setAmount('')
        fetchOrders()
      }
    } catch (err) {
      setMsg('Failed to post order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-purple-500 mb-1 text-center">Arncoin P2P Market</h1>
      <p className="text-xs text-gray-400 mb-6 text-center">Buy & Sell ARN Tokens Directly</p>

      {/* Create Order Card */}
      <form onSubmit={handleCreateOrder} className="bg-gray-900 border border-purple-500/30 p-5 rounded-2xl mb-6">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setOrderType('BUY')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              orderType === 'BUY' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'
            }`}
          >
            CREATE BUY ORDER
          </button>
          <button
            type="button"
            onClick={() => setOrderType('SELL')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              orderType === 'SELL' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            CREATE SELL ORDER
          </button>
        </div>

        <label className="block text-xs text-gray-400 mb-1">ARN Token Amount</label>
        <input
          type="number"
          placeholder="e.g. 100 ARN"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Price Per ARN (UGX)</label>
        <input
          type="number"
          placeholder="100 UGX"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : `POST ${orderType} ORDER`}
        </button>

        {msg && <p className="mt-3 text-xs text-center text-gray-300 bg-gray-800 p-2 rounded-lg">{msg}</p>}
      </form>

      {/* Active Orders Section */}
      <h2 className="text-lg font-bold text-white mb-3">Live P2P Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-xs py-4 bg-gray-900 rounded-xl border border-gray-800">No active P2P orders available.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center text-xs">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mb-1 ${
                  o.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {o.type} ORDER
                </span>
                <p className="font-bold text-white">{o.amount} ARN @ {o.price_per_unit} UGX/ARN</p>
                <p className="text-gray-400 text-[10px]">Total: {o.amount * o.price_per_unit} UGX</p>
              </div>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-bold text-xs">
                TRADE
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
