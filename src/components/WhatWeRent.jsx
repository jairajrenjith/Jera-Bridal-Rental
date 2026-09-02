import CuratedCollections from './CuratedCollections.jsx'

export default function WhatWeRent() {
  return (
    <section className="section" id="what-we-rent">
      <div className="container">
        <p className="eyebrow eyebrow--center">Our Collections</p>
        <h2 className="section__title section__title--center">
          Curated for Your Celebration
        </h2>

        <CuratedCollections />
      </div>
    </section>
  )
}
