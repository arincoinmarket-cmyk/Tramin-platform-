import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-2">
        <Link href="/" className="text-green-500 text-lg font-black tracking-wider">
          TRAMIN
        </Link>
        
        <div className="flex items-center gap-3 overflow-x-auto text-xs font-semibold py-1 scrollbar-none">
          <Link href="/" className="text-gray-300 hover:text-green-400 whitespace-nowrap">
            Market
          </Link>
          <Link href="/wallet" className="text-gray-300 hover:text-green-400 whitespace-nowrap">
            Wallets
          </Link>
          <Link href="/mining" className="text-gray-300 hover:text-blue-400 whitespace-nowrap">
            Mining
          </Link>
          <Link href="/p2p" className="text-gray-300 hover:text-purple-400 whitespace-nowrap">
            P2P
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white whitespace-nowrap">
            Profile
          </Link>
          <Link href="/support" className="text-gray-300 hover:text-blue-300 whitespace-nowrap">
            Support
          </Link>
          <Link href="/admin/deposits" className="text-yellow-500 font-extrabold hover:text-yellow-400 whitespace-nowrap">
            Admin
          </Link>
          <Link href="/login" className="bg-yellow-500 text-black px-2.5 py-1 rounded-md font-black hover:bg-yellow-400 whitespace-nowrap">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}
