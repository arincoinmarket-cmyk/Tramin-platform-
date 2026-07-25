'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkAdminAndFetch() {
      // 1. Check current logged-in user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // 2. Check admin flag in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        setMsg('Access Denied: Admin privileges required.')
        setLoading(false)
        return
      }

      setIsAdmin(true)

      // 3. Fetch deposit requests
      const { data } = await supabase
        .from('transactions')
        .select('*, profiles(email, phone, secret_id)')
        .eq('type', 'DEPOSIT')
        .order('created_at', { ascending: false })

      if (data) setDeposits(data)
      setLoading(false)
    }

    checkAdminAndFetch()
  }, [])

  const handleAction = async (transaction_id, action) => {
    setMsg('Processing...')
    try {
      const res = await fetch('/api/admin/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id, action })
      })
      const data = await res.json()
      if (data.error) setMsg(`Error: ${data.error}`)
      else {
        setMsg(data.message)
        // Refresh list
        const { data: refreshed } = await supabase
          .from('transactions')
          .select('*, profiles(email, phone, secret_id)')
          .eq('type', 'DEPOSIT')
          .order('created_at', { ascending: false })
        if (refreshed) setDeposits(refreshed)
      }
    } catch (err) {
      setMsg('Failed to update transaction.')
    }
  }

  if (loading) return <main className="min-h-screen bg-black text-white p-6 text-center text-sm">Verifying Admin Session...</main>

  if (!isAdmin) return <main className="min-h-screen bg-black text-red-500 p-6 text-center text-sm">{msg || 'Unauthorized'}</main>

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-yellow-500 mb-6 text-center">Admin: Deposit Approvals</h1>

      {msg && <p className="mb-4 text-xs text-center text-gray-300 bg-gray-800 p-2 rounded-lg">{msg}</p>}

      {deposits.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No deposit requests found.</p>
      ) : (
        <div className="space-y-3">
          {deposits.map((d) => (
            <div key={d.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-green-400 text-sm">{d.amount} UGX</p>
                <p className="text-gray-400">User: {d.profiles?.email || d.user_id}</p>
                <p className="text-gray-500">Phone: {d.profiles?.phone || 'N/A'} | Secret: {d.profiles?.secret_id || 'N/A'}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                  d.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                  d.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {d.status}
                </span>
              </div>

              {d.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(d.id, 'APPROVE')}
                    className="bg-green-500 hover:bg-green-600 text-black font-extrabold px-3 py-2 rounded-lg text-xs"
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={() => handleAction(d.id, 'REJECT')}
                    className="bg-red-500 hover:bg-red-600 text-white font-extrabold px-3 py-2 rounded-lg text-xs"
                  >
                    REJECT
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
