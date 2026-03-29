// src/pages/Dashboard/CDashboard.tsx  ← UPDATED: tab state restore + rag picker stories fix
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode, Truck, Camera, Calendar,
  GraduationCap, Gamepad2, Users, BarChart3, Leaf, Bot,
  Coins, Flame, Medal, TrendingUp, Wind, IdCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RewardsSystem from "@/components/RewardsSystem";
import { useAuth } from "@/hooks/use-auth";
import QRScanner from "@/components/QRScanner";
import ReportingSystem from "@/components/ReportingSystem";
import EWasteDay from "@/components/EWasteDay";
import WasteChatbot from "@/components/WasteChatbot";
import Activities from "../Activities";
import { usePoints } from "@/contexts/PointsContext";
import { FiHome, FiActivity, FiBook, FiAward } from "react-icons/fi";
import { Progress } from "@/components/ui/progress";
import SchedulePickup from "@/components/SchedulePickup";
import AIWasteClassifier from "@/components/AIWasteClassifier";
import { LiveDashboardStats } from "@/components/LiveDashboardStats";
import DashboardHeader from "@/components/DashboardHeader";
import CarbonTracker from "@/components/CarbonTracker";
// ── NEW ──────────────────────────────────────────────────────────────────────
import RagPickerIdentityWidget from "@/components/ragpicker/RagPickerIdentityWidget";
// ─────────────────────────────────────────────────────────────────────────────

const CDashboard = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { toast } = useToast();
  const { coins, earn, redeem } = usePoints();

  // Restore last active tab when navigating back
  const defaultTab = (location.state as any)?.activeTab || "overview";

  const [streak]          = useState<number>(7);
  const [weeklyGoal]      = useState<number>(500);
  const [weeklyProgress]  = useState<number>(350);
  const [showRewards, setShowRewards]               = useState(false);
  const [showQRScanner, setShowQRScanner]           = useState(false);
  const [showReporting, setShowReporting]           = useState(false);
  const [showEWasteDay, setShowEWasteDay]           = useState(false);
  const [showSchedulePickup, setShowSchedulePickup] = useState(false);
  const [showAIClassifier, setShowAIClassifier]     = useState(false);

  const handlePointsEarnedWrapper  = (points: number, meta: any) => { earn(points, meta); };
  const handlePointsRedeemedWrapper = (points: number): void => { redeem(points); };

  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", points: 2850, district: "Mumbai" },
    { rank: 2, name: "Raj Patel",    points: 2720, district: "Delhi" },
    { rank: 3, name: "Anita Kumar",  points: 2650, district: "Bangalore" },
    { rank: 4, name: user ? (user.displayName || "You") : "You", points: coins, district: "Your District", isUser: true },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Upgraded Header ── */}
      <DashboardHeader
        name={user?.displayName || "User"}
        subtitle={`Swachh Buddy · ID: ${user?.uid ? user.uid.slice(0, 10) + "…" : "—"}`}
        role="citizen"
        levelBadge="Level 1"
        stats={[
          { value: coins,   label: "Points",       icon: <TrendingUp className="h-3.5 w-3.5 text-white" />, highlight: true },
          { value: coins,   label: "Coins",        icon: <Coins className="h-3.5 w-3.5 text-white" /> },
          { value: `🔥 ${streak}`, label: "Streak", icon: <Flame className="h-3.5 w-3.5 text-white" /> },
          { value: "#4",    label: "District Rank", icon: <Medal className="h-3.5 w-3.5 text-white" /> },
          { value: `${Math.round((weeklyProgress / weeklyGoal) * 100)}%`, label: "Weekly Goal", icon: <TrendingUp className="h-3.5 w-3.5 text-white" /> },
        ]}
      />

      {/* ── Tabs ── */}
      <div className="container mx-auto p-3 md:p-5">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 gap-1 md:gap-2 rounded-2xl bg-muted/60 p-1.5 md:p-2 shadow-sm">
            {[
              { value: "overview",    icon: <FiHome className="w-4 h-4 flex-shrink-0" />,    label: "Overview" },
              { value: "carbon",      icon: <Wind className="w-4 h-4 flex-shrink-0 text-green-600" />, label: "Carbon" },
              { value: "activities",  icon: <FiActivity className="w-4 h-4 flex-shrink-0" />, label: "Activities" },
              { value: "learning",    icon: <FiBook className="w-4 h-4 flex-shrink-0" />,     label: "Learning" },
              { value: "leaderboard", icon: <FiAward className="w-4 h-4 flex-shrink-0" />,   label: "Leaderboard" },
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

            <LiveDashboardStats />

            {/* ── NEW: Rag Picker Identity Widget ── */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
                <IdCard className="h-5 w-5 text-green-600" />
                Support Waste Pickers
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs ml-1">New</Badge>
              </h2>
              <RagPickerIdentityWidget />
            </div>

            {/* ── Quick Actions ── */}
            <h2 className="text-xl md:text-2xl font-bold mb-3">Quick Actions</h2>
            <div className="flex space-x-3 md:space-x-6 overflow-x-auto py-2 pb-3 scrollbar-hide">
              {[
                { icon: QrCode,    label: "Scan QR",         color: "bg-green-100 text-green-700",  onClick: () => setShowQRScanner(true) },
                { icon: Camera,    label: "Report Issue",    color: "bg-red-100 text-red-700",      onClick: () => setShowReporting(true) },
                { icon: Truck,     label: "Schedule Pickup", color: "bg-blue-100 text-blue-700",    onClick: () => setShowSchedulePickup(true) },
                { icon: Calendar,  label: "E-Waste Day",     color: "bg-purple-100 text-purple-700",onClick: () => setShowEWasteDay(true) },
                { icon: Bot,       label: "AI Classifier",   color: "bg-amber-100 text-amber-700",  onClick: () => setShowAIClassifier(true) },
                { icon: Coins,     label: "Rewards",         color: "bg-yellow-100 text-yellow-700",onClick: () => setShowRewards(true) },
              ].map(a => (
                <div key={a.label} className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer" onClick={a.onClick}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${a.color} shadow-sm hover:shadow-md transition-shadow`}>
                    <a.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-center w-16 leading-tight">{a.label}</span>
                </div>
              ))}
            </div>

            {/* ── Weekly Progress ── */}
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

          {/* ── CARBON ── */}
          <TabsContent value="carbon">
            <CarbonTracker />
          </TabsContent>

          {/* ── ACTIVITIES ── */}
          <TabsContent value="activities">
            <Activities />
          </TabsContent>

          {/* ── LEARNING ── */}
          <TabsContent value="learning" className="space-y-4">
            <h2 className="text-xl font-bold">Learning Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Waste Basics",         href: "/learning/waste-basics",     icon: GraduationCap },
                { title: "Community Leadership",  href: "/learning/community-basics", icon: Users },
                { title: "Eco Sorter Game",      href: "/eco-sorter-game",            icon: Gamepad2 },
                { title: "Rag Picker Stories",   href: "/ragpicker-stories",          icon: IdCard },
              ].map(l => (
                <Card key={l.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-4 flex items-center gap-3">
                    <l.icon className="h-6 w-6 text-primary" />
                    <p className="font-medium text-sm flex-1">{l.title}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(l.href, { state: { from: "/dashboard/corporate", activeTab: "learning" } })}
                    >
                      Go
                    </Button>
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
                      <div className="font-bold text-primary text-sm md:text-base">{u.points} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Modals ── */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onPointsEarned={(pts) => handlePointsEarnedWrapper(pts, { source: "QR" })}
      />
      <ReportingSystem
        isOpen={showReporting}
        onClose={() => setShowReporting(false)}
        onPointsEarned={(pts) => handlePointsEarnedWrapper(pts, { source: "Report" })}
      />
      <SchedulePickup isOpen={showSchedulePickup} onClose={() => setShowSchedulePickup(false)} />
      <EWasteDay isOpen={showEWasteDay} onClose={() => setShowEWasteDay(false)} />
      <AIWasteClassifier isOpen={showAIClassifier} onClose={() => setShowAIClassifier(false)} />
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

export default CDashboard;