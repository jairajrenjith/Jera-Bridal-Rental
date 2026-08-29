import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy,
} from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { db, auth } from '../firebase.js'
import { ADMIN_EMAIL } from '../config.js'

const collectionsRef = collection(db, 'collections')
const bookingsRef = collection(db, 'bookings')

function friendlyError(err) {
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(err.code)) {
    return 'Wrong password, or the server could not be reached.'
  }
  return err.message || 'Something went wrong.'
}

export async function fetchCollections() {
  try {
    const snap = await getDocs(collectionsRef)
    return { success: true, items: snap.docs.map((d) => ({ id: d.id, ...d.data() })) }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}

// Doubles as the admin login check — signing in to Firebase IS the
// password check now, so this is called both on login and on refresh.
export async function fetchBookings(adminKey) {
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, adminKey)
    const q = query(bookingsRef, orderBy('timestamp', 'desc'))
    const snap = await getDocs(q)
    return { success: true, bookings: snap.docs.map((d) => ({ bookingId: d.id, ...d.data() })) }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}

export async function submitBooking(item, booking) {
  try {
    const bookingId = 'BK-' + Date.now()
    const row = {
      timestamp: new Date().toISOString(),
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      customerName: booking.name,
      phone: booking.phone,
      email: booking.email || '',
      eventDate: booking.eventDate,
      address: booking.address || '',
      status: 'Pending',
      rent: item.price,
      deposit: item.deposit,
    }
    await setDoc(doc(bookingsRef, bookingId), row)
    await updateDoc(doc(collectionsRef, item.id), { status: 'pending' })
    return { success: true, bookingId }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}

export async function updateBookingStatus(adminKey, bookingId, status) {
  try {
    const ref = doc(bookingsRef, bookingId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return { success: false, error: 'Booking not found: ' + bookingId }

    await updateDoc(ref, { status })
    const booking = { bookingId, ...snap.data(), status }

    if (status === 'Approved') await updateDoc(doc(collectionsRef, booking.itemId), { status: 'booked' })
    else if (status === 'Rejected') await updateDoc(doc(collectionsRef, booking.itemId), { status: 'available' })

    return { success: true, booking }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}

export async function updateItem(adminKey, id, fields) {
  try {
    const ref = doc(collectionsRef, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return { success: false, error: 'Item not found: ' + id }
    await updateDoc(ref, fields)
    return { success: true, item: { id, ...snap.data(), ...fields } }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}

export async function addItem(adminKey, fields) {
  try {
    const id = String(fields.id || '').trim()
    if (!id) return { success: false, error: 'Item ID is required.' }
    if (!String(fields.name || '').trim()) return { success: false, error: 'Item name is required.' }

    const ref = doc(collectionsRef, id)
    const existing = await getDoc(ref)
    if (existing.exists()) return { success: false, error: `An item with ID "${id}" already exists.` }

    const item = {
      name: fields.name || '',
      category: fields.category || '',
      price: Number(fields.price) || 0,
      deposit: Number(fields.deposit) || 0,
      size: fields.size || '',
      color: fields.color || '',
      status: fields.status || 'available',
      photo: fields.photo || '',
    }
    await setDoc(ref, item)
    return { success: true, item: { id, ...item } }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}

export async function deleteItem(adminKey, id) {
  try {
    const ref = doc(collectionsRef, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return { success: false, error: 'Item not found: ' + id }
    await deleteDoc(ref)
    return { success: true, id }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}
