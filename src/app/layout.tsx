import './styles/globals.scss';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["cyrillic"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
