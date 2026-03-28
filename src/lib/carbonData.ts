// src/lib/carbonData.ts
// CO₂ emission factors based on IPCC waste sector data and
// India-specific research (CPCB 2022, Greenhouse Gas Platform India)

export interface CarbonEntry {
  date: string;           // ISO date string
  category: string;       // wet | dry | hazardous | e-waste
  itemName: string;
  co2Saved: number;       // kg CO₂ equivalent
  treesEquivalent: number;
  kmDrivingEquivalent: number;
}

// ── CO₂ saved per single disposal event (kg CO₂e) ────────────────────────────
// Methodology: emission factor for open burning / landfill minus emission
// factor for correct disposal method (composting / recycling / authorised treatment)
// Sources: IPCC 2006 Guidelines Vol 5, CPCB SWM Report 2022
export const CO2_FACTORS: Record<string, number> = {
  wet:       0.52,   // prevented landfill methane + avoided open burning
  dry:       1.10,   // recycling offset vs. landfill + avoided open burning (plastic avg)
  hazardous: 2.20,   // prevented toxic combustion + avoided groundwater contamination
  "e-waste": 3.80,   // prevented heavy metal smelting + avoided informal burning
  unknown:   0.30,
};

// One tree absorbs ~21 kg CO₂/year → per disposal event fraction
const KG_CO2_PER_TREE_YEAR = 21;
// Average Indian car emits ~0.12 kg CO₂ per km
const KG_CO2_PER_KM = 0.12;

export function calculateCarbonImpact(category: string): {
  co2Saved: number;
  treesEquivalent: number;
  kmDrivingEquivalent: number;
} {
  const co2 = CO2_FACTORS[category] ?? CO2_FACTORS.unknown;
  return {
    co2Saved: co2,
    treesEquivalent: parseFloat((co2 / KG_CO2_PER_TREE_YEAR).toFixed(3)),
    kmDrivingEquivalent: parseFloat((co2 / KG_CO2_PER_KM).toFixed(1)),
  };
}

// ── localStorage persistence ──────────────────────────────────────────────────
const STORAGE_KEY = "swachh_carbon_log";

export function saveCarbonEntry(entry: CarbonEntry): void {
  try {
    const existing = getCarbonLog();
    existing.push(entry);
    // Keep last 365 entries
    const trimmed = existing.slice(-365);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

export function getCarbonLog(): CarbonEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ── Aggregation helpers ───────────────────────────────────────────────────────
export interface CarbonStats {
  totalCO2Saved: number;
  totalTrees: number;
  totalKmOffset: number;
  thisMonthCO2: number;
  thisWeekCO2: number;
  totalDisposals: number;
  byCategory: Record<string, number>;
  trend: "up" | "down" | "same";   // compared to last week
}

export function aggregateCarbonStats(): CarbonStats {
  const log = getCarbonLog();
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const startOfLastWeek = new Date(now);
  startOfLastWeek.setDate(now.getDate() - 14);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalCO2 = 0;
  let thisMonthCO2 = 0;
  let thisWeekCO2 = 0;
  let lastWeekCO2 = 0;
  const byCategory: Record<string, number> = {};

  for (const entry of log) {
    const d = new Date(entry.date);
    totalCO2 += entry.co2Saved;

    if (d >= startOfMonth) thisMonthCO2 += entry.co2Saved;
    if (d >= startOfWeek)  thisWeekCO2  += entry.co2Saved;
    if (d >= startOfLastWeek && d < startOfWeek) lastWeekCO2 += entry.co2Saved;

    byCategory[entry.category] = (byCategory[entry.category] ?? 0) + entry.co2Saved;
  }

  const trend: "up" | "down" | "same" =
    thisWeekCO2 > lastWeekCO2 + 0.01 ? "up" :
    thisWeekCO2 < lastWeekCO2 - 0.01 ? "down" : "same";

  return {
    totalCO2Saved:       parseFloat(totalCO2.toFixed(2)),
    totalTrees:          parseFloat((totalCO2 / KG_CO2_PER_TREE_YEAR).toFixed(2)),
    totalKmOffset:       parseFloat((totalCO2 / KG_CO2_PER_KM).toFixed(1)),
    thisMonthCO2:        parseFloat(thisMonthCO2.toFixed(2)),
    thisWeekCO2:         parseFloat(thisWeekCO2.toFixed(2)),
    totalDisposals:      log.length,
    byCategory,
    trend,
  };
}

// ── City-level mock aggregate (replace with Firestore query in production) ───
export function getCityStats() {
  const personal = aggregateCarbonStats();
  // Simulate city-level data as 50,000× personal (ward of ~50k citizens)
  const multiplier = Math.max(50000, 1);
  return {
    wardCO2Saved:    parseFloat((personal.totalCO2Saved * multiplier / 1000).toFixed(1)), // tonnes
    wardTrees:       Math.round(personal.totalTrees * multiplier),
    wardDisposals:   personal.totalDisposals * multiplier,
    wardName:        "Lajpat Nagar II",
    cityRank:        "#4 in Delhi",
  };
}