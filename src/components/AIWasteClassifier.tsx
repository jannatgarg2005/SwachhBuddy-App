// src/components/AIWasteClassifier.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera, Upload, Loader2, Recycle,
  AlertTriangle, Leaf, Zap, X, CheckCircle, RefreshCw, Wind,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/PointsContext";
import { calculateCarbonImpact, saveCarbonEntry } from "@/lib/carbonData";

interface ClassificationResult {
  category: "wet" | "dry" | "hazardous" | "e-waste" | "unknown";
  confidence: number;
  itemName: string;
  description: string;
  disposalInstructions: string;
  binColor: string;
  recyclable: boolean;
  tip: string;
  points: number;
}

interface AIWasteClassifierProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryConfig = {
  wet: {
    bg: "bg-green-500",
    badge: "bg-green-50 text-green-800 border-green-200",
    glow: "shadow-green-200",
    icon: <Leaf className="h-6 w-6" />,
    binColor: "Green Bin",
    points: 20,
  },
  dry: {
    bg: "bg-blue-500",
    badge: "bg-blue-50 text-blue-800 border-blue-200",
    glow: "shadow-blue-200",
    icon: <Recycle className="h-6 w-6" />,
    binColor: "Blue Bin",
    points: 15,
  },
  hazardous: {
    bg: "bg-red-500",
    badge: "bg-red-50 text-red-800 border-red-200",
    glow: "shadow-red-200",
    icon: <AlertTriangle className="h-6 w-6" />,
    binColor: "Red Bin",
    points: 30,
  },
  "e-waste": {
    bg: "bg-yellow-500",
    badge: "bg-yellow-50 text-yellow-800 border-yellow-200",
    glow: "shadow-yellow-200",
    icon: <Zap className="h-6 w-6" />,
    binColor: "Yellow Bin",
    points: 35,
  },
  unknown: {
    bg: "bg-gray-400",
    badge: "bg-gray-50 text-gray-800 border-gray-200",
    glow: "shadow-gray-200",
    icon: <Recycle className="h-6 w-6" />,
    binColor: "General Bin",
    points: 5,
  },
};

const DEMO_RESULT: ClassificationResult = {
  category: "dry",
  confidence: 92,
  itemName: "Plastic PET Bottle",
  description: "A used PET plastic water bottle — dry, recyclable waste.",
  disposalInstructions:
    "Rinse the bottle to remove residue. Remove the cap (different plastic type). Flatten it to save space, then place in the Blue (Dry Waste) bin.",
  binColor: "Blue Bin",
  recyclable: true,
  tip: "PET bottles (code ♳) are India's most recycled plastic. Clean bottles fetch ₹10–15/kg at kabadiwallas!",
  points: 15,
};

const isLocalhost = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const AIWasteClassifier = ({ isOpen, onClose }: AIWasteClassifierProps) => {
  const [image, setImage]                 = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [result, setResult]               = useState<ClassificationResult | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [isDemoMode, setIsDemoMode]       = useState(false);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const cameraInputRef                    = useRef<HTMLInputElement>(null);
  const { toast }                         = useToast();
  const { earn }                          = usePoints();

  if (!isOpen) return null;

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setPointsAwarded(false);
      setIsDemoMode(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);

    if (isLocalhost()) {
      await new Promise((r) => setTimeout(r, 1500));
      setResult(DEMO_RESULT);
      setIsDemoMode(true);
      setIsAnalyzing(false);
      return;
    }

    try {
      const base64Data = image.split(",")[1];
      const mimeType   = image.split(";")[0].split(":")[1];

      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Classify API error:", response.status, responseText);
        throw new Error(`API error ${response.status}`);
      }

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid JSON from classify API");
      }

      const category = (data.category as string) || "unknown";
      const cfg =
        categoryConfig[category as keyof typeof categoryConfig] ||
        categoryConfig.unknown;

      setResult({
        ...(data as Omit<ClassificationResult, "points">),
        points: cfg.points,
      } as ClassificationResult);
      setIsDemoMode(false);

    } catch (err) {
      console.error("Classification error:", err);
      toast({
        title: "Classification failed",
        description: "Could not reach the AI classifier. Showing a demo result.",
        variant: "destructive",
      });
      setResult(DEMO_RESULT);
      setIsDemoMode(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAwardPoints = () => {
    if (!result || pointsAwarded || isDemoMode) return;

    // Award points
    earn(result.points, { source: "ai-classifier" });

    // Save carbon entry to localStorage
    const carbon = calculateCarbonImpact(result.category);
    saveCarbonEntry({
      date: new Date().toISOString(),
      category: result.category,
      itemName: result.itemName,
      co2Saved: carbon.co2Saved,
      treesEquivalent: carbon.treesEquivalent,
      kmDrivingEquivalent: carbon.kmDrivingEquivalent,
    });

    setPointsAwarded(true);
    toast({
      title: `+${result.points} points & ${carbon.co2Saved} kg CO₂ prevented! 🌱`,
      description: `${result.itemName} correctly disposed. Check your Carbon Tracker for impact.`,
    });
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setPointsAwarded(false);
    setIsDemoMode(false);
  };

  const cfg = result
    ? categoryConfig[result.category] || categoryConfig.unknown
    : null;

  // Carbon impact for the current result
  const carbonImpact = result ? calculateCarbonImpact(result.category) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-auto">
      <Card className="w-full max-w-lg shadow-2xl border-0 rounded-2xl overflow-hidden">

        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Waste Classifier</CardTitle>
                <CardDescription>Powered by Groq Vision AI</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">

          {/* Step 1 — Upload */}
          {!image && (
            <>
              <div
                className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Recycle className="h-12 w-12 text-primary/40 mx-auto mb-3" />
                <p className="text-lg font-semibold mb-1">Upload a Waste Photo</p>
                <p className="text-sm text-muted-foreground mb-5">
                  AI will identify the item, tell you which bin to use, and show its CO₂ impact
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }} className="gap-2">
                    <Camera className="h-4 w-4" /> Camera
                  </Button>
                  <Button variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="gap-2">
                    <Upload className="h-4 w-4" /> Gallery
                  </Button>
                </div>
              </div>

              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} />

              {/* Bin legend */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                {[
                  { bg: "bg-green-500",  label: "Wet",       bin: "Green"  },
                  { bg: "bg-blue-500",   label: "Dry",       bin: "Blue"   },
                  { bg: "bg-red-500",    label: "Hazardous", bin: "Red"    },
                  { bg: "bg-yellow-500", label: "E-Waste",   bin: "Yellow" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full ${item.bg} opacity-80`} />
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.bin}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2 — Preview & analyse */}
          {image && !result && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border">
                <img src={image} alt="Waste to classify" className="w-full h-56 object-cover" />
                <button onClick={handleReset}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Button className="w-full h-12 text-base gap-2" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing
                  ? <><Loader2 className="h-5 w-5 animate-spin" /> AI is analysing...</>
                  : <><Zap className="h-5 w-5" /> Classify with AI</>
                }
              </Button>

              {isAnalyzing && (
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Identifying waste type, bin and CO₂ impact...</p>
                  <div className="flex justify-center gap-1">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="h-2 w-2 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Result */}
          {result && cfg && carbonImpact && (
            <div className="space-y-3">
              {isDemoMode && (
                <div className="text-xs text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-1.5 px-3">
                  Demo mode — real AI classification available on the live site
                </div>
              )}

              {/* Category card */}
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${cfg.badge} shadow-md ${cfg.glow}`}>
                <div className={`w-14 h-14 rounded-full ${cfg.bg} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-lg capitalize">
                      {result.category === "e-waste" ? "E-Waste" : result.category.charAt(0).toUpperCase() + result.category.slice(1)} Waste
                    </span>
                    <Badge variant="outline" className="text-xs">{result.confidence}% confident</Badge>
                    {result.recyclable && (
                      <Badge className="text-xs bg-green-100 text-green-700 border-green-200">Recyclable ♻️</Badge>
                    )}
                  </div>
                  <p className="font-semibold text-sm">{result.itemName}</p>
                  <p className="text-sm opacity-75">→ {result.binColor}</p>
                </div>
              </div>

              {/* ── CO₂ Impact Card — the new feature ── */}
              <div className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wind className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-bold text-green-800 dark:text-green-300">
                    Your CO₂ Impact — This Disposal
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-background rounded-lg p-2.5 border border-green-100">
                    <p className="text-lg font-bold text-green-600">{carbonImpact.co2Saved} kg</p>
                    <p className="text-xs text-muted-foreground leading-tight">CO₂e prevented</p>
                  </div>
                  <div className="bg-white dark:bg-background rounded-lg p-2.5 border border-green-100">
                    <p className="text-lg font-bold text-emerald-600">{carbonImpact.treesEquivalent}</p>
                    <p className="text-xs text-muted-foreground leading-tight">trees' daily work</p>
                  </div>
                  <div className="bg-white dark:bg-background rounded-lg p-2.5 border border-green-100">
                    <p className="text-lg font-bold text-teal-600">{carbonImpact.kmDrivingEquivalent} km</p>
                    <p className="text-xs text-muted-foreground leading-tight">driving offset</p>
                  </div>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 mt-2.5 text-center">
                  This is tracked in your Carbon Footprint dashboard. Claim points to save it permanently.
                </p>
              </div>

              {/* Details */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-3 text-sm">
                <p>{result.description}</p>
                <div className="border-t pt-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Disposal Instructions</p>
                  <p>{result.disposalInstructions}</p>
                </div>
                {result.tip && (
                  <div className="border-t pt-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">💡 Eco Tip</p>
                    <p className="text-muted-foreground">{result.tip}</p>
                  </div>
                )}
              </div>

              {/* Points + carbon claim */}
              {!pointsAwarded ? (
                <Button className="w-full h-12 gap-2" onClick={handleAwardPoints} disabled={isDemoMode}>
                  <CheckCircle className="h-5 w-5" />
                  {isDemoMode
                    ? "Demo mode — no points awarded"
                    : `Confirm Disposal — Earn +${result.points} pts & Save ${carbonImpact.co2Saved} kg CO₂`}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">+{result.points} pts · {carbonImpact.co2Saved} kg CO₂ saved! 🌱</span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Added to your Carbon Tracker. Check Dashboard → Carbon Footprint.
                  </p>
                </div>
              )}

              <Button variant="outline" className="w-full gap-2" onClick={handleReset}>
                <RefreshCw className="h-4 w-4" /> Classify Another Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIWasteClassifier;