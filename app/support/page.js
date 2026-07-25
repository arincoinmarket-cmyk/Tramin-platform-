'use client'
import { useState } from 'react'

export default function SupportPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Placeholder user ID
  const userId = "YOUR_SUPABASE_USER_ID"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('Sending ticket...')

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, subject, message })
      })
      const data = await res.json()
      if (data.error) setMsg(`Error: ${data.error}`)
      else {
        setMsg('Support ticket sent! Our team will review it shortly.')
        setSubject('')
        setMessage('')
      }
    } catch (err) {
      setMsg('Failed to send ticket.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-blue-500 mb-1 text-center">Help & Support</h1>
      <p className="text-xs text-gray-400 mb-6 text-center">Submit a query to Tramin Desk</p>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
        <label className="block text-xs text-gray-400 mb-1">Subject</label>
        <input
          type="text"
          placeholder="e.g. Deposit Inquiry"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
        />

        <label className="block text-xs text-gray-400 mb-1">Message Details</label>
        <textarea
          rows="4"
          placeholder="Describe your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'SUBMIT TICKET'}
        </button>

        {msg && <p className="mt-3 text-xs text-center text-gray-300 bg-gray-800 p-2 rounded-lg">{msg}</p>}
      </form>
    </main>
  )
}
