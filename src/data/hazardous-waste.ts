// src/data/hazardous-waste.ts
import L from 'leaflet';

export interface HazardousWasteLocation {
  id: string;
  position: L.LatLngExpression;
  name: string;
  details: string;
}

// Data for hazardous & biomedical waste facilities in Delhi
export const locations: HazardousWasteLocation[] = [
  {
    id: 'hazardous-1',
    position: [28.7965, 77.0610],
    name: 'TNWML TSDF Facility (Bawana, Delhi)',
    details: 'Accepts: Hazardous wastes including solvents, paints, chemicals, used oil, incinerable wastes, e-waste, lead waste. Location: Plot N1, Sector-5, Bawana Industrial Area, Narela, Delhi – 110039. Contact: +91-40-2311-6100. Website: ramkyenviroengineers.com.'
  },
  {
    id: 'hazardous-2',
    position: [28.7965, 77.0610],
    name: 'Ramky Enviro Engineers Ltd (Bawana, Delhi)',
    details: 'Accepts: Industrial hazardous waste, paints, solvents, oils, chemical residues. Location: Pocket N1, Sector-5, Bawana Industrial Area, Delhi – 110039. Contact: +91-11-2776-2002. Website: ramkyenviroengineers.com.'
  },
  {
    id: 'hazardous-3',
    position: [28.7086, 77.1857],
    name: 'Ramky Hazardous Waste Facility (Model Town, Delhi)',
    details: 'Accepts: Hazardous waste management services. Location: MCD-DMSWML Workshop (behind Police Station), Model Town Phase-1, New Delhi – 110009. Contact: +91-11-2776-2002.'
  },
  {
    id: 'hazardous-4',
    position: [28.7356, 77.1920],
    name: 'Biotic Waste Solutions Pvt. Ltd. (Biomedical Waste)',
    details: 'Accepts: Biomedical and hospital waste — sharps, pathological waste, infectious medical waste. Location: 46, SSI Industrial Area, G.T. Karnal Road, Delhi – 110033. Contact: +91-11-4702-2111. Website: bioticwaste.com.'
  },
  {
    id: 'hazardous-5',
    position: [28.7300, 77.0500],
    name: 'SMS Water Grace BMW Pvt. Ltd.',
    details: 'Accepts: Biomedical waste from hospitals, clinics, labs. Location: Nilothi Sewage Treatment Plant Complex, Nilothi, Delhi – 110041. Contact: +91-11-2835-2007. Website: smsdelhibmw.co.in.'
  }
];