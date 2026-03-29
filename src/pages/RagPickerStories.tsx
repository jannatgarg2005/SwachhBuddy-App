// src/pages/RagPickerStories.tsx
// Read-only page for CITIZENS — search & view verified rag picker profiles
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Search, ShieldCheck, Heart, Star, Recycle, IdCard,
} from "lucide-react";
import {
  RagPickerProfile,
  getRagPickerById,
  findRagPickerByPhone,
} from "@/services/ragpickerIdentity";
import { DigitalIDCardWithActions } from "@/components/ragpicker/DigitalIDCard";
import CollectionHistory from "@/components/ragpicker/CollectionHistory";

const STORIES = [
  {
    emoji: "👨",
    name: "Ramesh Kumar",
    city: "Delhi",
    quote: "Before SwachhBuddy, I had no proof of my work. Now I have an ID and applied for a Jan Dhan account.",
    kg: "1,240 kg",
    years: "6 years",
  },
  {
    emoji: "👩",
    name: "Sunita Devi",
    city: "Noida",
    quote: "My Swachh Score helped me get a ₹10,000 microloan to buy a better cart. My income doubled.",
    kg: "890 kg",
    years: "4 years",
  },
  {
    emoji: "👴",
    name: "Abdul Hamid",
    city: "Gurugram",
    quote: "I am 58 years old. With the income certificate I enrolled in PM Shram Yogi Maandhan — I will get a pension.",
    kg: "2,100 kg",
    years: "11 years",
  },
];

const RagPickerStories: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { toast } = useToast();

  const handleBack = () => {
    const state = location.state as any;
    if (state?.from) {
      navigate(state.from, { state: { activeTab: state.activeTab || "learning" } });
    } else {
      navigate(-1);
    }
  };

  const [searchQuery, setSearchQuery]   = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [foundProfile, setFoundProfile] = useState<RagPickerProfile | null>(null);
  const [showHistory, setShowHistory]   = useState(false);

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
        setFoundProfile(profile);
      } else {
        toast({
          title: "No verified picker found",
          description: "Check the ID or number and try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Search failed", variant: "destructive" });
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
          <div className="flex items-start gap-3">
            <Recycle className="h-7 w-7 text-green-200 shrink-0 mt-0.5" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Rag Picker Stories</h1>
              <p className="text-green-200 text-sm mt-1 max-w-xl">
                Meet the people who keep our cities clean every day —
                now formally recognised through SwachhBuddy's Digital Identity System.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* ── Impact numbers ── */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { value: "4M+",  label: "Waste pickers in India", icon: "👷" },
            { value: "80%",  label: "Work without any ID",    icon: "📋" },
            { value: "₹200", label: "Average daily income",   icon: "💰" },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Verify a Picker ID ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              Verify a Waste Picker's Digital ID
            </CardTitle>
            <CardDescription>
              Enter a Picker ID (SB-RP-…) or their mobile number to see their verified profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="SB-RP-ABC123 or mobile number"
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

            {/* Found profile */}
            {foundProfile && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                    ✅ Verified Profile Found
                  </Badge>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-64 shrink-0">
                    <DigitalIDCardWithActions profile={foundProfile} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Total Collected", value: `${foundProfile.totalKgCollected.toFixed(1)} kg`, icon: "⚖️" },
                        { label: "Verified Earnings", value: `₹${foundProfile.totalEarningsRs.toFixed(0)}`, icon: "💰" },
                        { label: "Swachh Score", value: foundProfile.swachhScore.toString(), icon: "⭐" },
                        { label: "Status", value: foundProfile.isVerified ? "Verified ✅" : "Pending", icon: "🔒" },
                      ].map(s => (
                        <Card key={s.label} className="shadow-sm">
                          <CardContent className="pt-3 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{s.icon}</span>
                              <div>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                                <p className="font-semibold text-sm">{s.value}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-violet-600 dark:text-violet-400 border-violet-300 dark:border-violet-700"
                      onClick={() => setShowHistory(true)}
                    >
                      View Collection History
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Stories ── */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" /> Real Stories
          </h2>
          <div className="space-y-4">
            {STORIES.map(s => (
              <Card key={s.name} className="shadow-sm">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl shrink-0">{s.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold">{s.name}</p>
                        <Badge variant="outline" className="text-xs">{s.city}</Badge>
                        <Badge variant="outline" className="text-xs">{s.years} experience</Badge>
                        <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-300 dark:border-green-700">
                          {s.kg} collected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{s.quote}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── What Citizens Can Do ── */}
        <Card className="border-0 bg-gradient-to-r from-green-800 to-emerald-700 text-white shadow-lg">
          <CardContent className="pt-5 pb-5">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300" /> How You Can Help
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: "🤝", title: "Greet them by name", desc: "Ask for their SwachhBuddy ID — it encourages formal registration" },
                { icon: "♻️", title: "Segregate your waste", desc: "Clean segregated waste increases their earnings per kg" },
                { icon: "📢", title: "Spread the word", desc: "Tell other waste pickers about their right to a Digital ID" },
              ].map(a => (
                <div key={a.title} className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <p className="font-semibold text-sm">{a.title}</p>
                  <p className="text-xs text-green-100 mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Modals ── */}
      {foundProfile && (
        <CollectionHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          ragPickerId={foundProfile.id}
          ragPickerName={foundProfile.name}
        />
      )}
    </div>
  );
};

export default RagPickerStories;