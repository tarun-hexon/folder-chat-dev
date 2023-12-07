import './globals.css'
import Image from 'next/image'

import { Inter } from 'next/font/google'
import { Signup } from './components';
import Intial from './Intial';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Folder Chat',
  description: 'Developed By Hexon Global',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>      
        
        <Intial>
          {children}
        </Intial>
      </body>

    </html>
  )
}
