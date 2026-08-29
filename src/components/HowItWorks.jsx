const STEPS = [
  { title: 'Browse live stock', desc: 'See real photos, prices and deposit amounts for every dress and jewellery set — updated as items move.' },
  { title: 'Check availability', desc: 'Availability badges show what is free, requested or already booked, so you never chase an item that is gone.' },
  { title: 'Send a booking request', desc: 'Fill in your name, phone and event date. The item is held instantly so no one else can grab it while we review your request.' },
  { title: 'Get WhatsApp confirmation', desc: 'Our team checks your request and confirms it on WhatsApp — that\'s when your booking and invoice are finalised.' },
]

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <p className="eyebrow eyebrow--center">How Booking Works</p>
        <h2 className="section__title section__title--center">From browsing to confirmation, in four steps</h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="steps__item" key={s.title}>
              <span className="steps__num">{i + 1}</span>
              <div><h3>{s.title}</h3><p>{s.desc}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}