import { useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'
import { SHOP } from '../config.js'
import { waLink, buildRequestMessage } from '../utils/contact.js'

const emptyForm = { name: '', phone: '', email: '', eventDate: '', address: '' }

export default function BookingModal({ item, onClose }) {
  const { requestBooking } = useInventory()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(null) // { bookingId, waHref } | { error }

  if (!item) return null

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!/^[0-9+\s-]{7,15}$/.test(form.phone.trim())) err.phone = 'Enter a valid phone number'
    if (!form.eventDate) err.eventDate = 'Pick your event date'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    setErrors(err)
    if (Object.keys(err).length > 0) return

    setSending(true)
    const res = await requestBooking(item, form)
    setSending(false)

    if (res.success) {
      // Open WhatsApp with the request already typed in — the customer
      // still taps Send. Nothing is sent automatically.
      const message = buildRequestMessage(item, form, res.bookingId)
      const href = waLink(SHOP.phoneDigits, message)
      window.open(href, '_blank')
      setSent({ bookingId: res.bookingId, waHref: href })
    } else {
      setSent({ error: res.error || "Something went wrong. Please try again or WhatsApp us directly." })
    }
  }

  const handleClose = () => { setForm(emptyForm); setErrors({}); setSent(null); onClose() }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={handleClose} aria-label="Close">×</button>

        {!sent ? (
          <>
            <p className="eyebrow">Book &amp; Lock</p>
            <h3 className="modal__title">{item.name}</h3>
            <p className="modal__sub">
              {item.id} · Rent ₹{item.price.toLocaleString('en-IN')} · Deposit ₹{item.deposit.toLocaleString('en-IN')}
            </p>

            <form onSubmit={handleSubmit} className="form" noValidate>
              <label className="field">
                <span>Your Name</span>
                <input type="text" value={form.name} onChange={update('name')} placeholder="e.g. Anjali Menon" />
                {errors.name && <em className="field__error">{errors.name}</em>}
              </label>
              <label className="field">
                <span>Phone Number</span>
                <input type="tel" value={form.phone} onChange={update('phone')} placeholder="e.g. 98765 43210" />
                {errors.phone && <em className="field__error">{errors.phone}</em>}
              </label>
              <label className="field">
                <span>Email (optional)</span>
                <input type="email" value={form.email} onChange={update('email')} placeholder="for a reply by email" />
              </label>
              <label className="field">
                <span>Event Date</span>
                <input type="date" value={form.eventDate} onChange={update('eventDate')} />
                {errors.eventDate && <em className="field__error">{errors.eventDate}</em>}
              </label>
              <label className="field">
                <span>Address (optional)</span>
                <textarea rows={2} value={form.address} onChange={update('address')} placeholder="For delivery / pickup coordination" />
              </label>

              <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
                {sending ? 'Sending Request…' : 'Send Booking Request'}
              </button>
              <p className="form__note">
                This holds the item for you and opens WhatsApp with your
                request already typed in — just hit Send there.
              </p>
            </form>
          </>
        ) : sent.error ? (
          <div className="confirm">
            <span className="confirm__badge confirm__badge--error">Not Sent</span>
            <h3 className="modal__title">Couldn't send that</h3>
            <p className="modal__sub">{sent.error}</p>
            <button className="btn btn--primary btn--block" onClick={handleClose}>Close</button>
          </div>
        ) : (
          <div className="confirm">
            <span className="confirm__badge">Request Sent ✓</span>
            <h3 className="modal__title">Thank you, {form.name.split(' ')[0]}</h3>
            <p className="modal__sub">
              {item.name} is now held for {form.eventDate} while we confirm it. Booking ref: {sent.bookingId}.
              A WhatsApp chat should have opened with your request — please hit Send there.
            </p>
            <a className="btn btn--outline btn--block" href={sent.waHref} target="_blank" rel="noreferrer">
              Didn't open? Send via WhatsApp
            </a>
            <button className="btn btn--primary btn--block" onClick={handleClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}