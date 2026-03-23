// src/components/MapDashboard.tsx

import { useState } from 'react';
import LiveMap from './LiveMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Truck, Recycle, Biohazard, Warehouse, Trash2, Shirt, Building, Syringe, Zap, Landmark } from 'lucide-react';

// --- 1. EXPAND THE STATE INTERFACE ---
interface VisibleLayers {
  trucks: boolean;
  eWaste: boolean;
  kabadiwala: boolean;
  hazardous: boolean;
  dhalaos: boolean;
  cloth: boolean;
  debris: boolean;
  sanitary: boolean;
  energy: boolean;
  dumpyard: boolean;
}

const MapDashboard = () => {
  // --- 2. INITIALIZE THE NEW STATE VALUES ---
  const [visibleLayers, setVisibleLayers] = useState<VisibleLayers>({
    trucks: true,
    eWaste: true,
    kabadiwala: true,
    hazardous: true,
    dhalaos: true,
    cloth: true,
    debris: true,
    sanitary: true,
    energy: true,
    dumpyard: true,
  });

  const handleLayerToggle = (layer: keyof VisibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex-grow">
        {/* --- 3. PASS ALL THE NEW PROPS TO THE MAP --- */}
        <LiveMap
          showTrucks={visibleLayers.trucks}
          showEWaste={visibleLayers.eWaste}
          showKabadiwala={visibleLayers.kabadiwala}
          showHazardous={visibleLayers.hazardous}
          showDhalaos={visibleLayers.dhalaos}
          showCloth={visibleLayers.cloth}
          showDebris={visibleLayers.debris}
          showSanitary={visibleLayers.sanitary}
          showEnergy={visibleLayers.energy}
          showDumpyard={visibleLayers.dumpyard}
        />
      </div>

      <div className="p-4">
        <Card>
          <CardHeader><CardTitle>Map Layers & Controls</CardTitle></CardHeader>
          {/* --- 4. ADD THE NEW SWITCHES TO THE PANEL --- */}
          <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Truck className="h-5 w-5 text-primary" /><Label htmlFor="trucks-layer">Live Trucks</Label>
              <Switch id="trucks-layer" checked={visibleLayers.trucks} onCheckedChange={() => handleLayerToggle('trucks')} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Recycle className="h-5 w-5 text-green-600" /><Label htmlFor="eWaste-layer">E-Waste</Label>
              <Switch id="eWaste-layer" checked={visibleLayers.eWaste} onCheckedChange={() => handleLayerToggle('eWaste')} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Warehouse className="h-5 w-5 text-blue-600" /><Label htmlFor="kabadiwala-layer">Kabadiwalas</Label>
              <Switch id="kabadiwala-layer" checked={visibleLayers.kabadiwala} onCheckedChange={() => handleLayerToggle('kabadiwala')} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Biohazard className="h-5 w-5 text-red-600" /><Label htmlFor="hazardous-layer">Hazardous</Label>
              <Switch id="hazardous-layer" checked={visibleLayers.hazardous} onCheckedChange={() => handleLayerToggle('hazardous')} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Trash2 className="h-5 w-5 text-gray-600" /><Label htmlFor="dhalaos-layer">Dhalaos</Label>
              <Switch id="dhalaos-layer" checked={visibleLayers.dhalaos} onCheckedChange={() => handleLayerToggle('dhalaos')} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Shirt className="h-5 w-5 text-pink-500" /><Label htmlFor="cloth-layer">Cloth</Label>
              <Switch id="cloth-layer" checked={visibleLayers.cloth} onCheckedChange={() => handleLayerToggle('cloth')} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Building className="h-5 w-5 text-orange-700" /><Label htmlFor="debris-layer">Debris</Label>
              <Switch id="debris-layer" checked={visibleLayers.debris} onCheckedChange={() => handleLayerToggle('debris')} />
            </div>
            {/* <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Syringe className="h-5 w-5 text-red-700" /><Label htmlFor="sanitary-layer">Sanitary</Label>
              <Switch id="sanitary-layer" checked={visibleLayers.sanitary} onCheckedChange={() => handleLayerToggle('sanitary')} />
            </div> */}
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Zap className="h-5 w-5 text-yellow-500" /><Label htmlFor="energy-layer">Waste-to-Energy</Label>
              <Switch id="energy-layer" checked={visibleLayers.energy} onCheckedChange={() => handleLayerToggle('energy')} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Landmark className="h-5 w-5 text-black" /><Label htmlFor="dumpyard-layer">Dumpyards</Label>
              <Switch id="dumpyard-layer" checked={visibleLayers.dumpyard} onCheckedChange={() => handleLayerToggle('dumpyard')} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapDashboard;