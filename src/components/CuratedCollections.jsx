import { useState } from 'react'
import { CURATED_COLLECTIONS } from '../data/items.js'

// Expandable "slides" strip for the Our Collections section.
// - One item is always active/expanded; clicking any thumbnail makes it
//   the active one and the previously-active item collapses back down.
// - The active slide is always shown first (leftmost on desktop, topmost
//   on mobile) via the CSS `order` property — the underlying list order
//   never changes, so nothing else about the data is touched.
// - The caption panel (title + description) always sits before the
//   slides themselves (leftmost on desktop, topmost on mobile).
export default function CuratedCollections() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = CURATED_COLLECTIONS[activeIndex]

  return (
    <div className="curated">
      <div className="curated__caption">
        <p className="eyebrow">Featured Piece</p>
        <h3>{active.title}</h3>
        <p>{active.desc}</p>
      </div>

      <div className="curated__track">
        {CURATED_COLLECTIONS.map((item, i) => {
          const isActive = i === activeIndex
          return (
            <button
              type="button"
              key={item.title}
              className={`curated__slide${isActive ? ' curated__slide--active' : ''}`}
              style={{ order: isActive ? 0 : i + 1 }}
              onClick={() => setActiveIndex(i)}
              aria-pressed={isActive}
              aria-label={item.title}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
