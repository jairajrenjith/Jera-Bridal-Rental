import { SHOP } from '../config.js'

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="kasavu-rule" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/logo.png" alt={SHOP.name} className="navbar__logo" />
          <span className="navbar__name">Jera <em>Bridal Rental</em></span>
          <p>Bridal wear &amp; jewellery on rent, with honest pricing and no surprises.</p>
        </div>

        <div className="footer__col">
          <h4>Visit Us</h4>
          <p>{SHOP.name},<br />{SHOP.address}</p>
          <p><a href={SHOP.mapUrl} target="_blank" rel="noreferrer">Open in Google Maps →</a></p>
        </div>

        <div className="footer__col">
          <h4>Get in Touch</h4>
          <p>
            <a href={`tel:${SHOP.phoneDigits}`}>{SHOP.phone}</a><br />
            <a href={`https://wa.me/${SHOP.phoneDigits}`} target="_blank" rel="noreferrer">WhatsApp Us</a><br />
            <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
          </p>
        </div>

        <div className="footer__col">
          <h4>Hours</h4>
          <p>Monday – Sunday<br />10:00 AM – 7:00 PM</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} {SHOP.name}. All rights reserved.</p>
        <p className="footer__admin"><a href="#admin">Admin Login</a></p>
      </div>
    </footer>
  )
}