import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { fetchCollections, submitBooking as apiSubmitBooking } from '../utils/api.js'

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchCollections()
      if (res.success) { setItems(res.items); setError(null) }
      else setError(res.error || 'Could not load the collection.')
    } catch (err) {
      setError('Could not reach the server. Check the Firebase config in src/firebase.js.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Sends a booking request to the sheet + WhatsApp, and marks the item
  // "pending" locally so it's hidden for everyone else while it's reviewed.
  const requestBooking = useCallback(async (item, booking) => {
    const res = await apiSubmitBooking(item, booking)
    if (res.success) {
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: 'pending' } : it)))
    }
    return res
  }, [])

  const value = { items, loading, error, refresh, requestBooking }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}