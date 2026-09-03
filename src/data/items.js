// ITEMS now lives in the "Collections" Google Sheet — see
// google-apps-script/Code.gs. This file only keeps the static filter
// categories and the "what we rent" grid content.

export const CATEGORIES = ['All', 'Bridal Dress', 'Jewellery', 'Mehendi']

export const WHAT_WE_RENT = [
  { title: 'Bridal Lehengas', desc: 'Kanjeevaram, Banarasi and designer lehengas in a full range of colours and sizes.' },
  { title: 'Wedding Sarees', desc: 'Kasavu, silk and half-sarees for muhurtham, reception and sangeet.' },
  { title: 'Groom & Sherwani Sets', desc: 'Sherwanis, Indo-western sets and accessories for the groom and family.' },
  { title: 'Bridal Jewellery', desc: 'Temple sets, kemp stone sets, haram, vaddanam and matching earrings.' },
  { title: 'Reception Gowns', desc: 'Designer gowns for reception, engagement and pre-wedding functions.' },
  { title: 'Accessories', desc: 'Maang tikka, hair accessories, clutches and dupattas to complete the look.' },
]

// Curated example collections shown as expandable slides in the "Our
// Collections" section on the home page. Edit title/desc/image freely —
// image paths point into /public/images, so they just need to match the
// filenames placed there.
export const CURATED_COLLECTIONS = [
  {
    title: 'Indo-Western Draped Gown',
    desc: 'A statement anarkali-gown hybrid in navy and antique gold, finished with a sheer embellished cape dupatta for a modern silhouette.',
    image: '/images/1.png',
  },
  {
    title: 'Crimson Bridal Lehenga',
    desc: 'Dense zardozi and stonework on a deep red base, finished with a matching net dupatta — a classic muhurtham choice.',
    image: '/images/2.png',
  },
  {
    title: 'Noir Reception Gown',
    desc: 'A sleeveless ball gown in black with hand-embroidered florals and a structured collar, built for the reception spotlight.',
    image: '/images/3.png',
  },
  {
    title: 'Ivory Cape Gown',
    desc: 'Pearl-scalloped embroidery layered under a sheer cape in soft ivory, perfect for an engagement or pre-wedding shoot.',
    image: '/images/4.png',
  },
  {
    title: 'Maroon Sharara Set',
    desc: 'A heavily embroidered kurta and sharara in deep maroon, paired with a floral net dupatta for sangeet and family functions.',
    image: '/images/5.png',
  },
  {
    title: 'Antique Bronze Bridal Lehenga',
    desc: 'Dense gold thread and stone embroidery on a bronze base, with a flowing maroon net dupatta veil for full bridal grandeur.',
    image: '/images/6.png',
  },
  {
    title: 'Golden Sequin Lehenga',
    desc: 'A mustard-gold lehenga in sequinned georgette with a matching dupatta, radiant under both daylight and reception lighting.',
    image: '/images/7.png',
  },
]