export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <p className="eyebrow">Bridal Wear &amp; Jewellery, on Rent</p>
        <h1 className="hero__title">
          Wear the wedding
          <br />
          you <em>imagined</em>.
        </h1>
        <p className="hero__sub">
          Live stock, real prices and instant locking — so the lehenga or
          jewellery set you fall in love with is reserved the moment you
          book it. Every booking ends with a PDF invoice sent straight to
          you.
        </p>
        <div className="hero__actions">
          <a href="#collection" className="btn btn--primary">
            Browse the Collection
          </a>
          <a href="#availability" className="btn btn--outline">
            Check Availability
          </a>
        </div>

        <dl className="hero__stats">
          <div>
            <dt>120+</dt>
            <dd>Bridal outfits &amp; sets</dd>
          </div>
          <div>
            <dt>60+</dt>
            <dd>Jewellery sets in stock</dd>
          </div>
          <div>
            <dt>24 hrs</dt>
            <dd>To lock &amp; confirm a booking</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
