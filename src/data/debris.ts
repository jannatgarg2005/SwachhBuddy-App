// src/data/cd-waste.ts
import L from 'leaflet';

export interface CDWasteLocation {
  id: string;
  position: L.LatLngExpression;
  name: string;
  details: string;
}

// Data for Construction & Demolition (C&D) waste recycling plants in Delhi
export const locations: CDWasteLocation[] = [
  {
    id: 'cd-waste-1',
    position: [28.72597, 77.16266], //
    name: 'Jahangirpuri C&D Waste Recycling Plant',
    details: 'Accepts: Construction & demolition debris — concrete, bricks, rubble, etc. It recycles waste into tiles, bricks, and paver blocks. Run by MCD / IL&FS Environmental Infrastructure & Services Limited.'
  },
  {
    id: 'cd-waste-2',
    position: [28.675, 77.2585], // Approximate center-point of the provided coordinate range
    name: 'Shastri Park C&D Processing Facility',
    details: 'Accepts: C&D waste like rubble, concrete, and debris for processing into usable aggregate and tiles. Location: Near EDMC Court Market, Shastri Park, Delhi. Contact (VP): Mr. Shajahan Ali, +91-9566233928.'
  },
  {
     id: 'cd-waste-3',
    position: [28.667010887979018, 77.01549687075023], //28.667010887979018, 77.01549687075023
    name: 'C&D Waste Plant (Rise Eleven Delhi Waste Management Co.)',
    details: 'Accepts: Construction & demolition debris — concrete, bricks, rubble, etc. It recycles waste into tiles, bricks, and paver blocks. Run by MCD / IL&FS Environmental Infrastructure & Services Limited.'
  },
  {
    id: 'cd-waste-4',
    position: [28.565786360507257, 77.39981907075021],
    name: 'C&D Plant Noida',
    details: 'Ramky, C-48, Sector 80, Noida, Uttar Pradesh 201301'
  },
  {
    id: 'cd-waste-5',
    position: [28.503064255868434, 77.07568970506998],
    name: 'Indo Enviro',
    details: '2nd & 3rd Floor, MM Tower, Plot no. 8 & 9, Phase IV, Sector 18, Gurugram, Shahpur, Haryana 122001'
  }
];