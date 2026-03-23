import L from 'leaflet';

export interface sanitaryWasteLocation {
  id: string;
  position: L.LatLngExpression;
  name: string;
  details: string;
}

// Data for Construction & Demolition (C&D) waste recycling plants in Delhi
export const locations: sanitaryWasteLocation[] = [
//  {
//     id: 's-waste-1',
//     position: [28.73973026983622, 77.15731228148483], //
//     name: 'Sanitary Landfill Bhalswa - Swiss mountain',
//     details: 'P5Q4+QWR, Rajiv Nagar, Bhalswa, Delhi, 110042'
//   }, 
  // {
  //   id: 's-waste-2',
  //   position: [28.73973026983622, 77.15731228148483], //
  //   name: 'Sanitary Landfill Bhalswa - Swiss mountain',
  //   details: 'P5Q4+QWR, Rajiv Nagar, Bhalswa, Delhi, 110042'
  // },
]