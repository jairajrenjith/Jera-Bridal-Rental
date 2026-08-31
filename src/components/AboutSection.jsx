import { SHOP } from '../config.js'

const COLLECTIONS = [
  { title: 'Bridal Dresses', desc: 'Lehengas, gowns and sarees for the bride, chosen for elegance and comfort.' },
  { title: 'Bridal Ornaments & Jewellery', desc: 'Temple sets, kemp stone sets and other pieces to complete the bridal look.' },
  { title: 'Bridesmaid Dresses', desc: 'Coordinated, stylish outfits for the bride’s closest companions.' },
  { title: 'Party Wear', desc: 'Designer wear for receptions, sangeet and other celebration events.' },
  { title: 'Special Occasion Collections', desc: 'Curated pieces for engagements, pre-wedding shoots and festive occasions.' },
]

const WHY_CHOOSE_US = [
  'Elegant & Trendy Collections',
  'Quality Dresses & Ornaments',
  'Affordable Rental Options',
  'Bridal & Bridesmaid Collections',
  'Well-Maintained Outfits',
  'Friendly & Personalised Service',
]

// Rendered on the home page, directly below the Hero — this used to be its
// own #/about page, but it now lives inline as a section instead.
export default function AboutSection() {
  return (
    <>
      <section className="page-header" id="about">
        <div className="container page-header__inner">
          <p className="eyebrow eyebrow--center">About Us</p>
          <h2 className="page-header__title">
            Your Special Day Deserves a <em>Special Look</em>
          </h2>
          <p className="page-header__sub">
            Welcome to {SHOP.name}, your destination for elegant and beautiful
            bridal fashion. We are dedicated to helping brides and their loved
            ones create unforgettable looks for their most special occasions.
          </p>
        </div>
      </section>
      <section className="section about-lead-section">
        <div className="container about-lead">
          <p>
            At {SHOP.name}, we offer a carefully selected collection of Bridal
            Dresses, Bridal Ornaments, Bridesmaid Dresses, and Party Wear
            designed to suit different styles, occasions, and preferences.
          </p>
        </div>
      </section>

      <section className="section section--panel" id="about-collections">
        <div className="container">
          <p className="eyebrow eyebrow--center">Our Collections</p>
          <h2 className="section__title section__title--center">
            Everything to complete your celebration look
          </h2>
          <p className="section__title--center about-lead__sub">
            From the perfect bridal outfit to elegant ornaments and stylish
            bridesmaid dresses, we bring everything you need to complete your
            celebration look under one roof.
          </p>

          <div className="rent-grid rent-grid--center-last">
            {COLLECTIONS.map((c) => (
              <div className="rent-card" key={c.title}>
                <span className="rent-card__mark" aria-hidden="true">
                  {c.title.charAt(0)}
                </span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="about-collections__cta">
            <a href="#/collections" className="btn btn--primary">
              View the Collection
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-grid">
          <div className="split-grid__col">
            <p className="eyebrow">Our Mission</p>
            <h2 className="split-grid__title">Every bride, beautiful and confident</h2>
            <p>
              Our mission is to make every bride feel beautiful, confident,
              and special on her most memorable day. We aim to provide
              stylish and quality bridal collections at affordable rental
              options, while making the entire experience simple, comfortable,
              and stress-free for every customer.
            </p>
          </div>
          <div className="split-grid__col">
            <p className="eyebrow">Our Vision</p>
            <h2 className="split-grid__title">A trusted bridal rental destination</h2>
            <p>
              Our vision is to become a trusted and preferred bridal rental
              destination, known for elegant collections, quality service, and
              customer satisfaction. We aspire to continuously bring the
              latest bridal trends and beautiful designs to our customers,
              helping every bride and her loved ones find a look that
              perfectly reflects their style and personality.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--panel">
        <div className="container">
          <p className="eyebrow eyebrow--center">Why Choose {SHOP.name}?</p>
          <h2 className="section__title section__title--center">
            Reasons brides trust us with their big day
          </h2>
          <ul className="check-list">
            {WHY_CHOOSE_US.map((reason) => (
              <li key={reason} className="check-list__item">
                <span className="check-list__mark" aria-hidden="true">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container about-lead">
          <p className="eyebrow eyebrow--center">Our Promise</p>
          <p>
            At {SHOP.name}, every customer is special to us. We focus on
            providing a smooth and comfortable rental experience, helping you
            find the perfect outfit and accessories for your big day.
          </p>
          <p>
            Whether you're a bride, bridesmaid, or simply looking for the
            perfect party wear, {SHOP.name} is here to make your special
            moments even more beautiful.
          </p>
        </div>
      </section>

      <section className="section section--panel about-visit">
        <div className="container about-visit__inner">
          <p className="eyebrow eyebrow--center">Visit Us</p>
          <h2 className="section__title section__title--center about-visit__title">
            <svg
              className="about-visit__pin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7-6.05-7-11.5A7 7 0 0 1 19 9.5C19 14.95 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {SHOP.name}
          </h2>
          <p className="about-visit__address">{SHOP.address}</p>
          <p className="about-visit__note">
            Come visit us and explore our beautiful collection for your
            special occasion.
          </p>
          <a href={SHOP.mapUrl} target="_blank" rel="noreferrer" className="btn btn--outline">
            Open in Google Maps →
          </a>
          <p className="about-visit__tagline">
            Your Dream Look. Our Collection. Your Special Day.
          </p>
        </div>
      </section>
    </>
  )
}
