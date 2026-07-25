export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black text-white">
      <h1 className="text-4xl font-bold text-green-500 mb-2">Tramin Platform</h1>
      <p className="text-gray-400 max-w-md">
        Core setup initialized successfully. Ready to connect trading engine & modules.
      </p>
      <div className="mt-6 px-4 py-2 bg-gray-900 border border-green-500/30 rounded-lg text-sm text-green-400">
        System Status: Online
      </div>
    </main>
  )
}
