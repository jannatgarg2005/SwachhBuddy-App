// src/components/CarbonTracker.tsx
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf, TrendingUp, TrendingDown, Minus,
  Wind, Car, TreePine, Globe, Flame,
} from "lucide-react";
import { aggregateCarbonStats, getCarbonLog, getCityStats } from "@/lib/carbonData";

const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  wet:       { label: "Wet Waste",       color: "text-green-700",  bg: "bg-green-100"  },
  dry:       { label: "Dry Waste",        color: "text-blue-700",   bg: "bg-blue-100"   },
  hazardous: { label: "Hazardous Waste",  color: "text-red-700",    bg: "bg-red-100"    },
  "e-waste": { label: "E-Waste",          color: "text-yellow-700", bg: "bg-yellow-100" },
};

export const CarbonTracker = () => {
  const stats    = useMemo(() => aggregateCarbonStats(), []);
  const cityData = useMemo(() => getCityStats(), []);
  const log      = useMemo(() => getCarbonLog().slice(-7).reverse(), []); // last 7

  const TrendIcon =
    stats.trend === "up"   ? TrendingUp   :
    stats.trend === "down" ? TrendingDown : Minus;

  const trendColor =
    stats.trend === "up"   ? "text-green-600" :
    stats.trend === "down" ? "text-red-500"   : "text-muted-foreground";

  const trendLabel =
    stats.trend === "up"   ? "More than last week" :
    stats.trend === "down" ? "Less than last week" : "Same as last week";

  // Progress bar width — cap at 100% of a meaningful monthly target (10 kg CO₂)
  const monthlyTarget = 10;
  const monthProgress = Math.min(100, (stats.thisMonthCO2 / monthlyTarget) * 100);

  if (stats.totalDisposals === 0) {
    return (
      <Card className="border-green-200 bg-green-50/40 dark:bg-green-950/20">
        <CardContent className="py-10 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <p className="font-semibold text-green-800 dark:text-green-300">
            Your carbon journey starts with your first classification
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Use the AI Waste Classifier on the dashboard to classify your first waste item.
            Every correct disposal prevents real CO₂ emissions — and we'll track it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Hero stat ── */}
      <Card className="relative overflow-hidden border-green-200 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        <CardContent className="relative z-10 p-5 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/75 text-xs font-medium uppercase tracking-wide mb-1">
                Total CO₂ Prevented
              </p>
              <div className="flex items-end gap-2">
                <span className="text-4xl md:text-5xl font-bold">{stats.totalCO2Saved}</span>
                <span className="text-lg text-white/80 mb-1">kg CO₂e</span>
              </div>
              <p className="text-white/70 text-sm mt-1">
                from {stats.totalDisposals} verified disposal{stats.totalDisposals !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="bg-white/15 rounded-2xl p-3">
              <Globe className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* Equivalents row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <TreePine className="h-4 w-4" />, value: `${stats.totalTrees}`, label: "trees' yearly work" },
              { icon: <Car className="h-4 w-4" />,      value: `${stats.totalKmOffset} km`, label: "driving offset"  },
              { icon: <Wind className="h-4 w-4" />,     value: `${(stats.totalCO2Saved * 1000).toFixed(0)} g`, label: "carbon kept out"  },
            ].map((item, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-2.5 text-center">
                <div className="flex justify-center mb-1 text-white/80">{item.icon}</div>
                <p className="text-sm font-bold">{item.value}</p>
                <p className="text-xs text-white/65 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── This week + this month ── */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">This Week</p>
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.thisWeekCO2} kg</p>
            <p className={`text-xs mt-0.5 ${trendColor}`}>{trendLabel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">This Month</p>
              <span className="text-xs font-medium text-primary">{Math.round(monthProgress)}%</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.thisMonthCO2} kg</p>
            <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${monthProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">of {monthlyTarget} kg monthly goal</p>
          </CardContent>
        </Card>
      </div>

      {/* ── By category breakdown ── */}
      {Object.keys(stats.byCategory).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              CO₂ Saved by Waste Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, co2]) => {
                const cfg = CATEGORY_LABELS[cat] ?? { label: cat, color: "text-foreground", bg: "bg-muted" };
                const maxVal = Math.max(...Object.values(stats.byCategory));
                const pct = Math.round((co2 / maxVal) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-sm font-bold">{co2.toFixed(2)} kg CO₂e</span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      {/* ── Recent activity ── */}
      {log.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Disposals</CardTitle>
            <CardDescription className="text-xs">Last {log.length} classifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {log.map((entry, i) => {
              const cfg = CATEGORY_LABELS[entry.category] ?? { label: entry.category, color: "text-foreground", bg: "bg-muted" };
              const date = new Date(entry.date);
              const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      entry.category === "wet" ? "bg-green-500" :
                      entry.category === "dry" ? "bg-blue-500" :
                      entry.category === "hazardous" ? "bg-red-500" : "bg-yellow-500"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{entry.itemName}</p>
                      <p className="text-xs text-muted-foreground">{dateStr}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold text-green-600">−{entry.co2Saved.toFixed(2)} kg</p>
                    <p className="text-xs text-muted-foreground">CO₂e</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ── City-level stats ── */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            {cityData.wardName} — Collective Impact
          </CardTitle>
          <CardDescription className="text-xs">
            Your ward's combined carbon prevention · {cityData.cityRank}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white dark:bg-background rounded-xl border">
              <p className="text-xl font-bold text-green-600">{cityData.wardCO2Saved}t</p>
              <p className="text-xs text-muted-foreground mt-0.5">CO₂ prevented</p>
            </div>
            <div className="p-3 bg-white dark:bg-background rounded-xl border">
              <p className="text-xl font-bold text-primary">{cityData.wardTrees.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">trees equivalent</p>
            </div>
            <div className="p-3 bg-white dark:bg-background rounded-xl border">
              <p className="text-xl font-bold text-blue-600">{(cityData.wardDisposals / 1000).toFixed(1)}K</p>
              <p className="text-xs text-muted-foreground mt-0.5">verified disposals</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            🌍 Every correct disposal you make is counted here in real time
          </p>
        </CardContent>
      </Card>

      {/* ── Methodology note ── */}
      <p className="text-xs text-muted-foreground text-center px-4">
        CO₂ figures based on IPCC 2006 waste sector emission factors and CPCB India data.
        Savings represent avoided emissions from open burning and landfilling vs. correct disposal.
      </p>
    </div>
  );
};

export default CarbonTracker;