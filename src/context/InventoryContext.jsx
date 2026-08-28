import { createContext, useContext, useState, useCallback } from 'react'
import { ITEMS } from '../data/items.js'

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [items, setItems] = useState(ITEMS)

  // Locks an item the moment a booking is confirmed, and stores the
  // booking details on the item so they can be reused for the invoice.
  const lockItem = useCallback((itemId, booking) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, status: 'locked', booking }
          : it
      )
    )
  }, [])

  const value = { items, lockItem }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
