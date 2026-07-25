import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex justify-between items-center text-sm font-bold">
      <Link href="/" className="text-green-500 text-lg font-extrabold tracking-wider">
        TRAMIN
      </Link>
      <div className="flex gap-4">
        <Link href="/" className="hover:text-green-400 text-gray-300">
          Market
        </Link>
        <Link href="/wallet" className="hover:text-green-400 text-gray-300">
          Wallets
        </Link>
      </div>
    </nav>
  )
}
