const STEPS = [
  {
    title: 'Browse live stock',
    desc: 'See real photos, prices and deposit amounts for every dress and jewellery set — updated as items move.',
  },
  {
    title: 'Check availability',
    desc: 'Availability badges show what is free, locked or already booked, so you never chase an item that is gone.',
  },
  {
    title: 'Book & lock instantly',
    desc: 'Fill in your name, phone and event date. The moment you confirm, the item is locked for you alone.',
  },
  {
    title: 'Get your PDF invoice',
    desc: 'A detailed invoice with rent, deposit and event date is generated and sent to you automatically.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <p className="eyebrow eyebrow--center">How Booking Works</p>
        <h2 className="section__title section__title--center">
          From browsing to invoice, in four steps
        </h2>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="steps__item" key={s.title}>
              <span className="steps__num">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
