// Small helpers for opening a pre-filled WhatsApp chat or email draft.
// Nothing here sends anything automatically — it only builds a link
// that opens WhatsApp/Mail with the text already typed in. A human
// (the customer or the admin) still has to tap Send themselves.

export function toWaNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  return digits.length === 10 ? '91' + digits : digits // assume India if no country code given
}

export function waLink(phone, text) {
  return `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(text)}`
}

export function mailLink(email, subject, body) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Opened by the CUSTOMER, addressed to the shop's WhatsApp number,
// right after they submit a booking request.
export function buildRequestMessage(item, booking, bookingId) {
  return (
    `New Booking Request — Jera Bridal Rental\n` +
    `Item: ${item.name} (${item.id})\n` +
    `Rent: Rs. ${item.price.toLocaleString('en-IN')} | Deposit: Rs. ${item.deposit.toLocaleString('en-IN')}\n` +
    `Name: ${booking.name}\n` +
    `Phone: ${booking.phone}\n` +
    `Event Date: ${booking.eventDate}` +
    (booking.address ? `\nAddress: ${booking.address}` : '') +
    `\nBooking Ref: ${bookingId}`
  )
}

// Opened by the ADMIN, addressed to the customer, right after Approve/Reject.
export function buildDecisionMessage(booking, status) {
  if (status === 'Approved') {
    return (
      `Hi ${booking.customerName}, your booking for ${booking.itemName} ` +
      `(Ref: ${booking.bookingId}) is CONFIRMED for ${booking.eventDate}. ` +
      `We'll be in touch about pickup/delivery. — Jera Bridal Rental`
    )
  }
  return (
    `Hi ${booking.customerName}, we're sorry — we couldn't confirm your ` +
    `booking for ${booking.itemName} (Ref: ${booking.bookingId}) for ${booking.eventDate}. ` +
    `Please reach out and we'll help you find an alternative. — Jera Bridal Rental`
  )
}

// A neutral message for the "WhatsApp"/"Email" buttons in the general
// bookings table, where the status may still be Pending.
export function buildFollowUpMessage(booking) {
  return (
    `Hi ${booking.customerName}, this is Jera Bridal Rental following up on ` +
    `your booking (Ref: ${booking.bookingId}) for ${booking.itemName} on ${booking.eventDate}.`
  )
}