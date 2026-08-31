import StockList from '../components/StockList.jsx'

export default function CollectionsPage({ onBook }) {
  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <p className="eyebrow eyebrow--center">Our Collections</p>
          <h1 className="page-header__title">Browse the Full Collection</h1>
          <p className="page-header__sub">
            Every bridal outfit and jewellery set we carry, with live
            availability and pricing. Search by name, code or colour, or
            filter by category to find the exact piece you have in mind.
          </p>
        </div>
        <div className="kasavu-rule" aria-hidden="true" />
      </section>

      <StockList onBook={onBook} />
    </>
  )
}
