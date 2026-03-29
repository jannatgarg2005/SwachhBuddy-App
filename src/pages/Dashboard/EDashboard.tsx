// src/pages/Dashboard/EDashboard.tsx  ← UPDATED: added Rag Picker Identity widget
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode, Calendar, GraduationCap, Gamepad2, Users, BarChart3,
  CheckCircle, Clock, MapPin, Download, AlertTriangle,
  ClipboardList, Truck, Package, Bot, Flame, Medal, TrendingUp, ScanLine, IdCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RewardsSystem from "@/components/RewardsSystem";
import { useAuth } from "@/hooks/use-auth";
import WasteTracking from "@/components/WasteTracking";
import EWasteDay from "@/components/EWasteDay";
import WasteChatbot from "@/components/WasteChatbot";
import Activities from "../Activities";
import { usePoints } from "@/contexts/PointsContext";
import { FiHome, FiActivity, FiBook, FiAward, FiMap } from "react-icons/fi";
import { Progress } from "@/components/ui/progress";
import SchedulePickup from "@/components/SchedulePickup";
import CitizenPickupRequests from "@/components/CitizenPickupRequests";
import { EmployeeMapDashboard } from "@/components/EmployeeMapDashboard";
import AIWasteClassifier from "@/components/AIWasteClassifier";
import DashboardHeader from "@/components/DashboardHeader";
// ── NEW ──────────────────────────────────────────────────────────────────────
import RagPickerIdentityWidget from "@/components/ragpicker/RagPickerIdentityWidget";
// ─────────────────────────────────────────────────────────────────────────────

const EDashboard: React.FC = () => {
  const { user, userData } = useAuth();
  const { toast }          = useToast();
  const { coins, earn, redeem } = usePoints();

  const [streak, setStreak]             = useState<number>(7);
  const [weeklyGoal]                    = useState<number>(500);
  const [weeklyProgress]                = useState<number>(350);
  const [showRewards, setShowRewards]   = useState(false);
  const [showWasteTracking, setShowWasteTracking]               = useState(false);
  const [showEWasteDay, setShowEWasteDay]                       = useState(false);
  const [showSchedulePickup, setShowSchedulePickup]             = useState(false);
  const [showCitizenPickupRequests, setShowCitizenPickupRequests] = useState(false);
  const [showAIClassifier, setShowAIClassifier]                 = useState(false);
  const [generatedQR, setGeneratedQR]   = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [scansToday, setScansToday]     = useState<number>(3);

  const [pickupRequests, setPickupRequests] = useState([
    { id: "REQ001", citizen: "Aisha Khan",    address: "12/A, Sector 4, Delhi",       type: "Dry Waste",  scheduledTime: "Today, 10:00 AM",   status: "pending" },
    { id: "REQ002", citizen: "Mohan Das",     address: "B-7, Green Park, Delhi",      type: "Wet Waste",  scheduledTime: "Today, 11:30 AM",   status: "pending" },
    { id: "REQ003", citizen: "Sunita Sharma", address: "Plot 5, Rohini Sector 3",     type: "E-Waste",    scheduledTime: "Today, 2:00 PM",    status: "completed" },
    { id: "REQ004", citizen: "Ravi Kumar",    address: "Flat 201, DDA Flats, Dwarka", type: "Hazardous",  scheduledTime: "Tomorrow, 9:00 AM", status: "pending" },
  ]);

  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", points: 2850, district: "Mumbai" },
    { rank: 2, name: "Raj Patel",    points: 2720, district: "Delhi" },
    { rank: 3, name: "Anita Kumar",  points: 2650, district: "Bangalore" },
    { rank: 4, name: user ? (user.displayName || "You") : "You", points: coins, district: "Your District", isUser: true },
  ];

  const handlePointsRedeemedWrapper = (points: number): void => { redeem(points); };

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    try {
      const empId  = userData?.employeeId || user?.uid?.slice(0, 8) || "EMP001";
      const qrData = `SWACHH-EMP-${empId}-${Date.now()}`;
      const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&color=166534&bgcolor=ffffff&data=${encodeURIComponent(qrData)}&format=png&margin=10`;
      setGeneratedQR(qrUrl);
      toast({ title: "QR Code Generated! ✅", description: "Share this with citizens. Each scan gives them +25 pts!" });
    } catch {
      toast({ title: "Error", description: "Could not generate QR. Try again." });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (!generatedQR) return;
    const link = document.createElement("a");
    link.href = generatedQR; link.download = "swachh-buddy-emp-qr.png"; link.target = "_blank";
    link.click();
  };

  const handleCitizenScanned = () => {
    setScansToday(p => p + 1); setStreak(p => p + 1);
    earn(10, { source: "citizen-scan" });
    toast({ title: "Citizen Scanned Your QR! 🎉", description: "Citizen earned +25 pts. Your streak increased! (+10 pts)" });
  };

  const handleCompletePickup = (reqId: string) => {
    setPickupRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "completed" } : r));
    earn(30, { source: "pickup-completed" });
    toast({ title: "Pickup Completed! ✅", description: `Request ${reqId} marked done. +30 pts earned!` });
  };

  const pendingCount = pickupRequests.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Upgraded Header ── */}
      <DashboardHeader
        name={user?.displayName || "Employee"}
        subtitle={`Municipal Employee · ID: ${userData?.employeeId || (user?.uid?.slice(0, 10) + "…")}${userData?.department ? ` · Dept: ${userData.department}` : ""}`}
        role="employee"
        levelBadge="Level 1"
        stats={[
          { value: coins, label: "Points", icon: <TrendingUp className="h-3.5 w-3.5 text-white" />, highlight: true },
          { value: coins, label: "Coins",  icon: <TrendingUp className="h-3.5 w-3.5 text-white" /> },
          { value: `🔥 ${streak}`, label: "Streak", icon: <Flame className="h-3.5 w-3.5 text-white" /> },
          { value: "#4", label: "District Rank", icon: <Medal className="h-3.5 w-3.5 text-white" /> },
          { value: `${Math.round((weeklyProgress / weeklyGoal) * 100)}%`, label: "Weekly Goal", icon: <TrendingUp className="h-3.5 w-3.5 text-white" /> },
        ]}
      />

      {/* ── Tabs ── */}
      <div className="container mx-auto p-3 md:p-5">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 gap-1 md:gap-2 rounded-2xl bg-muted/60 p-1.5 md:p-2 shadow-sm">
            {[
              { value: "overview",   icon: <FiHome className="w-4 h-4" />,     label: "Overview" },
              { value: "map",        icon: <FiMap className="w-4 h-4" />,      label: "Map" },
              { value: "activities", icon: <FiActivity className="w-4 h-4" />, label: "Activities" },
              { value: "learning",   icon: <FiBook className="w-4 h-4" />,     label: "Learning" },
              { value: "leaderboard",icon: <FiAward className="w-4 h-4" />,    label: "Rankings" },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="flex items-center justify-center gap-1 md:gap-2 rounded-xl py-2 px-1 md:px-3 text-xs md:text-sm font-medium transition-all
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
                  data-[state=active]:text-white data-[state=active]:shadow-md">
                {tab.icon}<span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── OVERVIEW ── */}
          <TabsContent value="overview" className="space-y-4 md:space-y-6">

            {/* ── NEW: Rag Picker Identity Widget ── */}
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
                <IdCard className="h-5 w-5 text-green-600" />
                Rag Picker Digital Identity
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs ml-1">New</Badge>
              </h2>
              <RagPickerIdentityWidget verifyingEmployeeId={user?.uid} />
            </div>

            {/* ── QR Code Section ── */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3">Your QR Code</h2>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="text-center">
                      {generatedQR ? (
                        <img src={generatedQR} alt="Employee QR" className="w-32 h-32 border-2 border-primary rounded-lg mx-auto" />
                      ) : (
                        <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mx-auto">
                          <QrCode className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Employee QR</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Scans today: <strong>{scansToday}</strong> | Each scan = +25 pts for citizen
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={handleGenerateQR} disabled={isGeneratingQR}>
                          <QrCode className="h-3.5 w-3.5 mr-1" />
                          {isGeneratingQR ? "Generating…" : generatedQR ? "Regenerate" : "Generate QR"}
                        </Button>
                        {generatedQR && (
                          <Button size="sm" variant="outline" onClick={handleDownloadQR}>
                            <Download className="h-3.5 w-3.5 mr-1" /> Download
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={handleCitizenScanned}>
                          <ScanLine className="h-3.5 w-3.5 mr-1" /> Simulate Scan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Quick Actions ── */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: ClipboardList, label: "Pickup Requests",   badge: pendingCount > 0 ? String(pendingCount) : undefined, color: "text-blue-600",  onClick: () => setShowCitizenPickupRequests(true) },
                  { icon: Truck,        label: "Schedule Pickup",    color: "text-green-600", onClick: () => setShowSchedulePickup(true) },
                  { icon: Package,      label: "Track Waste",        color: "text-amber-600", onClick: () => setShowWasteTracking(true) },
                  { icon: Calendar,     label: "E-Waste Day",        color: "text-violet-600",onClick: () => setShowEWasteDay(true) },
                  { icon: Bot,          label: "AI Classifier",      color: "text-rose-600",  onClick: () => setShowAIClassifier(true) },
                  { icon: BarChart3,    label: "View Leaderboard",   color: "text-indigo-600",onClick: () => {} },
                ].map(a => (
                  <Card
                    key={a.label}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={a.onClick}
                  >
                    <CardContent className="pt-4 pb-4 flex items-center gap-3">
                      <a.icon className={`h-6 w-6 ${a.color} shrink-0`} />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{a.label}</span>
                        {a.badge && (
                          <Badge variant="destructive" className="text-xs h-5">{a.badge}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* ── Pickup Requests ── */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> Today's Pickup Requests
                  {pendingCount > 0 && <Badge variant="destructive">{pendingCount} pending</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pickupRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className={`mt-0.5 shrink-0 ${req.status === "completed" ? "text-green-600" : "text-amber-500"}`}>
                          {req.status === "completed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{req.citizen}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{req.address}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{req.scheduledTime} · {req.type}</p>
                        </div>
                      </div>
                      {req.status === "pending" && (
                        <Button
                          size="sm"
                          className="shrink-0 text-xs h-7"
                          onClick={() => handleCompletePickup(req.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ── Weekly progress ── */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(weeklyProgress / weeklyGoal) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {weeklyProgress} / {weeklyGoal} pts — {Math.round((weeklyProgress / weeklyGoal) * 100)}% complete
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── MAP ── */}
          <TabsContent value="map">
            <EmployeeMapDashboard />
          </TabsContent>

          {/* ── ACTIVITIES ── */}
          <TabsContent value="activities">
            <Activities />
          </TabsContent>

          {/* ── LEARNING ── */}
          <TabsContent value="learning" className="space-y-4">
            <h2 className="text-xl font-bold">Learning & Training</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Waste Management Basics", href: "/learning/waste-basics", icon: GraduationCap, desc: "Core SWM knowledge" },
                { title: "Rag Picker Support", href: "/learning/ragpicker-basics", icon: Users, desc: "Understand waste picker needs" },
                { title: "Eco Sorter Game", href: "/eco-sorter-game", icon: Gamepad2, desc: "Fun learning through play" },
                { title: "Digital Identity Guide", href: "/ragpicker-identity", icon: IdCard, desc: "Register & manage rag picker IDs" },
              ].map(l => (
                <Card key={l.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <l.icon className="h-7 w-7 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">{l.title}</p>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                      <Link to={l.href} className="ml-auto">
                        <Button size="sm" variant="outline">Go</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── LEADERBOARD ── */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> District Leaderboard
                </CardTitle>
                <CardDescription>Top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboardData.map(u => (
                    <div key={u.rank} className={`flex items-center justify-between p-3 rounded-lg ${(u as any).isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg w-6 text-center">
                          {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : `#${u.rank}`}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{u.name} {(u as any).isUser ? "(You)" : ""}</p>
                          <p className="text-xs text-muted-foreground">{u.district}</p>
                        </div>
                      </div>
                      <div className="font-bold text-primary text-sm">{u.points} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Modals ── */}
      <WasteTracking isOpen={showWasteTracking} onClose={() => setShowWasteTracking(false)} />
      <SchedulePickup isOpen={showSchedulePickup} onClose={() => setShowSchedulePickup(false)} />
      <EWasteDay isOpen={showEWasteDay} onClose={() => setShowEWasteDay(false)} />
      <AIWasteClassifier isOpen={showAIClassifier} onClose={() => setShowAIClassifier(false)} />
      <CitizenPickupRequests isOpen={showCitizenPickupRequests} onClose={() => setShowCitizenPickupRequests(false)} />
      <WasteChatbot />

      {showRewards && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 md:p-6 overflow-auto">
          <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Rewards</h3>
              <Button variant="ghost" onClick={() => setShowRewards(false)}>Close</Button>
            </div>
            <div style={{ minHeight: 600 }}>
              <RewardsSystem onBack={() => setShowRewards(false)} onRedeem={handlePointsRedeemedWrapper} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EDashboard;