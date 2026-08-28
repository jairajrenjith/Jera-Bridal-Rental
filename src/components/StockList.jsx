import { useMemo, useState } from 'react'
import { CATEGORIES } from '../data/items.js'
import { useInventory } from '../context/InventoryContext.jsx'
import ItemCard from './ItemCard.jsx'

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'locked', label: 'Locked / Booked' },
]

export default function StockList({ onBook }) {
  const { items } = useInventory()
  const [category, setCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const categoryOk = category === 'All' || it.category === category
      const statusOk =
        statusFilter === 'all' ||
        (statusFilter === 'available' && it.status === 'available') ||
        (statusFilter === 'locked' && it.status !== 'available')
      return categoryOk && statusOk
    })
  }, [items, category, statusFilter])

  const availableCount = items.filter((i) => i.status === 'available').length

  return (
    <section className="section section--panel" id="collection">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Live Stock &amp; Pricing</p>
            <h2 className="section__title">The Collection</h2>
          </div>
          <p id="availability" className="section__note">
            <strong>{availableCount}</strong> of{' '}
            <strong>{items.length}</strong> pieces available right now.
            Booked or locked items are hidden from other customers
            automatically.
          </p>
        </div>

        <div className="filters">
          <div className="filters__group">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'chip--active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="filters__group">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.value}
                className={`chip chip--outline ${
                  statusFilter === s.value ? 'chip--active' : ''
                }`}
                onClick={() => setStatusFilter(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="item-grid">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onBook={onBook} />
          ))}
          {filtered.length === 0 && (
            <p className="empty-state">
              Nothing matches that filter yet — try another category.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
