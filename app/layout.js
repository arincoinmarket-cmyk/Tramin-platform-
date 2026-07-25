import './globals.css'

export const metadata = {
  title: 'Tramin Platform',
  description: 'Trading & Investment Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
