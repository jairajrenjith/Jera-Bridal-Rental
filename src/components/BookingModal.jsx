import { useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'
import { generateInvoice } from '../utils/generateInvoice.js'

const emptyForm = { name: '', phone: '', eventDate: '', address: '' }

export default function BookingModal({ item, onClose }) {
  const { lockItem } = useInventory()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [confirmed, setConfirmed] = useState(null) // { invoiceNo }

  if (!item) return null

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!/^[0-9+\s-]{7,15}$/.test(form.phone.trim()))
      err.phone = 'Enter a valid phone number'
    if (!form.eventDate) err.eventDate = 'Pick your event date'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    setErrors(err)
    if (Object.keys(err).length > 0) return

    const invoiceNo = `${item.id}-${Date.now().toString().slice(-6)}`
    lockItem(item.id, form)
    generateInvoice({ item, booking: form, invoiceNo })
    setConfirmed({ invoiceNo })
  }

  const handleClose = () => {
    setForm(emptyForm)
    setErrors({})
    setConfirmed(null)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        {!confirmed ? (
          <>
            <p className="eyebrow">Book &amp; Lock</p>
            <h3 className="modal__title">{item.name}</h3>
            <p className="modal__sub">
              {item.id} · Rent ₹{item.price.toLocaleString('en-IN')} · Deposit
              ₹{item.deposit.toLocaleString('en-IN')}
            </p>

            <form onSubmit={handleSubmit} className="form" noValidate>
              <label className="field">
                <span>Your Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="e.g. Anjali Menon"
                />
                {errors.name && <em className="field__error">{errors.name}</em>}
              </label>

              <label className="field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="e.g. 98765 43210"
                />
                {errors.phone && <em className="field__error">{errors.phone}</em>}
              </label>

              <label className="field">
                <span>Event Date</span>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={update('eventDate')}
                />
                {errors.eventDate && (
                  <em className="field__error">{errors.eventDate}</em>
                )}
              </label>

              <label className="field">
                <span>Address (optional)</span>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={update('address')}
                  placeholder="For delivery / pickup coordination"
                />
              </label>

              <button type="submit" className="btn btn--primary btn--block">
                Confirm Booking &amp; Lock Item
              </button>
              <p className="form__note">
                Confirming locks this item immediately so no one else can
                book it, and downloads your PDF invoice.
              </p>
            </form>
          </>
        ) : (
          <div className="confirm">
            <span className="confirm__badge">Locked ✓</span>
            <h3 className="modal__title">You're all set, {form.name.split(' ')[0]}</h3>
            <p className="modal__sub">
              {item.name} is now reserved for {form.eventDate}. Your invoice
              (No. {confirmed.invoiceNo}) has been downloaded.
            </p>
            <button
              className="btn btn--outline btn--block"
              onClick={() =>
                generateInvoice({
                  item,
                  booking: form,
                  invoiceNo: confirmed.invoiceNo,
                })
              }
            >
              Download Invoice Again
            </button>
            <button className="btn btn--primary btn--block" onClick={handleClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
