import { useState } from 'react'
import { InventoryProvider } from './context/InventoryContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import WhatWeRent from './components/WhatWeRent.jsx'
import StockList from './components/StockList.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import BookingModal from './components/BookingModal.jsx'

export default function App() {
  const [bookingItem, setBookingItem] = useState(null)

  return (
    <InventoryProvider>
      <Navbar />
      <main>
        <Hero />
        <WhatWeRent />
        <StockList onBook={setBookingItem} />
        <HowItWorks />
      </main>
      <Footer />
      <BookingModal item={bookingItem} onClose={() => setBookingItem(null)} />
    </InventoryProvider>
  )
}
