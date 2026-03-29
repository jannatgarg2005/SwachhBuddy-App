// src/components/ragpicker/LogCollectionModal.tsx
import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  logCollectionRecord,
  CollectionRecord,
  RATE_CARD,
  findRagPickerByPhone,
  RagPickerProfile,
} from "@/services/ragpickerIdentity";
import { Package, MapPin, Scale, Coins, Phone } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Pass in if already known from context */
  ragPickerProfile?: RagPickerProfile | null;
  verifyingEmployeeId?: string;
}

const MATERIAL_TYPES: CollectionRecord["materialType"][] = [
  "Plastic", "Paper", "Metal", "Glass", "E-Waste", "Mixed",
];

const LogCollectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ragPickerProfile,
  verifyingEmployeeId,
}) => {
  const { toast } = useToast();
  const [loading, setLoading]   = useState(false);
  const [lookupPhone, setLookupPhone] = useState("");
  const [profile, setProfile]   = useState<RagPickerProfile | null>(ragPickerProfile || null);
  const [form, setForm] = useState({
    materialType: "Plastic" as CollectionRecord["materialType"],
    weightKg: "",
    locationName: "",
    notes: "",
  });

  const estimatedEarnings =
    parseFloat(form.weightKg) > 0
      ? (parseFloat(form.weightKg) * RATE_CARD[form.materialType]).toFixed(2)
      : "0.00";

  const handleLookup = async () => {
    if (lookupPhone.length < 10) return;
    setLoading(true);
    try {
      const found = await findRagPickerByPhone(lookupPhone);
      if (found) {
        setProfile(found);
        toast({ title: `Found: ${found.name}`, description: `ID: ${found.id}` });
      } else {
        toast({
          title: "No rag picker found with that number.",
          description: "Please register them first using 'Register New'.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      if (err?.code === "permission-denied") {
        toast({
          title: "Firestore rules not set",
          description: "Add ragpickers rules in Firebase console. See README.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Lookup failed", description: err?.message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    if (!profile) { toast({ title: "No rag picker selected", variant: "destructive" }); return; }
    if (!form.weightKg || parseFloat(form.weightKg) <= 0) {
      toast({ title: "Enter a valid weight", variant: "destructive" }); return;
    }
    if (!form.locationName) {
      toast({ title: "Enter pickup location", variant: "destructive" }); return;
    }
    setLoading(true);
    try {
      const record = await logCollectionRecord({
        ragPickerId: profile.id,
        date: Timestamp.now(),
        weightKg: parseFloat(form.weightKg),
        materialType: form.materialType,
        locationName: form.locationName,
        ratePerKg: RATE_CARD[form.materialType],
        verifiedByEmployeeId: verifyingEmployeeId,
        notes: form.notes,
      });
      toast({
        title: "Collection Logged ✅",
        description: `${form.weightKg} kg ${form.materialType} — ₹${record.earningsRs} earned`,
      });
      handleClose();
    } catch {
      toast({ title: "Failed to log collection", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ materialType: "Plastic", weightKg: "", locationName: "", notes: "" });
    setLookupPhone("");
    if (!ragPickerProfile) setProfile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Package className="h-5 w-5" />
            Log Daily Collection
          </DialogTitle>
          <DialogDescription>
            Record today's waste pickup — timestamped and verified on the blockchain of service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rag Picker lookup */}
          {!profile ? (
            <div className="space-y-2 p-3 bg-muted/40 rounded-lg border">
              <Label className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> Find Rag Picker by Phone
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="10-digit mobile"
                  value={lookupPhone}
                  onChange={e => setLookupPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                />
                <Button
                  variant="outline"
                  onClick={handleLookup}
                  disabled={loading || lookupPhone.length < 10}
                >
                  Find
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">{profile.name}</p>
                <p className="text-xs text-green-600 dark:text-green-400">{profile.id} · Score: {profile.swachhScore}</p>
              </div>
              {!ragPickerProfile && (
                <Button variant="ghost" size="sm" onClick={() => setProfile(null)}>Change</Button>
              )}
            </div>
          )}

          {/* Material type */}
          <div className="space-y-1">
            <Label>Material Type</Label>
            <Select
              value={form.materialType}
              onValueChange={v => setForm(f => ({ ...f, materialType: v as CollectionRecord["materialType"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_TYPES.map(m => (
                  <SelectItem key={m} value={m}>
                    {m} — ₹{RATE_CARD[m]}/kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <Label className="flex items-center gap-1">
              <Scale className="h-3.5 w-3.5" /> Weight (kg)
            </Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 12.5"
              value={form.weightKg}
              onChange={e => setForm(f => ({ ...f, weightKg: e.target.value }))}
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <Label className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Pickup Location
            </Label>
            <Input
              placeholder="e.g. Block C, Sector 12, Rohini"
              value={form.locationName}
              onChange={e => setForm(f => ({ ...f, locationName: e.target.value }))}
            />
          </div>

          {/* Earnings preview */}
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <span className="flex items-center gap-1 text-sm text-amber-700 dark:text-amber-300">
              <Coins className="h-4 w-4" /> Estimated Earnings
            </span>
            <span className="text-lg font-bold text-amber-800 dark:text-amber-200">₹ {estimatedEarnings}</span>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label>Notes (optional)</Label>
            <Input
              placeholder="Any remarks…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
              onClick={handleLog}
              disabled={loading || !profile}
            >
              {loading ? "Saving…" : "Log Collection"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogCollectionModal;