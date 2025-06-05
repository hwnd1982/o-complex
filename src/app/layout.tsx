import './globals.scss';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["cyrillic"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
