// src/components/ragpicker/RagPickerRegistration.tsx
import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { registerRagPicker, findRagPickerByPhone, RagPickerProfile } from "@/services/ragpickerIdentity";
import { UserCheck, Phone, MapPin, Shield } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (profile: RagPickerProfile) => void;
}

const ZONES = [
  "North Delhi", "South Delhi", "East Delhi", "West Delhi",
  "Central Delhi", "Noida", "Gurugram", "Faridabad",
];

const RagPickerRegistration: React.FC<Props> = ({ isOpen, onClose, onRegistered }) => {
  const { toast } = useToast();
  const [step, setStep]       = useState<"check" | "form" | "done">("check");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone]     = useState("");
  const [existingProfile, setExistingProfile] = useState<RagPickerProfile | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Delhi",
    zone: "",
    aadhaarLast4: "",
  });

  const handlePhoneCheck = async () => {
    if (phone.length < 10) {
      toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const existing = await findRagPickerByPhone(phone);
      if (existing) {
        setExistingProfile(existing);
        toast({ title: "Profile Found! 👋", description: `Welcome back, ${existing.name}` });
        onRegistered?.(existing);
        onClose();
      } else {
        // No existing profile — proceed to registration form
        setForm(f => ({ ...f, phone }));
        setStep("form");
      }
    } catch (err: any) {
      // Permission denied = Firestore rules not set yet.
      // We still let the user proceed to registration — the write will work
      // once the first doc is created (Firestore auto-creates the collection).
      console.warn("Phone check error (likely new collection):", err?.code, err?.message);
      setForm(f => ({ ...f, phone }));
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.name || !form.zone) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const profile = await registerRagPicker(form);
      toast({
        title: "Digital Identity Created! 🎉",
        description: `ID: ${profile.id} — Welcome to the formal economy!`,
      });
      setStep("done");
      onRegistered?.(profile);
    } catch {
      toast({ title: "Registration failed. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("check");
    setPhone("");
    setForm({ name: "", phone: "", address: "", city: "Delhi", zone: "", aadhaarLast4: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <UserCheck className="h-5 w-5" />
            Rag Picker Digital Identity
          </DialogTitle>
          <DialogDescription>
            Register waste pickers to give them verified income records and access to formal services.
          </DialogDescription>
        </DialogHeader>

        {/* ── Step 1: Phone check ── */}
        {step === "check" && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-300">
              🌍 <strong>4 million</strong> waste pickers in India have no formal identity.
              SwachhBuddy changes that — starting here.
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
              />
            </div>
            <Button
              className="w-full bg-green-700 hover:bg-green-800 text-white"
              onClick={handlePhoneCheck}
              disabled={loading || phone.length < 10}
            >
              {loading ? "Checking…" : "Check & Continue"}
            </Button>
          </div>
        )}

        {/* ── Step 2: Registration form ── */}
        {step === "form" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Waste picker's full name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Mobile <span className="text-red-500">*</span></Label>
                <Input value={form.phone} disabled />
              </div>
              <div className="space-y-1">
                <Label className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Address
                </Label>
                <Input
                  placeholder="Street / Colony"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Zone / Area <span className="text-red-500">*</span></Label>
                <Select value={form.zone} onValueChange={v => setForm(f => ({ ...f, zone: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONES.map(z => (
                      <SelectItem key={z} value={z}>{z}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> Aadhaar (last 4 digits only)
                </Label>
                <Input
                  placeholder="e.g. 4582"
                  value={form.aadhaarLast4}
                  onChange={e => setForm(f => ({ ...f, aadhaarLast4: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setStep("check")}>
                Back
              </Button>
              <Button
                className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering…" : "Create Digital ID"}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">🆔</div>
            <h3 className="text-lg font-bold text-green-700">Digital Identity Created!</h3>
            <p className="text-sm text-muted-foreground">
              This waste picker now has a verified digital record. They can use this to
              open a Jan Dhan account, get insurance, and access microloans.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {["Jan Dhan", "Insurance", "Microloan"].map(s => (
                <Badge key={s} variant="outline" className="text-green-700 border-green-300 py-1.5">
                  ✅ {s}
                </Badge>
              ))}
            </div>
            <Button className="w-full" onClick={handleClose}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RagPickerRegistration;