export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="kasavu-rule" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/logo.png" alt="Jera Bridal Rental" className="navbar__logo" />
          <span className="navbar__name">
            Jera <em>Bridal Rental</em>
          </span>
          <p>Bridal wear &amp; jewellery on rent, with honest pricing and no surprises.</p>
        </div>

        <div className="footer__col">
          <h4>Visit Us</h4>
          <p>Jera Bridal Rental,<br />MG Road, Thiruvananthapuram,<br />Kerala, India</p>
        </div>

        <div className="footer__col">
          <h4>Get in Touch</h4>
          <p>
            <a href="tel:+910000000000">+91 00000 00000</a>
            <br />
            <a href="mailto:jerabridalrental@example.com">jerabridalrental@example.com</a>
          </p>
        </div>

        <div className="footer__col">
          <h4>Hours</h4>
          <p>Mon – Sat: 10:00 AM – 8:00 PM<br />Sunday: By appointment</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Jera Bridal Rental. All rights reserved.</p>
      </div>
    </footer>
  )
}
