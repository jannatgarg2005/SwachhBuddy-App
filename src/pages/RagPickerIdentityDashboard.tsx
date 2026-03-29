// src/pages/RagPickerIdentityDashboard.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus, Package, FileText, History, Search,
  ArrowLeft, ShieldCheck, TrendingUp, Users, Star, IdCard,
} from "lucide-react";
import { RagPickerProfile, getRagPickerById, findRagPickerByPhone } from "@/services/ragpickerIdentity";
import { DigitalIDCardWithActions } from "@/components/ragpicker/DigitalIDCard";
import RagPickerRegistration from "@/components/ragpicker/RagPickerRegistration";
import LogCollectionModal from "@/components/ragpicker/LogCollectionModal";
import IncomeCertificate from "@/components/ragpicker/IncomeCertificate";
import CollectionHistory from "@/components/ragpicker/CollectionHistory";
import { useAuth } from "@/hooks/use-auth";

const IMPACT_STATS = [
  { value: "4M+",   label: "Waste Pickers in India",       icon: "👷", color: "text-blue-500 dark:text-blue-400" },
  { value: "0",     label: "Had Formal Identity Before",    icon: "📋", color: "text-red-500 dark:text-red-400" },
  { value: "₹0",    label: "Access to Formal Credit",       icon: "🏦", color: "text-amber-500 dark:text-amber-400" },
  { value: "Today", label: "That Changes With SwachhBuddy", icon: "🌟", color: "text-green-600 dark:text-green-400" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Register",         desc: "Municipal employee registers the waste picker with name, phone, zone",   icon: UserPlus, iconColor: "text-blue-600 dark:text-blue-300",   bg: "bg-blue-100 dark:bg-blue-900/50" },
  { step: "2", title: "Collect & Log",    desc: "Each day's pickup is logged — kg, material, location, timestamp",        icon: Package,  iconColor: "text-amber-600 dark:text-amber-300",  bg: "bg-amber-100 dark:bg-amber-900/50" },
  { step: "3", title: "Score builds",     desc: "Swachh Score accumulates with every verified collection",                icon: Star,     iconColor: "text-violet-600 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/50" },
  { step: "4", title: "Get Certificate",  desc: "Monthly verified income certificate — accepted by banks & MFIs",         icon: FileText, iconColor: "text-emerald-600 dark:text-emerald-300",bg: "bg-emerald-100 dark:bg-emerald-900/50" },
];

const RagPickerIdentityDashboard: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { toast } = useToast();

  // Smart back: if came from a dashboard tab, go back to it with tab state
  const handleBack = () => {
    const state = location.state as any;
    if (state?.from) {
      navigate(state.from, { state: { activeTab: state.activeTab || "learning" } });
    } else {
      navigate(-1);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeProfile, setActiveProfile] = useState<RagPickerProfile | null>(null);

  const [showRegister, setShowRegister]   = useState(false);
  const [showLogModal, setShowLogModal]   = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showHistory, setShowHistory]     = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      let profile: RagPickerProfile | null = null;
      if (searchQuery.startsWith("SB-RP-")) {
        profile = await getRagPickerById(searchQuery.trim());
      } else {
        profile = await findRagPickerByPhone(searchQuery.trim());
      }
      if (profile) {
        setActiveProfile(profile);
        toast({ title: `Found: ${profile.name}`, description: profile.id });
      } else {
        toast({
          title: "No profile found",
          description: "No waste picker registered with this ID or number. Click 'Register New' to add them.",
        });
      }
    } catch (err: any) {
      // If it's a Firestore rules / missing collection error, show friendly message
      if (err?.code === "permission-denied") {
        toast({
          title: "Firestore rules not configured",
          description: "Add the ragpickers collection rules in Firebase console. See README for instructions.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Search failed", description: err?.message || "Unknown error", variant: "destructive" });
      }
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 mb-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <IdCard className="h-6 w-6 text-green-200" />
                <h1 className="text-2xl md:text-3xl font-bold">Rag Picker Digital Identity</h1>
              </div>
              <p className="text-green-200 text-sm max-w-xl">
                Making India's 4 million waste pickers visible to the formal economy — 
                verified income records, digital IDs, and access to banks, insurance & credit.
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 text-sm py-1 px-3 self-start">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> SwachhBuddy Verified
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Impact banner ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {IMPACT_STATS.map(s => (
            <Card key={s.label} className="text-center border-0 shadow-sm">
              <CardContent className="pt-4 pb-3">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Search + Quick Actions ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Find or Register a Waste Picker</CardTitle>
            <CardDescription>Search by Picker ID (SB-RP-…) or mobile number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="SB-RP-ABC123 or 9876543210"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <Button
                variant="outline"
                onClick={handleSearch}
                disabled={searchLoading || !searchQuery.trim()}
                className="shrink-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: "Register New", icon: UserPlus, color: "bg-blue-600 hover:bg-blue-700", onClick: () => setShowRegister(true) },
                { label: "Log Collection", icon: Package, color: "bg-amber-600 hover:bg-amber-700", onClick: () => { if (!activeProfile) { toast({ title: "Search for a picker first" }); return; } setShowLogModal(true); } },
                { label: "Income Cert", icon: FileText, color: "bg-emerald-600 hover:bg-emerald-700", onClick: () => { if (!activeProfile) { toast({ title: "Search for a picker first" }); return; } setShowCertificate(true); } },
                { label: "History", icon: History, color: "bg-violet-600 hover:bg-violet-700", onClick: () => { if (!activeProfile) { toast({ title: "Search for a picker first" }); return; } setShowHistory(true); } },
              ].map(a => (
                <Button
                  key={a.label}
                  className={`${a.color} text-white flex items-center gap-2 justify-start px-3 h-auto py-2.5`}
                  onClick={a.onClick}
                >
                  <a.icon className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-medium">{a.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Active Profile card ── */}
        {activeProfile && (
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" /> Active Profile
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Digital ID Card */}
              <div className="w-full md:w-72 shrink-0">
                <DigitalIDCardWithActions profile={activeProfile} />
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[
                  { label: "Total Collected", value: `${activeProfile.totalKgCollected.toFixed(1)} kg`, icon: "⚖️" },
                  { label: "Verified Earnings", value: `₹${activeProfile.totalEarningsRs.toFixed(0)}`, icon: "💰" },
                  { label: "Swachh Score", value: activeProfile.swachhScore.toString(), icon: "⭐" },
                  { label: "Bank Linked", value: activeProfile.bankLinked ? "Yes ✅" : "Not yet", icon: "🏦" },
                  { label: "Insurance", value: activeProfile.insuranceLinked ? "Active ✅" : "Not yet", icon: "🛡️" },
                  { label: "Verification", value: activeProfile.isVerified ? "Verified ✅" : "Pending", icon: "🔒" },
                ].map(s => (
                  <Card key={s.label} className="border-0 shadow-sm">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                          <p className="font-semibold text-sm">{s.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── How it works ── */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" /> How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HOW_IT_WORKS.map(h => (
              <Card key={h.step} className="shadow-sm">
                <CardContent className="pt-4 pb-4 text-center space-y-2">
                  <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${h.bg}`}>
                    <h.icon className={`h-5 w-5 ${h.iconColor}`} />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">STEP {h.step}</div>
                  <div className="font-semibold text-sm">{h.title}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{h.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Social impact callout ── */}
        <Card className="border-0 bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-lg">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-4">
              <div className="text-4xl shrink-0">♻️</div>
              <div>
                <h3 className="font-bold text-lg">Invisible No More</h3>
                <p className="text-green-100 text-sm mt-1">
                  Waste pickers recover 15–20% of India's recyclables — without them, 
                  our cities would drown in waste. Yet they earn under ₹200/day with
                  no safety net, no identity, and no access to the economy.
                  SwachhBuddy gives them what they've always deserved: <strong>visibility</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Modals ── */}
      <RagPickerRegistration
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegistered={p => { setActiveProfile(p); setShowRegister(false); }}
      />

      <LogCollectionModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        ragPickerProfile={activeProfile}
        verifyingEmployeeId={user?.uid}
      />

      {activeProfile && (
        <>
          <IncomeCertificate
            isOpen={showCertificate}
            onClose={() => setShowCertificate(false)}
            profile={activeProfile}
          />
          <CollectionHistory
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            ragPickerId={activeProfile.id}
            ragPickerName={activeProfile.name}
          />
        </>
      )}
    </div>
  );
};

export default RagPickerIdentityDashboard;