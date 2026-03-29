// src/components/ragpicker/IncomeCertificate.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  RagPickerProfile,
  MonthlySummary,
  getMonthlySummary,
  generateIncomeCertificateText,
} from "@/services/ragpickerIdentity";
import { FileText, Download, CheckCircle2, Calendar } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: RagPickerProfile;
}

// Build last 6 month options
const buildMonthOptions = () => {
  const opts: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-IN", { month: "long", year: "numeric" });
    opts.push({ value, label });
  }
  return opts;
};

const ELIGIBILITY_SCHEMES = [
  { icon: "🏦", name: "Jan Dhan Bank Account", desc: "Zero-balance account with RuPay card" },
  { icon: "🛡️", name: "PM Suraksha Bima", desc: "₹2 lakh accident insurance for ₹20/yr" },
  { icon: "👴", name: "PM Shram Yogi Maandhan", desc: "Pension ₹3000/month after age 60" },
  { icon: "💰", name: "Micro-loan (SHG/MFI)", desc: "₹5,000–₹50,000 working capital loan" },
  { icon: "🏥", name: "Ayushman Bharat", desc: "Free health coverage up to ₹5 lakh" },
];

const IncomeCertificate: React.FC<Props> = ({ isOpen, onClose, profile }) => {
  const monthOptions = buildMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const [summary, setSummary]   = useState<MonthlySummary | null>(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isOpen) fetchSummary(selectedMonth);
  }, [isOpen, selectedMonth]);

  const fetchSummary = async (month: string) => {
    setLoading(true);
    try {
      const s = await getMonthlySummary(profile.id, month);
      setSummary(s);
    } finally {
      setLoading(false);
    }
  };

  const monthLabel = monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth;

  const handleDownload = () => {
    if (!summary) return;
    const text = generateIncomeCertificateText(profile, summary, monthLabel);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `SwachhBuddy-Certificate-${profile.id}-${selectedMonth}.txt`;
    a.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-700">
            <FileText className="h-5 w-5" />
            Verified Income Certificate
          </DialogTitle>
          <DialogDescription>
            Official monthly earnings record — accepted for bank, insurance, and loan applications.
          </DialogDescription>
        </DialogHeader>

        {/* Month selector */}
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Certificate card */}
        <div className="border-2 border-emerald-700 dark:border-emerald-600 rounded-xl overflow-hidden">
          {/* Header stripe */}
          <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">SwachhBuddy</p>
              <p className="text-xs text-emerald-200">Digital Income Certificate</p>
            </div>
            {profile.isVerified
              ? <Badge className="bg-white text-emerald-800 text-xs">✅ Verified</Badge>
              : <Badge variant="outline" className="border-white text-white text-xs">Pending</Badge>
            }
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Profile row */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-semibold">{profile.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Picker ID</p>
                <p className="font-mono font-semibold text-xs">{profile.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">City / Zone</p>
                <p className="font-semibold text-sm">{profile.city} — {profile.zone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Swachh Score</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{profile.swachhScore}</p>
              </div>
            </div>

            <hr className="border-border" />

            {/* Monthly summary */}
            {loading ? (
              <p className="text-center text-muted-foreground text-sm py-4">Loading…</p>
            ) : summary ? (
              <>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">
                    {monthLabel} — Summary
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">{summary.collectionDays}</p>
                      <p className="text-xs text-muted-foreground">Active Days</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">{summary.totalKg}</p>
                      <p className="text-xs text-muted-foreground">Total kg</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">₹{summary.totalEarningsRs}</p>
                      <p className="text-xs text-muted-foreground">Earnings</p>
                    </div>
                  </div>
                </div>

                {/* Material breakdown */}
                {Object.keys(summary.materialsBreakdown).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Material Breakdown</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(summary.materialsBreakdown).map(([mat, kg]) => (
                        <Badge key={mat} variant="outline" className="text-xs">
                          {mat}: {(kg as number).toFixed(1)} kg
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {summary.totalKg === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-2">
                    No collections recorded this month yet.
                  </p>
                )}
              </>
            ) : null}

            <hr className="border-border" />

            {/* Eligibility */}
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">
                Eligible Government Schemes
              </p>
              <div className="space-y-1.5">
                {ELIGIBILITY_SCHEMES.map(s => (
                  <div key={s.name} className="flex items-start gap-2 text-sm">
                    <span className="shrink-0">{s.icon}</span>
                    <div>
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground text-xs ml-1">— {s.desc}</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-auto mt-0.5" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
              Issued by SwachhBuddy Digital Platform · {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
          <Button
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white"
            onClick={handleDownload}
            disabled={!summary}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomeCertificate;