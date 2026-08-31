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
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((it) => {
      const categoryOk = category === 'All' || it.category === category
      const statusOk =
        statusFilter === 'all' ||
        (statusFilter === 'available' && it.status === 'available') ||
        (statusFilter === 'locked' && it.status !== 'available')
      const searchOk =
        query === '' ||
        it.name.toLowerCase().includes(query) ||
        it.id.toLowerCase().includes(query) ||
        (it.color || '').toLowerCase().includes(query)
      return categoryOk && statusOk && searchOk
    })
  }, [items, category, statusFilter, search])

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

        <div className="search-field">
          <svg className="search-field__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the collection by name, code or colour…"
            aria-label="Search the collection"
          />
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
              {search
                ? `Nothing matches "${search}" — try a different search term or filter.`
                : 'Nothing matches that filter yet — try another category.'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
