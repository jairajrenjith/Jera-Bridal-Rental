# Jera Bridal Rental — Website

A React + Vite website for a bridal wear & jewellery rental business.
Black background, gold accents, and a working in-browser demo of the
core workflow: browse stock → check availability → book & lock an item →
get an auto-generated PDF invoice.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

Requires Node.js 18+.

## File structure

```
jera-bridal-rental/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # page layout / composition
    ├── index.css                 # design system (colors, type, components)
    ├── data/
    │   └── items.js              # catalog data: dresses, jewellery, prices, photos
    ├── context/
    │   └── InventoryContext.jsx  # in-memory stock state + lockItem()
    ├── utils/
    │   └── generateInvoice.js    # builds & downloads the PDF invoice (jsPDF)
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── WhatWeRent.jsx        # "what we rent out" category grid
        ├── StockList.jsx         # filterable catalog grid (the "stock list")
        ├── ItemCard.jsx          # single item: photo, price, availability, Book button
        ├── BookingModal.jsx      # booking form -> locks item -> triggers invoice
        ├── HowItWorks.jsx
        └── Footer.jsx
```

## How each requirement maps to the code

- **Stock list with price + photo** — `src/data/items.js` holds the
  catalog; `StockList.jsx` + `ItemCard.jsx` render it as a filterable
  grid with photo, rent price and deposit for each piece.
- **Booking locks the dress/jewellery** — `InventoryContext.jsx` holds
  stock status in React state. Confirming the form in
  `BookingModal.jsx` calls `lockItem()`, which flips that item's status
  to `locked` app-wide, immediately hiding it from other shoppers.
- **Availability display** — `ItemCard.jsx` shows an Available / Locked
  / Booked pill on every photo, and `StockList.jsx` has an
  Available / Locked filter plus a live "X of Y available" counter.
- **What we rent out** — `WhatWeRent.jsx`, driven by the
  `WHAT_WE_RENT` list in `src/data/items.js`.
- **Automatic PDF bill to the customer** — `utils/generateInvoice.js`
  uses `jspdf` to build a branded invoice (item, rent, deposit, event
  date, customer details) and downloads it the moment a booking is
  confirmed.

## Important: this is a front-end demo, not a live backend

Everything above works entirely in the browser. There is no server, so:

- **Stock state resets on page refresh** — locked items go back to
  "available" because nothing is saved anywhere. You'll want a real
  database (e.g. via Firebase, Supabase, or your own Node/Express +
  Postgres API) so stock persists and stays in sync across visitors.
- **"Send PDF to customer" currently means "download it in their
  browser"** — there's no email/WhatsApp step yet. Real delivery needs
  a backend endpoint (e.g. using Nodemailer, SendGrid, or the WhatsApp
  Business API) that takes the same invoice data and emails/sends it.
  `generateInvoice()` already isolates the PDF-building logic, so it's
  easy to reuse: change the final `doc.save(...)` to
  `doc.output('blob')` and POST that blob to your backend instead.
- **Photos are placeholders** (`picsum.photos`) — replace the `photo`
  URLs in `src/data/items.js` with your real product photos, e.g. in
  `public/items/...` or a cloud bucket.
- **Business details are placeholders** — swap the phone number,
  email and address in `Footer.jsx` and `generateInvoice.js` for the
  real ones.

## Suggested next steps for a production version

1. Move `ITEMS` from `src/data/items.js` into a real database and
   fetch it with `useEffect`/an API call instead of a static import.
2. Add an admin view (or a simple CMS) so stock and prices can be
   updated without touching code.
3. Add a backend route that emails/WhatsApps the generated PDF instead
   of just downloading it.
4. Add authentication if you want staff-only actions (e.g. unlocking
   an item after a booking is cancelled).

## Design notes

- **Palette**: near-black background (`#0a0806`) with a warm gold
  accent (`#d4af37`), inspired by the gold *kasavu* border on Kerala
  wedding sarees — see the `.kasavu-rule` divider in `index.css`.
- **Type**: Cormorant Garamond for display/headings, Jost for body
  text, IBM Plex Mono for prices/SKUs and small labels.
