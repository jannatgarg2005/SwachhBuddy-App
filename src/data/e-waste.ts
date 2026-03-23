// src/e-waste-recycling.ts
import L from 'leaflet';

export interface EWasteLocation {
  id: string;
  position: L.LatLngExpression;
  name: string;
  details: string;
}

// Data for e-waste recycling facilities in Delhi
export const locations: EWasteLocation[] = [
  {
    id: 'ewaste-1',
    position: [28.525377, 77.280106],
    name: 'Namo eWaste Management Ltd.',
    details: 'Accepts: Phones, laptops, computers, batteries, all electronic equipment. Location: Plot No. 84, Block-A, Sector-5, Bawana Industrial Area, Delhi – 110039. Contact: namoewaste.com | +91-9311974643.'
  },
  {
    id: 'ewaste-2',
    position: [28.6300, 77.1320],
    name: 'Greentek Reman Pvt. Ltd.',
    details: 'Accepts: IT assets, computers, printers, cables, metals, e-waste. Address: Plot No. 42, Pocket-K, Sector-5, DSIDC, Bawana Industrial Area, Delhi – 110039. Contact: greentekreman.com | +91-9818010100.'
  },
  {
    id: 'ewaste-3',
    position: [28.79966, 77.0328847],
    name: 'E-Waste Recyclers India (EWRI)',
    details: 'Accepts: Mobile phones, PCs, printers, TVs, wires, batteries. Address: A-93, Okhla Industrial Area, Phase-II, New Delhi – 110020. Contact: ewri.in | +91-11-65636265.'
  }
];