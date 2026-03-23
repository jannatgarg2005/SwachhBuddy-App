// src/components/EmployeeMapDashboard.tsx
import React, { useState, useEffect } from 'react';  // ← React imported here fixes React.Fragment error
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Truck, Biohazard, AlertTriangle,
  RefreshCw, Plus, X, CheckCircle, Clock,
  Landmark, Navigation,
} from 'lucide-react';

// ── Icon factory ──────────────────────────────────────────────────────────────
const mkIcon = (emoji: string, size = 32, bg = '#1f2937') =>
  L.divIcon({
    html: `<div style="
      background:${bg};border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,.4);border:2px solid white;">
      <span style="transform:rotate(45deg);font-size:${size * 0.45}px">${emoji}</span>
    </div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

const icons = {
  truck:       mkIcon('🚛', 34, '#15803d'),
  dumpSite:    mkIcon('🏭', 34, '#374151'),
  illegalDump: mkIcon('⚠️', 34, '#dc2626'),
  hazardous:   mkIcon('☣️', 34, '#7c3aed'),
  overflow:    mkIcon('♻️', 34, '#d97706'),
  fireHazard:  mkIcon('🔥', 34, '#ea580c'),
  cleanZone:   mkIcon('✅', 30, '#16a34a'),
  myLocation:  L.divIcon({
    html: `<div style="width:18px;height:18px;background:#2563eb;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,.3)"></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  }),
};

// ── Static data ───────────────────────────────────────────────────────────────
const DUMP_SITES = [
  { id: 'd1', name: 'Bhalswa Landfill',   pos: [28.7518, 77.1636] as [number,number], status: 'critical', capacity: 92, type: 'Landfill',   zone: 'North Delhi' },
  { id: 'd2', name: 'Ghazipur Landfill',  pos: [28.6316, 77.3276] as [number,number], status: 'critical', capacity: 97, type: 'Landfill',   zone: 'East Delhi' },
  { id: 'd3', name: 'Okhla Waste Plant',  pos: [28.5498, 77.2762] as [number,number], status: 'active',   capacity: 65, type: 'Processing', zone: 'South Delhi' },
  { id: 'd4', name: 'Narela Dhalao',      pos: [28.8512, 77.0948] as [number,number], status: 'active',   capacity: 45, type: 'Transfer',   zone: 'North Delhi' },
  { id: 'd5', name: 'Rohini Dhalao',      pos: [28.7295, 77.0966] as [number,number], status: 'moderate', capacity: 58, type: 'Transfer',   zone: 'North West Delhi' },
  { id: 'd6', name: 'Dwarka Waste Depot', pos: [28.5921, 77.0460] as [number,number], status: 'active',   capacity: 40, type: 'Collection', zone: 'South West Delhi' },
  { id: 'd7', name: 'Sahibabad Facility', pos: [28.6730, 77.3415] as [number,number], status: 'moderate', capacity: 72, type: 'Processing', zone: 'East Delhi' },
];

const INITIAL_ILLEGAL = [
  { id: 'i1', name: 'Illegal Dump — Yamuna Bank',      pos: [28.6580, 77.2637] as [number,number], severity: 'high',   reported: '2 hrs ago',   type: 'Mixed Waste',   resolved: false },
  { id: 'i2', name: 'Illegal Dump — Sanjay Colony',   pos: [28.5906, 77.3003] as [number,number], severity: 'medium', reported: '5 hrs ago',   type: 'Construction',  resolved: false },
  { id: 'i3', name: 'Illegal Dump — Rohini Sector 3', pos: [28.7451, 77.1064] as [number,number], severity: 'low',    reported: 'Yesterday',   type: 'Domestic',      resolved: false },
  { id: 'i4', name: 'Fire Hazard — Najafgarh Drain',  pos: [28.6190, 76.9918] as [number,number], severity: 'high',   reported: '30 mins ago', type: 'Burning Waste', resolved: false },
  { id: 'i5', name: 'Overflow — Karol Bagh',          pos: [28.6512, 77.1905] as [number,number], severity: 'medium', reported: '1 hr ago',    type: 'Bin Overflow',  resolved: false },
];

const LIVE_TRUCKS = [
  { id: 't1', name: 'GC-TRUCK-007', pos: [28.6480, 77.2173] as [number,number], route: 'Central Delhi-A', status: 'En Route',   load: 68, driver: 'Ramesh Kumar' },
  { id: 't2', name: 'GC-TRUCK-012', pos: [28.7012, 77.1523] as [number,number], route: 'North Delhi-B',   status: 'Collecting', load: 42, driver: 'Suresh Yadav' },
  { id: 't3', name: 'GC-TRUCK-019', pos: [28.5834, 77.2695] as [number,number], route: 'South Delhi-A',   status: 'Unloading',  load: 95, driver: 'Amit Singh' },
  { id: 't4', name: 'GC-TRUCK-024', pos: [28.6703, 77.3190] as [number,number], route: 'East Delhi-C',    status: 'En Route',   load: 30, driver: 'Vijay Sharma' },
  { id: 't5', name: 'GC-TRUCK-031', pos: [28.6128, 77.0814] as [number,number], route: 'West Delhi-B',    status: 'Collecting', load: 55, driver: 'Deepak Gupta' },
];

const HAZARDOUS = [
  { id: 'h1', name: 'Biomedical Waste — AIIMS',       pos: [28.5672, 77.2100] as [number,number], type: 'Biomedical', level: 'controlled' },
  { id: 'h2', name: 'Chemical Dump — Okhla Ind Area', pos: [28.5360, 77.2850] as [number,number], type: 'Chemical',   level: 'high' },
  { id: 'h3', name: 'E-Waste Hub — Mustafabad',       pos: [28.7256, 77.2924] as [number,number], type: 'E-Waste',    level: 'moderate' },
];

// ── Map centring helper ───────────────────────────────────────────────────────
const SetView = ({ center, zoom }: { center: [number,number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, zoom]);
  return null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const capacityColor = (cap: number) =>
  cap >= 90 ? '#dc2626' : cap >= 70 ? '#d97706' : '#16a34a';

const severityColor = (s: string) =>
  s === 'high' ? '#dc2626' : s === 'medium' ? '#d97706' : '#16a34a';

const severityBg = (s: string) =>
  s === 'high'
    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
    : s === 'medium'
    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
    : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';

// ─────────────────────────────────────────────────────────────────────────────
export const EmployeeMapDashboard = () => {
  const [layers, setLayers] = useState({
    trucks: true, dumpSites: true, illegalDumps: true,
    hazardous: true, zones: true,
  });

  const [illegalSites, setIllegalSites] = useState(INITIAL_ILLEGAL);
  const [userPos, setUserPos]           = useState<[number,number] | null>(null);
  const [mapCenter]                     = useState<[number,number]>([28.6139, 77.2090]);
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [reportForm, setReportForm]     = useState({ type: 'Mixed Waste', severity: 'medium', notes: '' });
  const [lastRefresh, setLastRefresh]   = useState(new Date());

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => setUserPos([28.6139, 77.2090]),
    );
  }, []);

  const toggle = (k: keyof typeof layers) =>
    setLayers(prev => ({ ...prev, [k]: !prev[k] }));

  const resolveIllegal = (id: string) =>
    setIllegalSites(prev => prev.map(s => s.id === id ? { ...s, resolved: true } : s));

  const activeIllegal = illegalSites.filter(s => !s.resolved);
  const highPriority  = activeIllegal.filter(s => s.severity === 'high').length;

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 md:p-4 border-b bg-muted/30">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg"><Truck className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-xs text-muted-foreground">Live Trucks</p><p className="text-xl font-bold">{LIVE_TRUCKS.length}</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><Landmark className="h-5 w-5 text-gray-600" /></div>
            <div><p className="text-xs text-muted-foreground">Dump Sites</p><p className="text-xl font-bold">{DUMP_SITES.length}</p></div>
          </CardContent>
        </Card>
        <Card className={`border-0 shadow-sm ${highPriority > 0 ? 'ring-2 ring-red-400' : ''}`}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Illegal Dumps</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold">{activeIllegal.length}</p>
                {highPriority > 0 && <Badge className="bg-red-500 text-white text-xs px-1.5">{highPriority} HIGH</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg"><Biohazard className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-xs text-muted-foreground">Hazardous</p><p className="text-xl font-bold">{HAZARDOUS.length}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Main area */}
      <div className="flex flex-col md:flex-row flex-1 gap-0 overflow-hidden">

        {/* Map */}
        <div className="flex-1 min-h-[400px] md:min-h-0 relative">
          <MapContainer
            center={mapCenter} zoom={11}
            style={{ height: '100%', width: '100%', minHeight: 400 }}
            zoomControl={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

            {/* User location */}
            {userPos && (
              <>
                <Marker position={userPos} icon={icons.myLocation}>
                  <Popup><b>📍 Your Location</b></Popup>
                </Marker>
                {layers.zones && <Circle center={userPos} radius={2000} color="#2563eb" fillColor="#2563eb" fillOpacity={0.06} weight={2} dashArray="6,6" />}
              </>
            )}

            {/* Live trucks */}
            {layers.trucks && LIVE_TRUCKS.map(t => (
              <Marker key={t.id} position={t.pos} icon={icons.truck}>
                <Popup>
                  <div className="min-w-[180px] space-y-1">
                    <p className="font-bold text-green-700">{t.name}</p>
                    <p className="text-xs">🛣 Route: {t.route}</p>
                    <p className="text-xs">👷 Driver: {t.driver}</p>
                    <p className="text-xs">📦 Load: <span className={t.load > 80 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{t.load}%</span></p>
                    <Badge className={t.status === 'Unloading' ? 'bg-blue-500' : t.status === 'Collecting' ? 'bg-yellow-500' : 'bg-green-500'} style={{ fontSize: 10 }}>{t.status}</Badge>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* ✅ FIXED: React imported so React.Fragment works correctly */}
            {layers.dumpSites && DUMP_SITES.map(d => (
              <React.Fragment key={d.id}>
                <Marker position={d.pos} icon={d.status === 'critical' ? mkIcon('🏭', 36, '#dc2626') : icons.dumpSite}>
                  <Popup>
                    <div className="min-w-[200px] space-y-1.5">
                      <p className="font-bold">{d.name}</p>
                      <p className="text-xs text-gray-500">{d.type} • {d.zone}</p>
                      <div>
                        <p className="text-xs mb-1">Capacity: <span className="font-bold" style={{ color: capacityColor(d.capacity) }}>{d.capacity}%</span></p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${d.capacity}%`, background: capacityColor(d.capacity) }} />
                        </div>
                      </div>
                      <Badge className={d.status === 'critical' ? 'bg-red-500' : d.status === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'} style={{ fontSize: 10 }}>
                        {d.status.toUpperCase()}
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={d.pos}
                  radius={d.capacity > 85 ? 600 : 300}
                  color={capacityColor(d.capacity)}
                  fillColor={capacityColor(d.capacity)}
                  fillOpacity={0.08}
                  weight={1.5}
                />
              </React.Fragment>
            ))}

            {/* Illegal dumps */}
            {layers.illegalDumps && activeIllegal.map(s => (
              <Marker key={s.id} position={s.pos}
                icon={s.type === 'Burning Waste' ? icons.fireHazard : s.type === 'Bin Overflow' ? icons.overflow : icons.illegalDump}>
                <Popup>
                  <div className="min-w-[200px] space-y-1.5">
                    <p className="font-bold text-red-700">{s.name}</p>
                    <p className="text-xs text-gray-500">Type: {s.type} • Reported: {s.reported}</p>
                    <Badge style={{ background: severityColor(s.severity), fontSize: 10 }}>
                      {s.severity.toUpperCase()} PRIORITY
                    </Badge>
                    <div className="pt-1">
                      <button className="text-xs text-green-700 font-semibold hover:underline" onClick={() => resolveIllegal(s.id)}>
                        ✅ Mark as Resolved
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Hazardous */}
            {layers.hazardous && HAZARDOUS.map(h => (
              <Marker key={h.id} position={h.pos} icon={icons.hazardous}>
                <Popup>
                  <div className="min-w-[180px] space-y-1">
                    <p className="font-bold text-purple-700">{h.name}</p>
                    <p className="text-xs">Type: {h.type}</p>
                    <Badge className={h.level === 'high' ? 'bg-red-500' : h.level === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'} style={{ fontSize: 10 }}>
                      {h.level.toUpperCase()}
                    </Badge>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Refresh overlay */}
          <button
            onClick={() => setLastRefresh(new Date())}
            className="absolute top-3 right-3 z-[1000] bg-white dark:bg-gray-900 border shadow-md rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <RefreshCw className="h-3.5 w-3.5 text-green-600" />
            Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </button>

          {/* Report button */}
          <button
            onClick={() => setShowReportPanel(true)}
            className="absolute bottom-4 right-3 z-[1000] bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-semibold transition-all">
            <Plus className="h-4 w-4" /> Report Illegal Dump
          </button>
        </div>

        {/* Side panel */}
        <div className="w-full md:w-80 flex flex-col overflow-hidden border-l">

          {/* Layer toggles */}
          <div className="p-3 border-b bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Map Layers</p>
            <div className="space-y-2">
              {[
                { key: 'trucks',       icon: <Truck className="h-4 w-4 text-green-600" />,         label: 'Live Trucks' },
                { key: 'dumpSites',    icon: <Landmark className="h-4 w-4 text-gray-600" />,       label: 'Dump Sites' },
                { key: 'illegalDumps', icon: <AlertTriangle className="h-4 w-4 text-red-600" />,   label: 'Illegal Dumps' },
                { key: 'hazardous',    icon: <Biohazard className="h-4 w-4 text-purple-600" />,    label: 'Hazardous' },
                { key: 'zones',        icon: <Navigation className="h-4 w-4 text-blue-600" />,     label: 'Your Zone' },
              ].map(({ key, icon, label }) => (
                <div key={key} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-background border">
                  <div className="flex items-center gap-2">{icon}<span className="text-sm">{label}</span></div>
                  <Switch checked={layers[key as keyof typeof layers]} onCheckedChange={() => toggle(key as keyof typeof layers)} />
                </div>
              ))}
            </div>
          </div>

          {/* Active reports list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active Reports</p>
              <Badge variant="secondary" className="text-xs">{activeIllegal.length} active</Badge>
            </div>

            {activeIllegal.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-semibold">All clear!</p>
                <p className="text-xs">No active illegal dumps reported</p>
              </div>
            )}

            {activeIllegal.map(s => (
              <Card key={s.id} className="border-l-4 shadow-sm" style={{ borderLeftColor: severityColor(s.severity) }}>
                <CardContent className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold leading-tight">{s.name}</p>
                    <Badge className={`${severityBg(s.severity)} text-xs flex-shrink-0 border-0`}>{s.severity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.type}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{s.reported}</span>
                    <button onClick={() => resolveIllegal(s.id)} className="text-xs text-green-700 dark:text-green-400 font-semibold hover:underline flex items-center gap-0.5">
                      <CheckCircle className="h-3 w-3" /> Resolve
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Capacity alerts */}
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Capacity Alerts</p>
              {DUMP_SITES.filter(d => d.capacity >= 70).map(d => (
                <Card key={d.id} className="mb-2 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold">{d.name}</p>
                      <span className="text-xs font-bold" style={{ color: capacityColor(d.capacity) }}>{d.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${d.capacity}%`, background: capacityColor(d.capacity) }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{d.zone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportPanel && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex items-end sm:items-center justify-center p-3">
          <Card className="w-full max-w-md shadow-2xl rounded-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" /> Report Illegal Dump
              </CardTitle>
              <button onClick={() => setShowReportPanel(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-1.5 block">Waste Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Mixed Waste','Construction','Domestic','Burning Waste','Bin Overflow','Hazardous'].map(t => (
                    <button key={t} onClick={() => setReportForm(p => ({ ...p, type: t }))}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all
                        ${reportForm.type === t ? 'bg-red-600 text-white border-red-600' : 'hover:bg-muted border-border'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-1.5 block">Severity</Label>
                <div className="flex gap-2">
                  {['low','medium','high'].map(s => (
                    <button key={s} onClick={() => setReportForm(p => ({ ...p, severity: s }))}
                      className={`flex-1 text-xs py-2 px-3 rounded-lg border font-semibold capitalize transition-all
                        ${reportForm.severity === s
                          ? s === 'high' ? 'bg-red-600 text-white border-red-600'
                            : s === 'medium' ? 'bg-yellow-500 text-white border-yellow-500'
                            : 'bg-green-600 text-white border-green-600'
                          : 'hover:bg-muted border-border'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-1.5 block">Notes (optional)</Label>
                <textarea
                  rows={3}
                  value={reportForm.notes}
                  onChange={e => setReportForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Describe what you see..."
                  className="w-full text-sm rounded-lg border border-border bg-background p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowReportPanel(false)}>Cancel</Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                  const newReport = {
                    id: `i${Date.now()}`,
                    name: `Illegal Dump — ${reportForm.type} (New Report)`,
                    pos: userPos ?? [28.6139, 77.2090] as [number,number],
                    severity: reportForm.severity,
                    reported: 'Just now',
                    type: reportForm.type,
                    resolved: false,
                  };
                  setIllegalSites(prev => [newReport, ...prev]);
                  setShowReportPanel(false);
                  setReportForm({ type: 'Mixed Waste', severity: 'medium', notes: '' });
                }}>
                  <Plus className="h-4 w-4 mr-1" /> Submit Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};