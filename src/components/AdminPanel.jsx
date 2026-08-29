import { Fragment, useEffect, useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'
import { fetchBookings, updateBookingStatus, updateItem, addItem, deleteItem, deleteBooking } from '../utils/api.js'
import { generateInvoice } from '../utils/generateInvoice.js'
import { waLink, mailLink, buildDecisionMessage, buildFollowUpMessage } from '../utils/contact.js'

const SESSION_KEY = 'jbr_admin_key'

const emptyAddForm = {
  id: '', name: '', category: '', price: '', deposit: '', size: '', color: '', photo: '', status: 'available',
}

export default function AdminPanel() {
  const { items, refresh: refreshItems } = useInventory()
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginInput, setLoginInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [checking, setChecking] = useState(false)

  const [tab, setTab] = useState('requests')
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [actioningId, setActioningId] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)

  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState(emptyAddForm)
  const [addingItem, setAddingItem] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deletingBookingId, setDeletingBookingId] = useState(null)

  const tryLogin = async (key) => {
    setChecking(true)
    setLoginError('')
    const res = await fetchBookings(key)
    setChecking(false)
    if (res.success) {
      sessionStorage.setItem(SESSION_KEY, key)
      setAdminKey(key)
      setLoggedIn(true)
      setBookings(res.bookings)
    } else {
      setLoginError(res.error || 'Wrong password, or the server could not be reached.')
    }
  }

  useEffect(() => {
    if (adminKey) tryLogin(adminKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadBookings = async () => {
    setLoadingBookings(true)
    const res = await fetchBookings(adminKey)
    setLoadingBookings(false)
    if (res.success) setBookings(res.bookings)
  }

  // Updates the sheet, then opens WhatsApp (and email, if given) with the
  // decision already typed in — the admin still taps Send.
  const decide = async (booking, status) => {
    setActioningId(booking.bookingId)
    const res = await updateBookingStatus(adminKey, booking.bookingId, status)
    setActioningId(null)
    if (res.success) {
      await loadBookings()
      await refreshItems()
      const message = buildDecisionMessage(booking, status)
      window.open(waLink(booking.phone, message), '_blank')
      if (booking.email) {
        window.open(mailLink(booking.email, `Your booking is ${status} — Jera Bridal Rental`, message), '_blank')
      }
    } else {
      alert(res.error || 'Could not update that booking.')
    }
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAdminKey('')
    setLoggedIn(false)
  }

  const startEdit = (item) => {
    setShowAddForm(false)
    setEditingId(item.id)
    setEditForm({
      name: item.name, category: item.category, price: item.price, deposit: item.deposit,
      size: item.size, color: item.color, photo: item.photo, status: item.status,
    })
  }

  const saveEdit = async (id) => {
    setSavingEdit(true)
    const res = await updateItem(adminKey, id, {
      ...editForm, price: Number(editForm.price), deposit: Number(editForm.deposit),
    })
    setSavingEdit(false)
    if (res.success) {
      setEditingId(null)
      await refreshItems()
    } else {
      alert(res.error || 'Could not save changes.')
    }
  }

  const submitAddForm = async (e) => {
    e.preventDefault()
    if (!addForm.id.trim() || !addForm.name.trim()) {
      alert('Item ID and Name are required.')
      return
    }
    setAddingItem(true)
    const res = await addItem(adminKey, {
      ...addForm,
      price: Number(addForm.price) || 0,
      deposit: Number(addForm.deposit) || 0,
    })
    setAddingItem(false)
    if (res.success) {
      setAddForm(emptyAddForm)
      setShowAddForm(false)
      await refreshItems()
    } else {
      alert(res.error || 'Could not add the item.')
    }
  }

  const removeBooking = async (booking) => {
    if (!window.confirm(`Delete this booking (${booking.itemName}, Ref: ${booking.bookingId})? This can't be undone.`)) return
    setDeletingBookingId(booking.bookingId)
    const res = await deleteBooking(adminKey, booking.bookingId)
    setDeletingBookingId(null)
    if (res.success) {
      await loadBookings()
    } else {
      alert(res.error || 'Could not delete that booking.')
    }
  }

  const removeItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}" (${item.id})? This can't be undone.`)) return
    setDeletingId(item.id)
    const res = await deleteItem(adminKey, item.id)
    setDeletingId(null)
    if (res.success) {
      if (editingId === item.id) setEditingId(null)
      await refreshItems()
    } else {
      alert(res.error || 'Could not delete the item.')
    }
  }

  if (!loggedIn) {
    return (
      <div className="admin admin--login">
        <div className="admin-login">
          <p className="eyebrow">Jera Bridal Rental</p>
          <h1 className="modal__title">Admin Login</h1>
          <p className="modal__sub">Enter the admin password for the admin account in Firebase Authentication.</p>
          <form className="form" onSubmit={(e) => { e.preventDefault(); tryLogin(loginInput) }}>
            <label className="field">
              <span>Password</span>
              <input type="password" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} autoFocus />
            </label>
            {loginError && <em className="field__error">{loginError}</em>}
            <button className="btn btn--primary btn--block" disabled={checking}>
              {checking ? 'Checking…' : 'Log In'}
            </button>
          </form>
          <p className="form__note">
            <a href="#" onClick={() => { window.location.hash = '' }}>← Back to the site</a>
          </p>
        </div>
      </div>
    )
  }

  const pending = bookings.filter((b) => b.status === 'Pending')

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <p className="eyebrow">Jera Bridal Rental</p>
          <h1 className="modal__title">Admin Portal</h1>
        </div>
        <button className="btn btn--outline" onClick={logout}>Log Out</button>
      </header>

      <nav className="admin__tabs">
        <button className={`tab ${tab === 'requests' ? 'tab--active' : ''}`} onClick={() => { setTab('requests'); loadBookings() }}>
          Requests {pending.length > 0 && <span className="tab__badge">{pending.length}</span>}
        </button>
        <button className={`tab ${tab === 'bookings' ? 'tab--active' : ''}`} onClick={() => { setTab('bookings'); loadBookings() }}>
          All Bookings
        </button>
        <button className={`tab ${tab === 'collection' ? 'tab--active' : ''}`} onClick={() => setTab('collection')}>
          Manage Collection
        </button>
      </nav>

      {tab === 'requests' && (
        <section className="admin__section">
          <div className="admin__section-head">
            <h2>Pending Requests</h2>
            <button className="btn btn--ghost" onClick={loadBookings} disabled={loadingBookings}>
              {loadingBookings ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          {pending.length === 0 && <p className="section__note">No pending requests right now.</p>}
          <div className="admin__cards">
            {pending.map((b) => (
              <div className="admin-card" key={b.bookingId}>
                <div className="admin-card__row">
                  <strong>{b.itemName}</strong>
                  <span className="badge badge--pending">Pending</span>
                </div>
                <p className="admin-card__meta">{b.itemId} · Rent ₹{Number(b.rent).toLocaleString('en-IN')} · Deposit ₹{Number(b.deposit).toLocaleString('en-IN')}</p>
                <p className="admin-card__meta">{b.customerName} · {b.phone}{b.email ? ` · ${b.email}` : ''}</p>
                <p className="admin-card__meta">Event: {b.eventDate}{b.address ? ` · ${b.address}` : ''}</p>
                <p className="admin-card__meta admin-card__meta--dim">Ref: {b.bookingId}</p>
                <div className="admin-card__actions">
                  <button className="btn btn--primary" disabled={actioningId === b.bookingId} onClick={() => decide(b, 'Approved')}>Approve</button>
                  <button className="btn btn--outline" disabled={actioningId === b.bookingId} onClick={() => decide(b, 'Rejected')}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'bookings' && (
        <section className="admin__section">
          <div className="admin__section-head">
            <h2>All Bookings</h2>
            <button className="btn btn--ghost" onClick={loadBookings} disabled={loadingBookings}>
              {loadingBookings ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <div className="admin-table__wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Item</th><th>Customer</th><th>Event Date</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingId}>
                    <td>{b.itemName}<br /><span className="admin-table__dim">{b.itemId}</span></td>
                    <td>{b.customerName}<br /><span className="admin-table__dim">{b.phone}</span></td>
                    <td>{b.eventDate}</td>
                    <td><span className={`badge badge--${String(b.status).toLowerCase()}`}>{b.status}</span></td>
                    <td>
                      <div className="admin-table__actions">
                        <a className="btn btn--ghost" target="_blank" rel="noreferrer" href={waLink(b.phone, buildFollowUpMessage(b))}>
                          WhatsApp
                        </a>
                        {b.email && (
                          <a className="btn btn--ghost" target="_blank" rel="noreferrer"
                            href={mailLink(b.email, 'About your booking — Jera Bridal Rental', buildFollowUpMessage(b))}>
                            Email
                          </a>
                        )}
                        {b.status === 'Approved' && (
                          <button className="btn btn--ghost" onClick={() => generateInvoice(b)}>Invoice</button>
                        )}
                        <button
                          className="btn btn--outline"
                          disabled={deletingBookingId === b.bookingId}
                          onClick={() => removeBooking(b)}
                        >
                          {deletingBookingId === b.bookingId ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan={5} className="empty-state">No bookings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'collection' && (
        <section className="admin__section">
          <div className="admin__section-head">
            <h2>Manage Collection</h2>
            <div className="admin-table__actions">
              <button className="btn btn--ghost" onClick={refreshItems}>Refresh</button>
              <button
                className="btn btn--primary"
                onClick={() => { setEditingId(null); setShowAddForm((v) => !v) }}
              >
                {showAddForm ? 'Close' : '+ Add New Item'}
              </button>
            </div>
          </div>
          <p className="section__note">
            Add, edit, or delete items right here — every change updates the Collections sheet automatically.
          </p>

          {showAddForm && (
            <form className="edit-form" onSubmit={submitAddForm} style={{ marginBottom: 24 }}>
              <label className="field"><span>Item ID</span>
                <input value={addForm.id} onChange={(e) => setAddForm((f) => ({ ...f, id: e.target.value }))} placeholder="e.g. JD-107" required />
              </label>
              <label className="field"><span>Name</span>
                <input value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Ivory Kasavu Wedding Saree" required />
              </label>
              <label className="field"><span>Category</span>
                <input value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Bridal Dress" />
              </label>
              <label className="field"><span>Rent (₹)</span>
                <input type="number" value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))} />
              </label>
              <label className="field"><span>Deposit (₹)</span>
                <input type="number" value={addForm.deposit} onChange={(e) => setAddForm((f) => ({ ...f, deposit: e.target.value }))} />
              </label>
              <label className="field"><span>Size</span>
                <input value={addForm.size} onChange={(e) => setAddForm((f) => ({ ...f, size: e.target.value }))} placeholder="e.g. Free size (adjustable)" />
              </label>
              <label className="field"><span>Color</span>
                <input value={addForm.color} onChange={(e) => setAddForm((f) => ({ ...f, color: e.target.value }))} />
              </label>
              <label className="field edit-form__wide"><span>Photo URL</span>
                <input value={addForm.photo} onChange={(e) => setAddForm((f) => ({ ...f, photo: e.target.value }))} placeholder="https://..." />
              </label>
              <label className="field"><span>Status</span>
                <select value={addForm.status} onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value }))}>
                  <option value="available">available</option>
                  <option value="pending">pending</option>
                  <option value="booked">booked</option>
                  <option value="locked">locked</option>
                </select>
              </label>
              <button className="btn btn--primary edit-form__wide" disabled={addingItem}>
                {addingItem ? 'Adding…' : 'Add Item'}
              </button>
            </form>
          )}

          <div className="admin-table__wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Item</th><th>Category</th><th>Rent</th><th>Deposit</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <Fragment key={item.id}>
                    <tr>
                      <td>{item.name}<br /><span className="admin-table__dim">{item.id}</span></td>
                      <td>{item.category}</td>
                      <td>₹{Number(item.price).toLocaleString('en-IN')}</td>
                      <td>₹{Number(item.deposit).toLocaleString('en-IN')}</td>
                      <td><span className={`badge badge--${item.status}`}>{item.status}</span></td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="btn btn--ghost" onClick={() => (editingId === item.id ? setEditingId(null) : startEdit(item))}>
                            {editingId === item.id ? 'Close' : 'Edit'}
                          </button>
                          <button
                            className="btn btn--outline"
                            disabled={deletingId === item.id}
                            onClick={() => removeItem(item)}
                          >
                            {deletingId === item.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {editingId === item.id && (
                      <tr>
                        <td colSpan={6}>
                          <div className="edit-form">
                            <label className="field"><span>Name</span>
                              <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
                            </label>
                            <label className="field"><span>Category</span>
                              <input value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} />
                            </label>
                            <label className="field"><span>Rent (₹)</span>
                              <input type="number" value={editForm.price} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))} />
                            </label>
                            <label className="field"><span>Deposit (₹)</span>
                              <input type="number" value={editForm.deposit} onChange={(e) => setEditForm((f) => ({ ...f, deposit: e.target.value }))} />
                            </label>
                            <label className="field"><span>Size</span>
                              <input value={editForm.size} onChange={(e) => setEditForm((f) => ({ ...f, size: e.target.value }))} />
                            </label>
                            <label className="field"><span>Color</span>
                              <input value={editForm.color} onChange={(e) => setEditForm((f) => ({ ...f, color: e.target.value }))} />
                            </label>
                            <label className="field edit-form__wide"><span>Photo URL</span>
                              <input value={editForm.photo} onChange={(e) => setEditForm((f) => ({ ...f, photo: e.target.value }))} />
                            </label>
                            <label className="field"><span>Status</span>
                              <select value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}>
                                <option value="available">available</option>
                                <option value="pending">pending</option>
                                <option value="booked">booked</option>
                                <option value="locked">locked</option>
                              </select>
                            </label>
                            <button className="btn btn--primary edit-form__wide" disabled={savingEdit} onClick={() => saveEdit(item.id)}>
                              {savingEdit ? 'Saving…' : 'Save Changes'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="empty-state">No items in the collection yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
