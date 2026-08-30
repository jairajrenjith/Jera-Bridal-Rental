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

// Uploads an item photo to ImgBB (free image host, no billing plan
// required) and returns its public URL plus a delete URL. The delete
// URL is kept on the item so we can attempt cleanup if the photo is
// replaced or removed later.
export async function uploadItemPhoto(itemId, file) {
  try {
    const key = import.meta.env.VITE_IMGBB_API_KEY
    if (!key) return { success: false, error: 'Image hosting is not configured (missing VITE_IMGBB_API_KEY).' }

    const formData = new FormData()
    formData.append('image', file)

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (!data.success) return { success: false, error: data.error?.message || 'Upload failed.' }

    return { success: true, url: data.data.url, deleteUrl: data.data.delete_url || '' }
  } catch (err) {
    return { success: false, error: err.message || 'Could not upload the photo.' }
  }
}

// Best-effort removal of a previously uploaded photo from ImgBB. ImgBB's
// delete link is built for a browser click-to-confirm page, so a
// background request can't fully guarantee the file itself is erased on
// their end — but this always clears it out of your app either way.
export async function deleteItemPhoto(deleteUrl) {
  if (!deleteUrl) return { success: true }
  try {
    await fetch(deleteUrl, { mode: 'no-cors' })
  } catch {
    // Ignore — this is best-effort only.
  }
  return { success: true }
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
      photoDeleteUrl: fields.photoDeleteUrl || '',
    }
    await setDoc(ref, item)
    return { success: true, item: { id, ...item } }
  } catch (err) {
    return { success: false, error: friendlyError(err) }
  }
}

export async function deleteBooking(adminKey, bookingId) {
  try {
    const ref = doc(bookingsRef, bookingId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return { success: false, error: 'Booking not found: ' + bookingId }
    await deleteDoc(ref)
    return { success: true, bookingId }
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