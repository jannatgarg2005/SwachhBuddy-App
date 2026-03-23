// src/kabadiwalas.ts
import L from 'leaflet';

export interface KabadiwalaLocation {
  id: string;
  position: L.LatLngExpression;
  name: string;
  details: string;
}

// Data for local kabadiwalas, extracted from the recycling locations file
export const locations: KabadiwalaLocation[] = [
  {
    id: 'node/5960737890',
    position: [28.5309101, 77.21717],
    name: 'Wajid',
    details: 'A local recycling point.'
  },
  {
    id: 'node/8284509723',
    position: [28.5169422, 77.1797173],
    name: 'fulchan scrap',
    details: 'Address: ward no. 8, jain mandir dada badi. Phone: 8448012691.'
  },
  {
    id: 'node/8284556362',
    position: [28.6383872, 77.1362982],
    name: 'Recycling Container (Ram Sundar)',
    details: 'Operator: ram sundar. Accepts: Paper, Glass Bottles, Plastic Bottles. Phone: 8860256556.'
  },
  {
    id: 'node/10926234349',
    position: [28.7531465, 77.161122],
    name: 'Khan Enterprises',
    details: 'Address: Swami Shardhanand Colony, Bhalaswa Jahangir Puri. Phone: +91-92895-69489.'
  },
  {
    id: '09899895044',
    position:[28.70888077939019, 77.1132233],
    name: 'Gupta Ji Scarp dealer',
    details: 'Accepts Iron, Paper, plastic'
    // Address: 'csc-1, Dda Market, Shop No- 3, G- 23, Sector 7, Rohini, New Delhi, Delhi 110085',
  },
  {
    id: 'way/1190302279',
    position: [28.7352564, 77.1674323], // [cite: 4]
    name: 'Recycling Centre',
    details: 'A general recycling facility.'
  },
  {
    id: 'way/1300887618',
    position: [28.6453708, 77.1914766], // [cite: 7]
    name: 'Green Waste Recycling',
    details: 'Accepts green waste. Wheelchair access is not available.' // [cite: 6]
  },
  {
    id: 'way/1354899692',
    position: [28.5904655, 77.0416525], // [cite: 8]
    name: 'Green Waste Recycling Centre',
    details: 'Specializes in recycling green waste.'
  },
  {
    id: 'node/8339483098',
    position: [28.6254873, 77.0490079], // [cite: 16]
    name: 'Om Vihar Scrap', // [cite: 15]
    details: 'Accepts: Metal, Paper, Plastic. [cite: 15]'
  },
  {
    id: 'node/8339612102',
    position: [28.5331739, 77.2178316], // [cite: 19]
    name: 'Malik Recycler', // [cite: 18]
    details: 'Accepts: Glass Bottles, Plastic. [cite: 18]'
  },
  {
    id: 'node/8426912850',
    position: [28.505545, 77.1987643], // [cite: 26]
    name: 'Monu Recycler',
    details: 'Operator: Monu[cite: 25]. Address: 370, Neb Sarai. [cite: 25] Phone: 9811697464. [cite: 25]'
  },
  {
    id: 'node/8455252056',
    position: [28.6553854, 77.2252907], // [cite: 31]
    name: 'Arun kabadi vala', // [cite: 30]
    details: 'Accepts: Paper, Plastic, Glass Bottles. [cite: 30] Phone: +911178389249. [cite: 30]'
  },
  {
    id: 'node/11704272915',
    position: [28.5490833, 77.2517979],
    name: 'E-Waste Recycling Centre',
    details: 'A shop dealing in e-waste. [cite: 70]'
  }
];