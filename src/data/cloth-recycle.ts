// src/data/cloth-recycling.ts
import L from 'leaflet';

export interface ClothRecyclingLocation {
  id: string;
  position: L.LatLngExpression;
  name: string;
  details: string;
}

// Data for cloth & textile recycling facilities in Delhi
export const locations: ClothRecyclingLocation[] = [
  {
    id: 'cloth-1',
    position: [28.642152, 77.116060], //
    name: 'Material Library of India (West Delhi Centre)',
    details: 'Accepts: Unwanted clothes and textiles for recycling and upcycling. Location: 48A MIG Flats, Rajouri Garden, New Delhi – PIN 10027. Contact: 9818981855.'
  },
  {
    id: 'cloth-2',
    position: [28.669127, 77.285241], //
    name: 'Material Library of India (East Delhi Centre)',
    details: 'Accepts: Unwanted clothes and textiles for recycling and upcycling. Location: 4/244 Gali No. 5, Bhola Nath Nagar, Shahdara, Delhi – PIN 110032. Contact: 8700982422.'
  },
  {
    id: 'cloth-3',
    position: [28.527958, 77.289787], //
    name: 'GOONJ (Sarita Vihar)',
    details: 'Accepts: Wearable old clothes, surplus usable garments, other household textiles. Location: J-93, Gurjar Rajesh Pilot Marg, Madanpur Khadar Village, Sarita Vihar, New Delhi - 110076. Contact: 011-26972351, 41401216.'
  },
  {
    id: 'cloth-4',
    position: [28.7160, 77.0950],
    name: 'Being Green NGO (Nangloi)',
    details: 'Accepts: Old / used clothes, fabrics. Location: A-69A, Adhyapak Nagar, (Near Hanuman Mandir), Nangloi, Delhi – 110041. Contact: +91-9953732420 or +91-9811330214.'
  },
  {
    id: 'cloth-5',
    position: [28.6360, 77.0900],
    name: 'Recycle Aastha Green Foundation (Uttam Nagar)',
    details: 'Accepts: Textile/clothes donations. Location: Plot No. 9, S/F, B/S R Block Extn, Vani Vihar, Uttam Nagar, West Delhi. Contact: 9582327472.'
  }
];