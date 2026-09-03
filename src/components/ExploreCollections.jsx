// "Explore Our Collections" section — sits right after the "Our
// Collections" (WhatWeRent) section. Shows the three collection types
// side by side, each with an image, heading and description. Edit
// title/desc/image freely — image paths point into /public.
const EXPLORE_COLLECTIONS = [
  {
    title: 'Bridal Dresses',
    desc: 'Elegant lehengas, gowns and sarees thoughtfully selected to make your bridal look truly unforgettable.',
    image: '/bridaldress-image.png',
  },
  {
    title: 'Bridal Jewellery',
    desc: 'Timeless kundan, temple and traditional jewellery pieces designed to complete your bridal ensemble with elegance.',
    image: '/jewellery-image.jpg',
  },
  {
    title: 'Mehendi',
    desc: 'Beautiful mehendi designs and styles to add the perfect traditional touch to your special celebrations.',
    image: '/mehendi-image.jpeg',
  },
]

export default function ExploreCollections() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow eyebrow--center">Explore Our Collections</p>
        <h2 className="section__title section__title--center">
            Made for your special moments
        </h2>

        <div className="explore-grid">
          {EXPLORE_COLLECTIONS.map((item) => (
            <div className="explore-card" key={item.title}>
              <div className="explore-card__photo">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <h3 className="explore-card__title">{item.title}</h3>
              <p className="explore-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}