import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 120, suffix: '+', label: 'Bridal outfits & sets' },
  { value: 60, suffix: '+', label: 'Jewellery sets in stock' },
  { value: 24, suffix: ' hrs', label: 'To lock & confirm a booking' },
]

// Counts up from 0 to `target` once `active` becomes true, instead of
// showing the number plainly on load.
function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let frame
    let start = null

    const tick = (timestamp) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out
      setValue(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])

  return value
}

function StatBox({ stat, active }) {
  const value = useCountUp(stat.value, active)
  return (
    <div className="hero__stat">
      <dt>
        {value}
        {stat.suffix}
      </dt>
      <dd>{stat.label}</dd>
    </div>
  )
}

export default function Hero() {
  const statsRef = useRef(null)
  const [active, setActive] = useState(false)

  // Trigger the count-up only once the stats actually scroll into view.
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

        <dl className="hero__stats" ref={statsRef}>
          {STATS.map((s) => (
            <StatBox key={s.label} stat={s} active={active} />
          ))}
        </dl>
      </div>
    </section>
  )
}
