// src/pages/Dashboard/CDashboard.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode, Truck, Camera, Calendar,
  GraduationCap, Gamepad2, Users, BarChart3, Leaf, Bot,
  Coins, Flame, Medal, TrendingUp,
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

const CDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { coins, earn, redeem } = usePoints();

  const [streak]          = useState<number>(7);
  const [weeklyGoal]      = useState<number>(500);
  const [weeklyProgress]  = useState<number>(350);
  const [showRewards, setShowRewards]               = useState(false);
  const [showQRScanner, setShowQRScanner]           = useState(false);
  const [showReporting, setShowReporting]           = useState(false);
  const [showEWasteDay, setShowEWasteDay]           = useState(false);
  const [showSchedulePickup, setShowSchedulePickup] = useState(false);
  const [showAIClassifier, setShowAIClassifier]     = useState(false);

  const handlePointsEarnedWrapper = (points: number, meta: any) => { earn(points, meta); };
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
          {
            value: coins,
            label: "Points",
            icon: <TrendingUp className="h-3.5 w-3.5 text-white" />,
            highlight: true,
          },
          {
            value: coins,
            label: "Coins",
            icon: <Coins className="h-3.5 w-3.5 text-white" />,
          },
          {
            value: `🔥 ${streak}`,
            label: "Streak",
            icon: <Flame className="h-3.5 w-3.5 text-white" />,
          },
          {
            value: "#4",
            label: "District Rank",
            icon: <Medal className="h-3.5 w-3.5 text-white" />,
          },
          {
            value: `${Math.round((weeklyProgress / weeklyGoal) * 100)}%`,
            label: "Weekly Goal",
            icon: <TrendingUp className="h-3.5 w-3.5 text-white" />,
          },
        ]}
      />

      {/* ── Tabs ── */}
      <div className="container mx-auto p-3 md:p-5">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-1 md:gap-3 rounded-2xl bg-muted/60 p-1.5 md:p-2 shadow-sm">
            {[
              { value: "overview",    icon: <FiHome className="w-4 h-4 flex-shrink-0" />,    label: "Overview" },
              { value: "activities",  icon: <FiActivity className="w-4 h-4 flex-shrink-0" />, label: "Activities" },
              { value: "learning",    icon: <FiBook className="w-4 h-4 flex-shrink-0" />,     label: "Learning" },
              { value: "leaderboard", icon: <FiAward className="w-4 h-4 flex-shrink-0" />,    label: "Leaderboard" },
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
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Quick Actions</h2>
              <div className="flex space-x-3 md:space-x-6 overflow-x-auto py-2 pb-3 scrollbar-hide">
                {[
                  { icon: <QrCode className="h-6 w-6 md:h-7 md:w-7" />,   label: "Scan QR Code",    desc: "Verify disposal (+25 pts)",   onClick: () => setShowQRScanner(true) },
                  { icon: <Bot className="h-6 w-6 md:h-7 md:w-7" />,      label: "AI Classifier",   desc: "Photo → AI identifies waste", onClick: () => setShowAIClassifier(true) },
                  { icon: <Truck className="h-6 w-6 md:h-7 md:w-7" />,    label: "Track Truck",     desc: "Locate vehicles",             onClick: () => navigate("/live-map") },
                  { icon: <Camera className="h-6 w-6 md:h-7 md:w-7" />,   label: "Report Issue",    desc: "Missed pickup (+50 pts)",      onClick: () => setShowReporting(true) },
                  { icon: <Calendar className="h-6 w-6 md:h-7 md:w-7" />, label: "Schedule Pickup", desc: "Book from home",              onClick: () => setShowSchedulePickup(true) },
                  { icon: <Calendar className="h-6 w-6 md:h-7 md:w-7" />, label: "E-Waste Day",     desc: "Monthly drive (+75 pts)",     onClick: () => setShowEWasteDay(true) },
                ].map((action, i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all flex-shrink-0 w-36 md:w-64" onClick={action.onClick}>
                    <CardContent className="p-3 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-3">
                      <div className="p-2 md:p-3 rounded-full bg-primary/10 text-primary">{action.icon}</div>
                      <h3 className="font-semibold text-xs md:text-base">{action.label}</h3>
                      <p className="text-xs text-muted-foreground hidden md:block">{action.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-base md:text-lg">Points Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">📲 QR Scan — +25 pts</div>
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">🎓 Training — +100 pts</div>
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">📷 Report — +50 pts</div>
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">♻️ E-Waste — +75 pts</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-base md:text-lg">Weekly Progress</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    You're {weeklyGoal - weeklyProgress} points away from your goal!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 font-medium text-sm md:text-base">{weeklyProgress} / {weeklyGoal} pts</div>
                  <div className="h-3 bg-muted/20 rounded overflow-hidden">
                    <div style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }} className="h-full bg-primary transition-all duration-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    You're at {Math.round((weeklyProgress / weeklyGoal) * 100)}% this week.
                  </p>
                </CardContent>
              </Card>
            </div>

            <LiveDashboardStats />
          </TabsContent>

          {/* ── ACTIVITIES ── */}
          <TabsContent value="activities">
            <Activities />
          </TabsContent>

          {/* ── LEARNING ── */}
          <TabsContent value="learning" className="space-y-4 md:space-y-6">
            <div className="text-center mb-2 md:mb-4">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Continue Learning</h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Access comprehensive waste management education and interactive games
              </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-primary text-base md:text-lg">
                  <Leaf className="h-5 w-5" />
                  Your Duties as a Citizen
                </CardTitle>
                <CardDescription>Key responsibilities to help keep India clean</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {[
                    { icon: "🟢", duty: "Segregate waste at home — wet, dry, and hazardous bins" },
                    { icon: "📲", duty: "Scan QR code every time you hand over waste to the collector" },
                    { icon: "📷", duty: "Report missed pickups and illegal dumping with photos" },
                    { icon: "♻️", duty: "Participate in monthly E-Waste collection drives" },
                    { icon: "🌱", duty: "Compost organic waste at home or in your colony" },
                    { icon: "🎓", duty: "Complete all 3 levels of waste management training" },
                    { icon: "📅", duty: "Schedule bulk pickups for furniture, e-waste, and construction debris" },
                    { icon: "📣", duty: "Spread awareness about waste segregation to neighbours and family" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-white dark:bg-background rounded-lg border border-primary/10">
                      <span className="text-lg md:text-xl flex-shrink-0">{item.icon}</span>
                      <p className="text-xs md:text-sm text-foreground">{item.duty}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" /> Core Training
                  </CardTitle>
                  <CardDescription>Complete the 3-level mandatory training program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span>Progress</span><span>2/3 levels</span></div>
                    <Progress value={67} className="h-2" />
                    <Button asChild className="w-full"><Link to="/learning">Continue Training</Link></Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center">
                    <Gamepad2 className="mr-2 h-5 w-5" /> Learning Games
                  </CardTitle>
                  <CardDescription>Play interactive games to reinforce knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span>Games Played</span><span>12</span></div>
                    <div className="flex justify-between text-sm"><span>Points Earned</span><span>850 pts</span></div>
                    <Button asChild variant="outline" className="w-full"><Link to="/play">Play Games</Link></Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Specialized Courses
                  </CardTitle>
                  <CardDescription>Role-specific training for your user type</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="secondary" className="w-full"><Link to="/learning">Explore Courses</Link></Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base md:text-lg">
                  <BarChart3 className="mr-2 h-5 w-5" /> Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-primary">67%</div><div className="text-xs md:text-sm text-muted-foreground">Training Complete</div></div>
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-success">12</div><div className="text-xs md:text-sm text-muted-foreground">Games Played</div></div>
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-warning">5</div><div className="text-xs md:text-sm text-muted-foreground">Certificates</div></div>
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-accent">850</div><div className="text-xs md:text-sm text-muted-foreground">Learning Points</div></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── LEADERBOARD ── */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader><CardTitle className="text-base md:text-lg">District Leaderboard</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 md:space-y-3">
                  {leaderboardData.map((u, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2 md:p-3 rounded ${u.isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0
                          ${u.rank === 1 ? "bg-yellow-400 text-yellow-900" : u.rank === 2 ? "bg-gray-300 text-gray-700" : u.rank === 3 ? "bg-orange-400 text-orange-900" : "bg-muted text-foreground"}`}>
                          {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                        </div>
                        <div>
                          <div className="font-medium text-sm md:text-base">
                            {u.name} {u.isUser && <span className="text-primary text-xs">(You)</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">{u.district}</div>
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