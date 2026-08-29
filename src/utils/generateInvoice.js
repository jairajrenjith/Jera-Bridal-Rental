import { jsPDF } from 'jspdf'
import { SHOP } from '../config.js'

const GOLD = [180, 140, 40]
const INK = [30, 26, 18]
const MUTED = [120, 110, 90]

/**
 * Builds a PDF invoice for an approved booking. Called from the admin
 * panel (not at request time) since bookings are approved before billed.
 */
export function generateInvoice(booking) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 48
  let y = 56

  doc.setFillColor(...INK)
  doc.rect(0, 0, pageWidth, 90, 'F')
  doc.setTextColor(...GOLD)
  doc.setFont('times', 'bold')
  doc.setFontSize(24)
  doc.text(SHOP.name.toUpperCase(), margin, 48)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(230, 220, 195)
  doc.text('Bridal Wear & Jewellery on Rent', margin, 66)

  y = 130
  doc.setTextColor(...INK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Booking Invoice', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  doc.text(`Invoice No: ${booking.bookingId}`, pageWidth - margin, y - 14, { align: 'right' })
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - margin, y, { align: 'right' })

  y += 26
  doc.setDrawColor(...GOLD); doc.setLineWidth(1); doc.line(margin, y, pageWidth - margin, y)

  y += 26
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...INK)
  doc.text('Billed To', margin, y)
  y += 16
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(60, 55, 45)
  doc.text(`Name: ${booking.customerName}`, margin, y); y += 14
  doc.text(`Phone: ${booking.phone}`, margin, y); y += 14
  doc.text(`Event Date: ${booking.eventDate}`, margin, y); y += 14
  if (booking.address) { doc.text(`Address: ${booking.address}`, margin, y); y += 14 }

  y += 20
  doc.setFillColor(245, 238, 220)
  doc.rect(margin, y, pageWidth - margin * 2, 24, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...INK)
  doc.text('Item', margin + 10, y + 16)
  doc.text('SKU', margin + 230, y + 16)
  doc.text('Rent', margin + 330, y + 16)
  doc.text('Deposit', margin + 420, y + 16)

  y += 40
  doc.setFont('helvetica', 'normal')
  doc.text(String(booking.itemName), margin + 10, y)
  doc.text(String(booking.itemId), margin + 230, y)
  doc.text(`Rs. ${Number(booking.rent).toLocaleString('en-IN')}`, margin + 330, y)
  doc.text(`Rs. ${Number(booking.deposit).toLocaleString('en-IN')}`, margin + 420, y)

  y += 20
  doc.setDrawColor(220, 210, 190); doc.line(margin, y, pageWidth - margin, y)

  const total = Number(booking.rent) + Number(booking.deposit)
  y += 26
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text('Total Payable (Rent + Refundable Deposit)', margin, y)
  doc.text(`Rs. ${total.toLocaleString('en-IN')}`, pageWidth - margin, y, { align: 'right' })

  y += 34
  doc.setFillColor(...INK)
  doc.rect(margin, y, pageWidth - margin * 2, 34, 'F')
  doc.setTextColor(...GOLD); doc.setFont('helvetica', 'bold'); doc.setFontSize(10)
  doc.text(`This item is LOCKED for ${booking.eventDate} and will not be shown to other customers.`, margin + 12, y + 21)

  y = doc.internal.pageSize.getHeight() - 70
  doc.setDrawColor(...GOLD); doc.line(margin, y, pageWidth - margin, y)
  y += 18
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...MUTED)
  doc.text(`${SHOP.name}  |  ${SHOP.email}  |  ${SHOP.phone}`, margin, y)
  y += 14
  doc.text('Deposit is refunded on return of the item in original condition. Late returns are chargeable per day.', margin, y)

  doc.save(`Jera-Bridal-Invoice-${booking.bookingId}.pdf`)
  return doc
}