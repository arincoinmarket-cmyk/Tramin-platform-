'use client'

export default function MiningPage() {
  const plans = [
    { name: 'Starter Hash', price: '10,000 UGX', daily: '1,000 UGX/day', duration: '15 Days' },
    { name: 'Pro Hash Pro', price: '50,000 UGX', daily: '5,500 UGX/day', duration: '15 Days' },
    { name: 'Ultra Rig', price: '200,000 UGX', daily: '24,000 UGX/day', duration: '15 Days' },
  ]

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-blue-500 mb-1 text-center">Arncoin Hash Mining</h1>
      <p className="text-xs text-gray-400 mb-6 text-center">Rent Hashes & Earn Daily M-Wallet Yields</p>

      <div className="space-y-4">
        {plans.map((p, idx) => (
          <div key={idx} className="bg-gray-900 border border-blue-500/30 p-4 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white">{p.name}</h2>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">{p.duration}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Price: <strong className="text-white">{p.price}</strong></span>
              <span>Daily Yield: <strong className="text-green-400">{p.daily}</strong></span>
            </div>
            <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition">
              RENT HASHRATE
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
