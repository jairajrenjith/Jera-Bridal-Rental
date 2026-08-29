// The Admin Portal login still just asks for one password (same as
// before). Behind the scenes it now signs in to a single fixed
// Firebase Auth account — one-time setup:
//   Firebase Console → Authentication → Sign-in method → enable
//   "Email/Password" → Users → Add user → email: (this exact address)
//   → password: whatever you want the admin login password to be.
export const ADMIN_EMAIL = 'admin@jerabridalrental.com'

// Shown in the footer, invoices, and used for tel:/WhatsApp links.
export const SHOP = {
  name: 'Jera Bridal Rental',
  address: 'Kottakkal, Near Bus Stand, Kerala',
  mapUrl: 'https://maps.google.com/maps?q=11.0012965%2C76.0044649&z=17&hl=en',
  phone: '+91 81389 11668',
  phoneDigits: '918138911668',
  email: 'jerabridalrental@gmail.com',
}
