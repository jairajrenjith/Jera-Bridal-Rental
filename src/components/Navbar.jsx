import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#/collections', label: 'Collections' },
  { href: '#about', label: 'About Us' },
  { href: '#how-it-works', label: 'How Booking Works' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a href="#top" className="navbar__brand">
          <img src="/logo.png" alt="Jera Bridal Rental" className="navbar__logo" />
          <span className="navbar__name">
            Jera <em>Bridal Rental</em>
          </span>
        </a>

        <nav className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#/collections" className="btn btn--ghost navbar__cta">
          Check Stock
        </a>

        <button
          className="navbar__toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className="kasavu-rule" aria-hidden="true" />
    </header>
  )
}
