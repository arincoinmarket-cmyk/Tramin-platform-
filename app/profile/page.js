'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Demo user ID placeholder - bind to auth user session
  const userId = "YOUR_SUPABASE_USER_ID"

  useEffect(() => {
    async function fetchProfile() {
      if (userId === "YOUR_SUPABASE_USER_ID") {
        setLoading(false)
        return
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (data) setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-green-500 mb-6 text-center">User Profile</h1>

      {loading ? (
        <p className="text-center text-gray-400 text-sm">Loading profile...</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="border-b border-gray-800 pb-3">
            <p className="text-xs text-gray-400">Account ID</p>
            <p className="font-mono text-sm font-bold text-white break-all">{userId}</p>
          </div>

          <div className="border-b border-gray-800 pb-3">
            <p className="text-xs text-gray-400">Secret Reference ID</p>
            <p className="font-mono text-base font-extrabold text-green-400">
              {profile?.secret_id || 'TRM-88421'}
            </p>
          </div>

          <div className="border-b border-gray-800 pb-3">
            <p className="text-xs text-gray-400">Phone Number</p>
            <p className="text-sm font-bold text-white">{profile?.phone || 'Not linked'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Email Address</p>
            <p className="text-sm font-bold text-white">{profile?.email || 'user@tramin.com'}</p>
          </div>
        </div>
      )}
    </main>
  )
}
