import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ReduxProvider from '@/store/ReduxProvider'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
// import ReduxProvider from '@/store/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Online Assessment Platform',
  description: 'Create and take online assessments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Navbar/>
          {children}
          <Footer/>
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  )
}