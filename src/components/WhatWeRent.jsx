import { WHAT_WE_RENT } from '../data/items.js'

export default function WhatWeRent() {
  return (
    <section className="section" id="what-we-rent">
      <div className="container">
        <p className="eyebrow eyebrow--center">What We Rent</p>
        <h2 className="section__title section__title--center">
          Everything for the big day, in one wardrobe
        </h2>

        <div className="rent-grid wardrobe-grid">
          {WHAT_WE_RENT.map((r) => (
            <div className="rent-card" key={r.title}>
              <span className="rent-card__mark" aria-hidden="true">
                {r.title.charAt(0)}
              </span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
