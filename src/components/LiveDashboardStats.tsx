// src/components/LiveDashboardStats.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  unit: string;
  trend: number;
  icon: string;
  color: string;
}

export const LiveDashboardStats = () => {
  const [stats, setStats] = useState<StatCard[]>([
    { label: "Waste Collected Today", value: 234, unit: "kg", trend: 12, icon: "♻️", color: "text-green-600" },
    { label: "Active Pickups", value: 8, unit: "ongoing", trend: 3, icon: "🚛", color: "text-blue-600" },
    { label: "Citizens Active", value: 142, unit: "today", trend: 18, icon: "👥", color: "text-purple-600" },
    { label: "QR Scans Today", value: 67, unit: "scans", trend: 5, icon: "🔲", color: "text-orange-600" },
  ]);

  const [wasteData, setWasteData] = useState([
    { zone: "Zone A - Pitampura", wet: 45, dry: 32, ewaste: 8 },
    { zone: "Zone B - Rohini", wet: 38, dry: 41, ewaste: 12 },
    { zone: "Zone C - Dwarka", wet: 52, dry: 28, ewaste: 5 },
    { zone: "Zone D - Saket", wet: 29, dry: 35, ewaste: 15 },
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [pulse, setPulse] = useState(false);

  // Simulate live updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.value + Math.floor(Math.random() * 3),
        trend: Math.floor(Math.random() * 20) - 5,
      })));
      setWasteData(prev => prev.map(zone => ({
        ...zone,
        wet: zone.wet + Math.floor(Math.random() * 2),
        dry: zone.dry + Math.floor(Math.random() * 2),
      })));
      setLastUpdated(new Date());
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxWaste = Math.max(...wasteData.map(z => z.wet + z.dry + z.ewaste));

  return (
    <div className="space-y-6">
      {/* Live indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Live Zone Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className={`w-2 h-2 rounded-full bg-green-500 ${pulse ? "scale-150" : ""} transition-transform`} />
          <Activity className="h-3 w-3" />
          <span>Updated {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className={`transition-all duration-500 ${pulse ? "shadow-md" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <Badge variant={stat.trend > 0 ? "default" : "secondary"} className="text-xs flex items-center gap-1">
                  {stat.trend > 0 ? <TrendingUp className="h-2 w-2" /> : <TrendingDown className="h-2 w-2" />}
                  {Math.abs(stat.trend)}%
                </Badge>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">{stat.unit}</p>
              <p className="text-xs font-medium mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zone Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span>🗺️</span> Waste by Zone — Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wasteData.map((zone, i) => {
              const total = zone.wet + zone.dry + zone.ewaste;
              const pct = Math.round((total / maxWaste) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{zone.zone}</span>
                    <span className="text-muted-foreground">{total} kg</span>
                  </div>
                  <div className="h-3 bg-muted/30 rounded-full overflow-hidden flex gap-0.5">
                    <div
                      className="h-full bg-green-500 rounded-l-full transition-all duration-1000"
                      style={{ width: `${Math.round((zone.wet / total) * pct)}%` }}
                    />
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${Math.round((zone.dry / total) * pct)}%` }}
                    />
                    <div
                      className="h-full bg-yellow-500 rounded-r-full transition-all duration-1000"
                      style={{ width: `${Math.round((zone.ewaste / total) * pct)}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block"/>Wet: {zone.wet}kg</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full inline-block"/>Dry: {zone.dry}kg</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full inline-block"/>E-waste: {zone.ewaste}kg</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
            📡 Data updates every 5 seconds · Showing live zone performance
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
