const STATUS_LABEL = {
  available: 'Available',
  locked: 'Locked',
  booked: 'Booked',
}

export default function ItemCard({ item, onBook }) {
  const isFree = item.status === 'available'

  return (
    <article className={`item-card item-card--${item.status}`}>
      <div className="item-card__photo">
        <img src={item.photo} alt={item.name} loading="lazy" />
        <span className={`status-pill status-pill--${item.status}`}>
          {STATUS_LABEL[item.status]}
        </span>
      </div>

      <div className="item-card__body">
        <p className="item-card__sku">{item.id}</p>
        <h3 className="item-card__name">{item.name}</h3>
        <p className="item-card__meta">
          {item.color} · {item.size}
        </p>

        <div className="item-card__prices">
          <div>
            <span className="item-card__label">Rent</span>
            <span className="item-card__value">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="item-card__label">Deposit</span>
            <span className="item-card__value">
              ₹{item.deposit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <button
          className="btn btn--primary btn--block"
          disabled={!isFree}
          onClick={() => onBook(item)}
        >
          {isFree ? 'Book & Lock This' : STATUS_LABEL[item.status]}
        </button>
      </div>
    </article>
  )
}
