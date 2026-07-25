import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex justify-between items-center text-sm font-bold">
      <Link href="/" className="text-green-500 text-lg font-extrabold tracking-wider">
        TRAMIN
      </Link>
      <div className="flex gap-3 text-xs">
        <Link href="/" className="hover:text-green-400 text-gray-300">
          Market
        </Link>
        <Link href="/wallet" className="hover:text-green-400 text-gray-300">
          Wallets
        </Link>
        <Link href="/mining" className="hover:text-blue-400 text-gray-300">
          Mining
        </Link>
        <Link href="/p2p" className="hover:text-purple-400 text-gray-300">
          P2P
        </Link>
        <Link href="/profile" className="hover:text-gray-100 text-gray-300">
          Profile
        </Link>
        <Link href="/support" className="hover:text-blue-300 text-gray-300">
          Support
        </Link>
        <Link href="/admin/deposits" className="hover:text-yellow-400 text-yellow-500 font-extrabold">
          Admin
        </Link>
      </div>
    </nav>
  )
}
