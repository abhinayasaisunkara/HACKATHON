import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wealth Ops Backend',
  description: 'Backend API for Wealth Operations Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}