// src/components/LiveMap.tsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import all data sources
import { truckRoutes } from '../data/truckRoutes';
import { locations as EWasteLocation } from '../data/e-waste';
import { locations as KabadiwalaLocation } from '../data/kabadiwala';
import { locations as HazardousWasteLocation } from '../data/hazardous-waste';
import { locations as ClothRecyclingLocation } from '../data/cloth-recycle';
import { locations as WasteLocation } from '../data/dhalaos';
import { locations as CDWasteLocation } from '../data/debris';
import { locations as sanitaryWasteLocation } from '../data/sanitary';
import { locations as waste2Energy } from '../data/waste2Energy';
import { locations as dumpyard } from '../data/dumpYard';

// Your icon definitions...
const truckIcon = new L.Icon({ iconUrl: '/truck-icon.png', iconSize: [28, 28] });
const eWasteIcon = new L.Icon({ iconUrl: '/e-waste.png', iconSize: [28, 28] });
const kabadiwalaIcon = new L.Icon({ iconUrl: '/kabadiwala.png', iconSize: [28, 28] });
const hazardousIcon = new L.Icon({ iconUrl: '/hazardous.png', iconSize: [37, 37] });
const clothIcon = new L.Icon({ iconUrl: '/cloth.png', iconSize: [37, 37] });
const debrisIcon = new L.Icon({ iconUrl: '/debris.png', iconSize: [37, 37] });
const dhalaosIcon = new L.Icon({ iconUrl: '/dhalaos.png', iconSize: [37, 37] });
const dumpIcon = new L.Icon({ iconUrl: '/dumpYard.png', iconSize: [37, 37] });
const sanitaryIcon = new L.Icon({ iconUrl: '/sanitary.png', iconSize: [37, 37] });
const energyIcon = new L.Icon({ iconUrl: '/waste2Energy.png', iconSize: [37, 37] });

const userLocationIcon = new L.DivIcon({
  html: `<div style="background-color: #3498db; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); width: 14px; height: 14px;"></div>`,
  className: '', // Clears default Leaflet styling
  iconSize: [18, 18],
  iconAnchor: [9, 9], // Centers the icon on the user's coordinate
});

function LocationFinder({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15); // Fly to the user's position
    }
  }, [position, map]);

  return null;
}
// --- EXPANDED PROPS INTERFACE ---
interface LiveMapProps {
  showTrucks: boolean;
  showEWaste: boolean;
  showKabadiwala: boolean;
  showHazardous: boolean;
  showDhalaos: boolean;
  showCloth: boolean;
  showDebris: boolean;
  showSanitary: boolean;
  showEnergy: boolean;
  showDumpyard: boolean;
}

const getInitialIndices = () => {
  const initialState: { [key: string]: number } = {};
  for (const routeName in truckRoutes) {
    initialState[routeName] = 0;
  }
  return initialState;
};

const LiveMap = ({
  showTrucks,
  showEWaste,
  showKabadiwala,
  showHazardous,
  showDhalaos,
  showCloth,
  showDebris,
  showSanitary,
  showEnergy,
  showDumpyard,
}: LiveMapProps) => {
  const [routeIndices, setRouteIndices] = useState(getInitialIndices());
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRouteIndices(prevIndices => {
        const newIndices: { [key: string]: number } = {};
        for (const routeName in prevIndices) {
          const routeData = truckRoutes[routeName as keyof typeof truckRoutes];
          if (routeData && routeData.length > 0) {
            newIndices[routeName] = (prevIndices[routeName] + 1) % routeData.length;
          } else {
            newIndices[routeName] = 0;
          }
        }
        return newIndices;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newUserPosition = new L.LatLng(latitude, longitude);
        setUserPosition(newUserPosition);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []); // The empty array ensures this runs only once

  const getMapCenter = (): L.LatLngExpression => [28.728, 77.165];

  return (
    <MapContainer center={getMapCenter()} zoom={15} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationFinder position={userPosition} />
      {userPosition && (
        <>
          <Circle
            center={userPosition}
            pathOptions={{ color: '#3498db', fillColor: '#3498db', fillOpacity: 0.1 }}
            radius={250}
          />
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </>
      )}
      {/* --- THIS IS THE ONLY BLOCK OF RENDERING LOGIC YOU NEED --- */}

      {showTrucks && truckRoutes && Object.keys(truckRoutes).map((routeName) => {
        const route = truckRoutes[routeName as keyof typeof truckRoutes];
        const index = routeIndices[routeName];
        if (!route || !route.length || index === undefined) return null;
        const position: [number, number] = [route[index].lat, route[index].lng];
        return <Marker key={`truck-${routeName}`} position={position} icon={truckIcon} />;
      })}

      {showEWaste && EWasteLocation && EWasteLocation.map((loc) => (
        <Marker key={`ewaste-${loc.id}`} position={loc.position} icon={eWasteIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showKabadiwala && KabadiwalaLocation && KabadiwalaLocation.map((loc) => (
        <Marker key={`kabadiwala-${loc.id}`} position={loc.position} icon={kabadiwalaIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showHazardous && HazardousWasteLocation && HazardousWasteLocation.map((loc) => (
        <Marker key={`hazardous-${loc.id}`} position={loc.position} icon={hazardousIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showDhalaos && WasteLocation && WasteLocation.map((loc) => (
        <Marker key={`dhalaos-${loc.id}`} position={loc.position} icon={dhalaosIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showCloth && ClothRecyclingLocation && ClothRecyclingLocation.map((loc) => (
        <Marker key={`cloth-${loc.id}`} position={loc.position} icon={clothIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showDebris && CDWasteLocation && CDWasteLocation.map((loc) => (
        <Marker key={`debris-${loc.id}`} position={loc.position} icon={debrisIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showSanitary && sanitaryWasteLocation && sanitaryWasteLocation.map((loc) => (
        <Marker key={`sanitary-${loc.id}`} position={loc.position} icon={sanitaryIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showEnergy && waste2Energy && waste2Energy.map((loc) => (
        <Marker key={`energy-${loc.id}`} position={loc.position} icon={energyIcon}><Popup>{loc.name}</Popup></Marker>
      ))}

      {showDumpyard && dumpyard && dumpyard.map((loc) => (
        <Marker key={`dumpyard-${loc.id}`} position={loc.position} icon={dumpIcon}><Popup>{loc.name}</Popup></Marker>
      ))}
    </MapContainer>
  );
};

export default LiveMap;