import { useEffect, useState } from 'react'
import { InventoryProvider } from './context/InventoryContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import WhatWeRent from './components/WhatWeRent.jsx'
import StockList from './components/StockList.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import BookingModal from './components/BookingModal.jsx'
import AdminPanel from './components/AdminPanel.jsx'

export default function App() {
  const [bookingItem, setBookingItem] = useState(null)
  // Visiting yoursite.com/#admin opens the admin portal — a hash route
  // needs no server config, unlike a real path-based route would.
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <InventoryProvider>
      {route === '#admin' ? (
        <AdminPanel />
      ) : (
        <>
          <Navbar />
          <main>
            <Hero />
            <WhatWeRent />
            <StockList onBook={setBookingItem} />
            <HowItWorks />
          </main>
          <Footer />
          <BookingModal item={bookingItem} onClose={() => setBookingItem(null)} />
        </>
      )}
    </InventoryProvider>
  )
}