import L from 'leaflet';

export interface dumpYard {
  id: string;
  position: L.LatLngExpression;
  name: string;
  details: string;
}

export const locations : dumpYard[] = [
    {
    id: 'd-waste-1',
    position: [28.74133234397599, 77.1581069107587], //
    name: 'MCD Dumping Ground',
    details: 'Rajiv Nagar, Bhalswa, Delhi, 110042'
  },
  {
    id: 'd-waste-2',
    position: [28.740542149794965, 77.15882574274224], //
    name: 'Bhalswa Dumping Ground',
    details: 'P5R5+4GW, Rajiv Nagar, Bhalswa, Delhi, 110042'
  },
   {
    id: 'd-waste-3',
    position: [28.62524941954813, 77.32804795561863], //
    name: 'Ghazipur Landfill (Open Pit Dump Yard)',
    details: 'J8GH+265, Ghazipur Dairy Farm, Ghazipur, New Delhi, Delhi, 110096'
  },
   {
    id: 'd-waste-4',
    position: [28.621430299112575, 77.07085762863208], //
    name: 'MCD Dumping Ground',
    details: 'J3CC+F89, Pankha Rd, Block A1, Janakpuri, Delhi, 110059'
  },
   {
    id: 'd-waste-5',
    position: [28.73973026983622, 77.15731228148483], //
    name: 'Sanitary Landfill Bhalswa - Swiss mountain',
    details: 'P5Q4+QWR, Rajiv Nagar, Bhalswa, Delhi, 110042'
  },
]