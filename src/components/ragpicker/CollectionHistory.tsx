// src/components/ragpicker/CollectionHistory.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollectionRecord, getCollectionHistory } from "@/services/ragpickerIdentity";
import { Timestamp } from "firebase/firestore";
import { History, MapPin, Scale, Coins } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ragPickerId: string;
  ragPickerName: string;
}

const MATERIAL_COLORS: Record<string, string> = {
  Plastic:  "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  Paper:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200",
  Metal:    "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  Glass:    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
  "E-Waste":"bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  Mixed:    "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
};

const CollectionHistory: React.FC<Props> = ({ isOpen, onClose, ragPickerId, ragPickerName }) => {
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getCollectionHistory(ragPickerId);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: Timestamp | Date) => {
    const dt = d instanceof Timestamp ? d.toDate() : new Date(d);
    return dt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  const totalKg      = records.reduce((a, r) => a + r.weightKg, 0);
  const totalEarnings = records.reduce((a, r) => a + r.earningsRs, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-violet-700">
            <History className="h-5 w-5" />
            Collection History
          </DialogTitle>
          <DialogDescription>
            {ragPickerName} — last {records.length} records
          </DialogDescription>
        </DialogHeader>

        {/* Summary bar */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{totalKg.toFixed(1)} kg</p>
            <p className="text-xs text-muted-foreground">Total Collected</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">₹{totalEarnings.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading records…</div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No collection records yet.</p>
            <p className="text-xs mt-1">Use "Log Collection" to add the first entry.</p>
          </div>
        ) : (
          <div className="relative pl-5">
            {/* Vertical line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {records.map((r, i) => (
                <div key={r.id || i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-3.5 top-2 h-2.5 w-2.5 rounded-full bg-violet-500 dark:bg-violet-400 border-2 border-background shadow" />

                  <div className="bg-card border border-border rounded-lg p-3 shadow-sm space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-xs font-medium ${MATERIAL_COLORS[r.materialType] || "bg-muted text-foreground"}`}>
                          {r.materialType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-amber-600 dark:text-amber-400">₹{r.earningsRs}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Scale className="h-3.5 w-3.5" /> {r.weightKg} kg
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5" /> ₹{r.ratePerKg}/kg
                      </span>
                      {r.locationName && (
                        <span className="flex items-center gap-1 truncate max-w-[140px]">
                          <MapPin className="h-3.5 w-3.5 shrink-0" /> {r.locationName}
                        </span>
                      )}
                    </div>

                    {r.notes && (
                      <p className="text-xs text-muted-foreground italic">{r.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionHistory;