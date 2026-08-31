import { useEffect, useState } from 'react'
import { InventoryProvider } from './context/InventoryContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import WhatWeRent from './components/WhatWeRent.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import BookingModal from './components/BookingModal.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import AboutSection from './components/AboutSection.jsx'

export default function App() {
  const [bookingItem, setBookingItem] = useState(null)
  // Visiting yoursite.com/#admin opens the admin portal and #/collections
  // opens the full collection browser — hash routes need no server config,
  // unlike real path-based routes would. Every other hash (#about,
  // #how-it-works, #contact...) is an in-page anchor on the home layout.
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash
      setRoute(hash)
      if (hash === '#/collections') {
        // Jumping to a whole new page should start at the top, not
        // wherever the scroll happened to be on the previous page.
        window.scrollTo({ top: 0 })
      } else if (hash) {
        // Coming from another page (e.g. Collections), the target section
        // only exists once we've switched back to the home layout above —
        // so wait a frame for that render before scrolling to it.
        requestAnimationFrame(() => {
          document.querySelector(hash)?.scrollIntoView()
        })
      }
    }
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
            {route === '#/collections' ? (
              <CollectionsPage onBook={setBookingItem} />
            ) : (
              <>
                <Hero />
                <AboutSection />
                <WhatWeRent />
                <HowItWorks />
              </>
            )}
          </main>
          <Footer />
          <BookingModal item={bookingItem} onClose={() => setBookingItem(null)} />
        </>
      )}
    </InventoryProvider>
  )
}